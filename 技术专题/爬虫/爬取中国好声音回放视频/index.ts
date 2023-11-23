import { get as httpGet } from "http";
import { get as httpsGet } from "https";
import { createWriteStream, readFileSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "bun";

const dirname = import.meta.dir;
const tempDir = "temp";
const tempDirAbsolutePath = `${dirname}/${tempDir}`;

function useSignal<T>(): [((value: T) => void), ((reason: any) => void), Promise<T>] {
    let signal: null | ((value: T) => void) = null;
    let refuse: null | ((reason: any) => void) = null;

    const promise = new Promise<T>((resolve, reject) => { signal = resolve; refuse = reject; });

    return [signal!, refuse!, promise];
}

// 1. get M3U file
function getM3UFile(m3uFileUrl: string, headers: Record<string, string>): Promise<string> {
    const m3uFile = `${tempDirAbsolutePath}/${Date.now().toString().slice(-5)}.m3u`;
    const writeStream = createWriteStream(m3uFile, { flags: 'w+', mode: 0o770 });
    const [signal, _, promise] = useSignal<string>();
    
    const get = m3uFileUrl.includes("https") ? httpsGet : httpGet;

    get(
        m3uFileUrl, 
        { headers }, 
        (res) => {
            res.on("data", (chunk) => {
                writeStream.write(chunk);
            });

            res.on("end", () => {
                writeStream.end(() => signal(m3uFile));
                writeStream.close();
            });
            
        }
    );

    return promise;
}

function parseM3UFile(m3uFile: string, tsFileMap: (tsFileName: string) => string): string[] {
    const content = readFileSync(m3uFile, "utf-8");
    return content
        .split("\n")
        .filter((line) => /^\/.*\.ts/g.test(line))
        // e.g. http://hw-vl.cztv.com/fdfafa/fadfd.ts
        .map(tsFileMap);
}



function downloadTsFile(urls: string[], howToRequestTsFile: Options["howToRequestTsFile"]): Promise<string[]> {
    const tag = Date.now().toString().slice(0, 5);
    const urlAndSavedFiles = urls.map((url, index) => [url, path.join(tempDirAbsolutePath, `${tag}_${index+1}.ts`),  path.join(tempDir,`${tag}_${index+1}.ts`)])

    const [signal, _, promise] = useSignal<string[]>();
    
    let finished = 0;
    const all = urlAndSavedFiles.length;

    // record the failed url index
    const failedQueue: number[] = [];

    // we just retry at most 3 times if one url is requested with fail
    const retryTimes = 3;

    const doFinishWork = () => {
        if (finished === all) {
            failedQueue.forEach((index) => console.log("failed:\nurl: %s\ndest: %s", urlAndSavedFiles[index][0], urlAndSavedFiles[index][1]))
            signal(
                urlAndSavedFiles
                    .filter((_, index) => failedQueue.indexOf(index) === -1)
                    .map(([_, __, file]) => file)
            );
        }
    };

    urlAndSavedFiles
        .forEach(([url, savedFile], index) => {
            const writeStream = createWriteStream(
                savedFile,
                { flags: "w+" }
            );

            let retry = 0;

            const tryAgain = () => {
                if (retry < retryTimes) {
                    retry++;
                    return true;
                };

                return false;
            };

            const tryToDoFinishWork = () => {
                finished++;
                doFinishWork();
            };
            
            const pushIntoFailedQueue = () => {
                failedQueue.push(index);
            };

            const clearBrokenFile = () => Promise.resolve().then(() => rmSync(savedFile));

            const hooks = {
                tryAgain,
                tryToDoFinishWork,
                pushIntoFailedQueue,
                clearBrokenFile,
            };
            
            // avoid sending request so frequently,
            // in this way, server won't consider us as a hacker attack
            setTimeout(() => { howToRequestTsFile(url, writeStream,hooks)}, 0);
        });
        
    return promise;  
}

function tsToMp4(tsFiles: string[]): Promise<string> {
   const outputMp4 = `${tempDir}/output.mp4`;
   // I intend to invoke `ffmpeg` child process, but it's
   // always failed because of long input args.So I give up.
   //
   // Then I find that if I write  `ffmpeg` commands in .sh file,
   // run this file, everything works well.
   writeFileSync("task.sh", `ffmpeg -i "concat:${tsFiles.join("|")}" -c copy ${outputMp4}`, { encoding: "utf-8", flag: "w+"});
   // remember that we run this file in bun runtime, so we have use `spawnSync` of bun version
   spawnSync(["sh", "task.sh"]);
   return Promise.resolve("ffmpeg finish its work");
}


function makeDiskReady() {
    if (existsSync(tempDirAbsolutePath)) {
        // clear temp/*
        // rmSync is different from `rm` in shell!
        // when run `rm -rf temp`, temp will be removed too,
        // on the contrast, rmSync only remove files under temp.
        rmSync(`${tempDirAbsolutePath}`, { recursive: true, force: true }); 
    }

    mkdirSync(tempDirAbsolutePath);
}

type Options = {
    m3uFileUrl: string,
    headers: Record<string, string>,
    tsFileNameMap: (tsFileName: string) => string,
    howToRequestTsFile: (url: string, writer: any, hooks: {
        tryAgain: () => boolean,
        tryToDoFinishWork: () => void,
        pushIntoFailedQueue: () => void,
        clearBrokenFile: () => Promise<void>,
    }) => void,
};

function run(options: Options) {
    makeDiskReady();
    const { m3uFileUrl, headers, tsFileNameMap, howToRequestTsFile } = options;

    getM3UFile(m3uFileUrl, headers)
        .then(file => parseM3UFile(file, tsFileNameMap))
        .then(tsFiles => downloadTsFile(tsFiles, howToRequestTsFile))
        .then(savedTsFiles => tsToMp4(savedTsFiles))
        .then(message => { console.log("all works done:\n%s", message)})
        .catch(err => { console.log("failed\nerror: ", err)})
}


const VoiceOfChinaOptions: Options = {
    m3uFileUrl: "http://hw-vl.cztv.com/channels/lantian/channel01/360p.m3u8/1691157979000,1691164800000",
    headers: {
        'Accept': "*/*",
        'Origin': "http://tv.cztv.com",
        'Accept-Language': "zh-CN,zh-Hans;q=0.9",
        'Host': 'hw-vl.cztv.com',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15',
        'Referer': 'http://tv.cztv.com/',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive'
    },
    tsFileNameMap: (tsFileName: string) => {
        const origin = "http://hw-vl.cztv.com";
        return `${origin}${tsFileName}`;
    },
    howToRequestTsFile: (url, writer, hooks) => {
        const {pushIntoFailedQueue, tryAgain, tryToDoFinishWork, clearBrokenFile} = hooks;

        const fetchFile = (_url: string) => 
                httpGet(_url, (res) => {
                    res.on("data", chunk => writer.write(chunk));
    
                    res.on(
                        "end", 
                        () => { 
                            writer.end(() => {
                               tryToDoFinishWork();
                            });
                            writer.close();
                        });
                })
                .on("error", (err) => {
                    // really important part!
                    // you have to retry if request is failed at first time
                    if (tryAgain()) {
                        fetchFile(_url);
                    } else {
                       pushIntoFailedQueue();
                       writer.close();
                       clearBrokenFile();
                       tryToDoFinishWork();
                    }
                });
        
        fetchFile(url);
    }
};


