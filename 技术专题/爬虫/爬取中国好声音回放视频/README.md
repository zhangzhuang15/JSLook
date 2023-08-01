## 思路
在[浙江卫视中国蓝官网](http://tv.cztv.com/live/)上观察视频播放标签`<video>`，src属性值就是回放视频的链接。

使用curl工具访问该链接，得到一个`M3U`文件。使用chatGPT询问，了解到这种文件本身不会被video标签支持，而该文件的内容是人类可读的，里边记录了若干媒体文件的链接信息。

下面就是该文件的一个具体例子：
```
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:8
#EXT-X-MEDIA-SEQUENCE:0
#EXT-X-PROGRAM-DATE-TIME:2023-07-28T20:22:17+0800
#EXTINF: 8.40
/channels/lantian/channel01/360p/0/00008a60ffeda6af_68f3d8_fa604.ts
#EXTINF: 8.40
/channels/lantian/channel01/360p/0/00008a60ffeda6af_7899dc_50d3c.ts
```

`#EXTINF`表示的就是媒体文件的链接地址。

但我们不知道具体的协议和域名。

继续观察网络面板，可以得到协议和域名。

使用该域名和协议，随机选择M3U文件的一个链接，组成一次http请求，得到一个 `.ts` 文件。

`.ts`文件是一种媒体文件，就和`.mp4`一样，不是指typescript代码文件。

`.ts` 文件是受`<video>`支持的。

同时，询问chatGPT，得到`.ts`转换为`.mp4`的方法：
```sh 
ffmpeg -i input.ts -c:v copy -c:a copy output.mp4
```

综合上述分析，得到下载好声音回放视频的思路：
1. 发送请求，获取M3U文件
2. 解析M3U文件，下载里面的`.ts`媒体文件；
3. 使用`ffmpeg`转码为`.mp4`文件；
4. 合并`.mp4`文件；

## Notice
Runtime is `bun`, not `nodejs`, make sure that you install bun in your computer.