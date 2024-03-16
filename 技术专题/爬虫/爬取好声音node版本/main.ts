import { get as httpGet } from "http";
import { get as httpsGet } from "https";
import { createWriteStream, readFileSync, existsSync, mkdirSync, rmSync, writeFileSync, readdirSync, statSync} from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { useSignal, tickCount } from "./util";
import { type HowToRequestTsFile, requestByHttps } from "./requestStrategy";

const dirname = __dirname;
const tempDir = "temp";
const tempDirAbsolutePath = `${dirname}/${tempDir}`;

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

// 2. 解析m3u文件，返回 ts 文件url
function parseM3UFile(m3uFile: string, tsFileMap: (tsFileName: string) => string): string[] {
    const content = readFileSync(m3uFile, "utf-8");
    return content
        .split("\n")
        .filter((line) => /^.*\.ts/g.test(line))
        // e.g. http://hw-vl.cztv.com/fdfafa/fadfd.ts
        .map(tsFileMap);
}

// 3. 下载 ts 文件到本地临时文件夹
function downloadTsFile(urls: string[], howToRequestTsFile: HowToRequestTsFile): Promise<string[]> {
    const tag = Date.now().toString().slice(0, 5);
    const urlAndSavedFiles = urls.map((url, index) => [url, path.join(tempDirAbsolutePath, `${tag}_${index+1}.ts`),  path.join(tempDir,`${tag}_${index+1}.ts`)])

    const [signal, _, promise] = useSignal<string[]>();
    
    let finished = 0;
    const all = urlAndSavedFiles.length;

    // record the failed url index
    const failedQueue: number[] = [];

    // we just retry at most 3 times if one url is requested with fail
    const retryTimes = 3;

    const doFinishWork = (callback?: (failedUrlAndDest: { url: string, dest: string }[]) => void) => {
        if (finished === all) {
            const failedUrlAndDest = failedQueue.map(index => ({ url: urlAndSavedFiles[index][0], dest: urlAndSavedFiles[index][1] }))
            failedUrlAndDest.forEach(({ url, dest }) => console.log("failed:\nurl: %s\ndest: %s", url, dest))
            
            signal(
                urlAndSavedFiles
                    .filter((_, index) => failedQueue.indexOf(index) === -1)
                    .map(([_, __, file]) => file)
            );
            callback?.(failedUrlAndDest);
            // 释放内存
            urlAndSavedFiles.splice(0);
        }
    };

    let cursor = 0;

    // avoid sending request so frequently,
    // in this way, server won't consider us as a hacker attack
    const ID = setInterval(() => {
        // 每每发出三次请求，空2个拍子
        if (cursor > 0 && cursor % 3 === 0 && tickCount(2)) {
            return;
        }

        if (cursor >= all) {
            clearInterval(ID);
            return;
        }

        const index = cursor;
        cursor++;
        const [url, savedFile] = urlAndSavedFiles[index];

        const writeStream = createWriteStream(
            savedFile,
            { flags: "w+" }
        );

        let retry = 0;

        const tryAgain = () => {
            if (retry < retryTimes) {
                retry++;
                console.log(`try again ${retry} times: ${url}`)
                return true;
            };

            return false;
        };

        const tryToDoFinishWork = (callback?: () => void) => {
            finished++;
            doFinishWork(callback);
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
        
        howToRequestTsFile(url, writeStream, hooks);
    }, 800);
        
    return promise;  
}

// 4. ts 文件合并转为 mp4 文件
function tsToMp4(tsFiles: string[]): Promise<string> {
   const outputMp4 = `${tempDir}/output.mp4`;
   // I intend to invoke `ffmpeg` child process, but it's
   // always failed because of long input args.So I give up.
   //
   // Then I find that if I write  `ffmpeg` commands in .sh file,
   // run this file, everything works well.
   writeFileSync("task.sh", `ffmpeg -i "concat:${tsFiles.join("|")}" -c copy ${outputMp4}`, { encoding: "utf-8", flag: "w+"});
   const result = spawnSync("sh", ["task.sh"]);
   // 上一步没有成功的话，再尝试一次
   if (result.stderr.length) {
    spawnSync("sh", ["task.sh"]);
   }
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

function onlyKeepOutputFile() {
    if (existsSync(tempDirAbsolutePath)) {
        // 删除所有 ts m3u文件
        readdirSync(tempDirAbsolutePath)
            .filter(fileOrDirName => /\.ts|m3u$/.test(fileOrDirName))
            .map(fileOrDirName => `${tempDirAbsolutePath}/${fileOrDirName}`)
            .filter(fileOrDirAbsolutePath => statSync(fileOrDirAbsolutePath).isFile())
            .forEach(fileAbsolutePath => rmSync(fileAbsolutePath))
    }
}

function run(options: Options) {
    makeDiskReady();
    const { m3uFileUrl, headers, tsFileNameMap, howToRequestTsFile } = options;

    getM3UFile(m3uFileUrl, headers)
        .then(file => parseM3UFile(file, tsFileNameMap))
        .then(tsFiles => downloadTsFile(tsFiles, howToRequestTsFile))
        .then(savedTsFiles => { 
            console.log("download done: ts files")
            if (process.env.stopAfterTsFilesDownload === 'true') {
                throw Error("stop after download all of ts files")
            }
            return savedTsFiles
        })
        .then(savedTsFiles => tsToMp4(savedTsFiles))
        .then(message => { console.log("all works done:\n%s", message)})
        .then(() => {
            const seconds = 5;
            console.log(`after ${seconds} seconds operate: clear ts or m3u files`);
            setTimeout(() => onlyKeepOutputFile(), seconds * 1_000);
        })
        .catch(err => { console.log("failed\nerror: ", err)})
}

const VoiceOfChinaOptions: Options = {
    m3uFileUrl: "https://qhshenghuo.xyz/videos/ed22de81305e207cbbd4ca4b467d7f280ecc6c67/g.m3u8?h=d11925605f2a1ef",
    // m3uFileUrl: "<your-m3u8-file-url>",
    headers: {},
    tsFileNameMap: (tsFileName: string) => {
        // e.g. https://fdfas/dsfa/g.m3u8dfafaffada => https://fdfas/dsfa/
        const origin = VoiceOfChinaOptions.m3uFileUrl.replace(/g\.m3u8.*?$/, '');
        return `${origin}${tsFileName}`;
    },
    howToRequestTsFile: requestByHttps,
};

type Options = {
    m3uFileUrl: string,
    headers: Record<string, string>,
    tsFileNameMap: (tsFileName: string) => string,
    howToRequestTsFile: HowToRequestTsFile,
};


run(VoiceOfChinaOptions);


// videoCodec: avc1.4d400d
// audioCodec:  mp4a.40.2


// ffmpeg helper codes:
//
// 1. mp4去字幕：
// ffmpeg -i video.mp4 -vcodec copy -acodec copy -sn video-no-subs.mp4
//
//
// 2. mp4转mp3:
// ffmpeg -i output.mp4 -vn -ar 44100 -ac 2 -b:a 192k output.mp3
//
//  192k指的是音频比特率，值越大，单位时间采取的数据越多，音乐质量越高，
//  常见取值： 32k 48k 64k 96k 128k 192k 256k;
//  建议使用 大于 32k 的值，32k的时候，声音会断断续续，发虚，这里有一个实验：
//     原来的音频是2.1M，经过不同比特率处理后，得到的新文件的大小
//           32k         1.2M
//           48k         1.5M
//           64k         2M
//           72k         2M
//           80k         2.5M
//           96k         3.1M
//
// 3. 多个mp3合并
// ffmpeg -i "concat:1.mp3|2.mp3|3.mp3" -c copy ./out.mp3
//
// 4. 多个mp4合并
// ffmpeg -i "concat:1.mp4|2.mp4|3.mp4" -c copy ./out.mp4
// 如果多个Mp4无法正常合并，非常有可能是其中的某几个mp4文件损坏，比如 macOS的
// 预览无法看到视频，这些损坏的文件会将视频分割开，导致它所在的视频组合并失败，
// 只需将这些视频找出来删除即可