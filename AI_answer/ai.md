### what I ask 
open AI answer or New Bing answer

### how to create a game on iPadOS ?
Creating a game on iPadOS requires a combination of programming skills and knowledge of the platform. There are several ways to create a game on iPadOS, but the most common approach is to use a game engine or development platform that supports the platform.

One popular game engine for iPadOS is Unity, which allows developers to create games using C# or JavaScript. Another option is to use Apple's own development platform, Xcode, which supports Objective-C and Swift programming languages.

To get started, you will need to download and install the necessary software and tools, including Xcode and the iOS SDK. You will also need to familiarize yourself with the iPadOS platform and its capabilities, such as touch input, accelerometer, and gyroscope.

Once you have the necessary tools and knowledge, you can start developing your game by creating the game logic, designing the user interface, and implementing the game mechanics. You can also use pre-built assets and resources, such as graphics and sound effects, to speed up the development process.

Overall, creating a game on iPadOS requires a combination of technical skills, creativity, and patience. With the right tools and approach, you can create a fun and engaging game that will entertain users on the iPadOS platform.

### what the difference between base64 and base64url
Hello, this is Bing. According to my search results, the difference between base64 and base64url is mainly the following:
- base64 uses A-Z, a-z, 0-9, +, / 64 printable characters to represent invisible characters, and possibly also = for padding.
- base64url is actually the same as base64, except that it replaces + with - and / with _, and removes the trailing padding character =.
- base64 encoding results contain + , / , = three special characters, which have a reserved meaning in some filesystem names and URLs, and need to be escaped; while base64url encoding results do not have these special characters, and can be directly used for URL transmission.
I hope this answers your question. 😊

reference:
1. https://stackoverflow.com/questions/55389211/string-based-data-encoding-base64-vs-base64url
2. https://stackoverflow.com/questions/60714578/how-to-choose-between-base-64-and-base64url-encoding
3. https://en.wikipedia.org/wiki/Base64

### 有了XMLHttpRequest，为什么还要有fetch
您好，这是Bing。根据我搜索的结果，XMLHttpRequest和fetch的区别主要有以下几点：
* XMLHttpRequest是早期的Ajax技术，它使用复杂的API和回调函数来实现异步请求，而fetch是现代的Ajax技术，它使用Promise和async/await来实现更简洁和优雅的异步请求。
* XMLHttpRequest需要手动设置请求头和解析响应数据，而fetch提供了通用的Header，Request和Response接口，可以更方便地处理各种类型的数据。
* XMLHttpRequest可以监听请求过程中的事件，如progress，abort等，而fetch目前还不支持这些事件。
* XMLHttpRequest可以发送同步请求，而fetch只能发送异步请求。
希望这能回答您的问题。😊