import { connect } from "node:http2";
import { get as httpsGet } from "https";
import { memorize } from "./util";
import fs from "node:fs";

export type HowToRequestTsFile = (url: string, writer: any, hooks: {
    tryAgain: () => boolean,
    tryToDoFinishWork: (callback?: (context: any) => void) => void,
    pushIntoFailedQueue: () => void,
    clearBrokenFile: () => Promise<void>,
}) => void;

export const requestByHttp2: HowToRequestTsFile = (url, writer, hooks) => {
    const {pushIntoFailedQueue, tryAgain, tryToDoFinishWork, clearBrokenFile} = hooks;

        const onceConnect = memorize(connect) as typeof connect;
        const http2Session = onceConnect(url);
        const urlObj = new URL(url);

        const fetchFile = (_url: string) => {
            const stream = http2Session.request({
                ":method": "GET",
                ":scheme": "https",
                ":authority": urlObj.hostname,
                ":path": urlObj.pathname,
                "Accept": "*/*",
                "Host": urlObj.hostname,
                "Accept-Language": "zh-CN,zh-Hans;q=0.9",
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.2 Safari/605.1.15",
                "Referer": "http://thep2385.cc/",
                "Accept-Encoding": "identity",
            });

            stream.on("data", chunk => writer.write(chunk));
            stream.on("end", () => {
                writer.end(() => tryToDoFinishWork(() => http2Session.close()));
                writer.close();
                stream.close();
            });
            stream.on("error", (err) => {
                 // really important part!
                 // you have to retry if request is failed at first time
                if (tryAgain()) {
                    fetchFile(_url);
                } else {
                    pushIntoFailedQueue();
                    writer.close();
                    clearBrokenFile().then(_ => http2Session.close());
                    tryToDoFinishWork();
                }
            });
        };    
        fetchFile(url);
};


export const requestByHttps: HowToRequestTsFile = (url, writer, hooks) => {
    const {pushIntoFailedQueue, tryAgain, tryToDoFinishWork, clearBrokenFile} = hooks;
    
    // 有些服务器会设置一层请求检测，将部分请求标记为网络攻击，
    // 一旦被标记为网络攻击，请求方就会上黑名单，请求被阻断，
    // 为了防止这一点，加入头部信息，伪装成浏览器发送请求的行为
    const headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.2 Safari/605.1.15",
        "Referer": "https://thep2385.cc/",
    };

    const retryWork = (error?: Error) => {
        if (tryAgain()) {
            fetchFile();
        } else {
            pushIntoFailedQueue();
            writer.close(() => {
                clearBrokenFile().then(() => {
                    tryToDoFinishWork((failedMessage) => {
                        const logFile = fs.openSync('./log.txt', fs.constants.O_CREAT | fs.constants.O_RDWR | fs.constants.O_TRUNC, 0o755);
                        for (const item of failedMessage) {
                           fs.writeSync(logFile, `${item.url}\n${item.dest}`)
                        }
                        fs.closeSync(logFile)
                    });
                });
            });
        }
    };

    const fetchFile = () => {
        const clientRequest = httpsGet(url, { headers });
    
        clientRequest.on("response", (r) => {
            const milliseconds = 5_000;

            // 默认情况下，服务器如果长期没有响应返回（比如服务器出于安全故意不应答），
            // nodejs会一直保持连接，令进程长期“阻塞”。为了解决这个问题，应该设置
            // 超时时间，超出这个时间，客户端主动断开连接
            r.setTimeout(milliseconds, () => {
                r.destroy();
                // 最多触发 retrytimes 的请求，不会陷入死循环
                retryWork();
            });

            r.on("data", chunk => {
                writer.write(chunk);
            });

            // r所有的数据都被读取了
            r.on("end", () => {
                // 调用 end 方法后，writer会自动close，无需调用writer.close()
                writer.end(() => tryToDoFinishWork());
            });

            // r 读取数据发生错误
            r.on("error", (err) => {
                retryWork(err);
            });
        });

        // clientRequest写入数据发生错误
        clientRequest.on("error", () => {
            console.log("request error")
        });

        clientRequest.end();
    };

    fetchFile();
};