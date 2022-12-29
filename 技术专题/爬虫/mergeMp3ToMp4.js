/**
 * 在B站上二刷《宝莲灯》动画，忽然想下载起来，以后离线观看。
 * 通过Http下载好该动画的视频和音频文件，然而视频文件.mp4没有
 * 音频，所以想怎么才能把音频文件合并到视频文件中。
 * 
 * 开始尝试用iMovie处理，但该软件不识别下载好的 .mp4文件，
 * 爱奇艺全能播放器倒是可以播放该视频，所以应该是 iMovie 的
 * 解码器能力有限。
 * 
 * 看了https://cloud.tencent.com/developer/ask/sof/343340?from=16139，
 * 使用 fluent-ffmpeg 库完成这个事情。
 * 
 * .mp4 一定不能有音频，否则本方案无效。
 */

const ffmpeg = require("fluent-ffmpeg");
const chalk = require("chalk");


if (process.argv.length < 5) {
    console.log(chalk.red("sorry, you must tell me where is mp3, mp4 and where you want to save on"));
    process.exit(500);
}
    
const mp4Path = process.argv.find(name => name.endsWith('.mp4'));
const mp3Path = process.argv.find(name => name.endsWith('.mp3'));
// 导出的文件一定要放在命令行参数最后
const dest = process.argv.slice(-1)[0];

if (!dest.endsWith(".mp4")) throw Error("Wrong extension name");

const start = new Date();

console.log(chalk.yellow("ready to merge .mp3 to .mp4 which has no background audio"));
console.log(`mp4 file: ${chalk.green(mp4Path)}`);
console.log(`mp3 file: ${chalk.green(mp3Path)}`);
console.log(`you will find the result at: ${chalk.blueBright(dest)}`);

new ffmpeg()
    .addInput(mp4Path)
    .addInput(mp3Path)
    .saveToFile(dest)
    .on("end", () => {
        // 中间处理时间比较长，真正的处理时间要么根据本事件完成，
        // 要么通过监听进程 exit 事件完成
        const end = new Date();
        console.log(`🎉Done! cost time: ${chalk.cyan(String(end - start))}ms`)
    });

