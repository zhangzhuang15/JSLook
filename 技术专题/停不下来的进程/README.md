## Description
我在个人电脑里安装美团的MOA软件，发现它会破坏电脑的数据隐私，我决定卸载掉它。当我在Finder中，
删除MOA的图标时，跳出弹窗提示：MOA已经打开，不能删除。我就想删除MOA的进程。我将所有的MOA进程
终止之后，发现它们自己又启动了，我有点懵。

## Why
`/Library/LaunchAgents` 和 `/Library/LaunchDaemons` 目录下，存放着很多 .plist 文件。
这些 .plist 文件，就是罪魁祸首，它们指定哪些进程会一直运行。

`/Library/LaunchAgents`中指定的进程，会在用户登录macOS时启动；

`/Library/LaunchDaemons`中指定的进程，会在macOS启动时启动；

给出一个具体的.plist例子：
```plist
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>KeepAlive</key>
	<true/>
	<key>RunAtLoad</key>
	<true/>
	<key>Label</key>
	<string>com.meituan.moa</string>
	<key>ProgramArguments</key>
	<array>
		<string>/Applications/MOA.app/Contents/MacOS/moatray</string>
	</array>
	<key>StandardOutPath</key>
	<string>/tmp/moaLaunch.log</string>
	<key>StandardErrorPath</key>
	<string>/tmp/moaLaunch.log</string>
</dict>
</plist>
```

**KeepAlive**： true
表示进程要一直运行，如果被终止， launchd 守护进程会重启它

**RunAtLoad**: true 
表示该进程在macOS 启动之后就执行


**com.meituan.moa** 是进程名，在活动监视器中你看到的就是它

**ProgramArguments** 指定的就是进程启动参数

## How 
想让这种App被卸载掉，要用 rm -rf 删除掉 App，然后终止哪些进程，进程再启动的时候，找不到App，加载不到参数，就没法启动成功了。最后，就是把相应的 .plist 文件删除掉。

在你删除 .plist 文件后，你就会发现 `系统偏好设置` -> `通用` -> `登录项` 里少了几个app logo。

## one more thing 
`/System/Library/LaunchDaemons` 和 `/System/Library/LaunchAgents` 也是同样的功能，
只不过它们定义的进程都是系统级别的进程，不是用户定义的，这些进程运行起来，其进程用户名都是root，
因此，最好不要删除这两个目录下的 .plist 文件 