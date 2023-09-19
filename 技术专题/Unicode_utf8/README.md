## Unicode码
因为各国有自己的文字、符号，基本的ascii码无法满足需要。Unicode码应运而生。

Unicode码的编码范围是 **0x0000 ~ 0x10ffff**, 可以表达100多万个字符。比如“**中**”的 unicode码是 **0x4e2d**。

[unicode官网](https://home.unicode.org)

## UTF-8
Unicode为每一个字符，指定了独一无二的数值，那么落实到二进制表示上，应该怎么去表示呢？

所有的字符都用3个字节？

所有的字符都用4个字节？

UTF-8就是解决这种问题的一个办法，一个编码方案。

UTF-8的 8 表示至少要用 8bit 编码unicode。同理UTF-16的 16.

### UTF-8怎么编码？

UTF-8的格式下，字符至少被编码为1个字节，最多被编码为4个字节。

以编码“中”为例。

“中”的unicode码是 `0x4e2d`，改为二进制则表示为 `0100111000101101`.

查询 utf-8的编码表，得知unicode码值分布在 0x0800 ~ 0x0ffff的，需要编码为3个字节，对应的格式为(二进制)：
1110xxxx 10xxxxxx 10xxxxxx

如果要编码为1个字节，格式为：0xxxxxxx

如果要编码为2个字节，格式为：
110xxxxx 10xxxxxx 

如果要编码为4个字节，格式为：
11110xxx 10xxxxxx 10xxxxxx 10xxxxxx 


"中": 0100111000101101
编码格式：1110xxxx 10xxxxxx 10xxxxxx
对位入座，将“中”的编码填入格式里的x：
```
0100       111000      101101
1110xxxx   10xxxxxx    10xxxxxx 
```

得到结果：
11100100 10111000 10101101

转化为16进制：**0xe4b8ad**

所以“中”的unicode值是 `0x4e2d`，编码为utf-8后的值是 `0xe4b8ad`.

## javascript中的unicode和utf-8
```javascript 
const s = "中";

// 得到的是 "中" 的 unicode 值
s.charCodeAt(0);

// buffer存储的是“中”的utf-8编码值
Buffer.from(s);
```

