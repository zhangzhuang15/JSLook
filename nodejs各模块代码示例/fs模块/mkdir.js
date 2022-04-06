const fs = require("fs");

fs.mkdirSync(`${__dirname}/tmp/panda`,
             {
                 recursive: true     // 设置 递归创建文件夹
             }
);


setTimeout(
    () => {
        fs.rmSync(`${__dirname}/tmp`,
                    {
                        recursive: true  // 表示递归删除文件夹，在node.js 未来版本， rmdir将被淘汰，所以使用 rm；
                                         // rmdir删除文件夹时，文件夹必须是空的。
                    } );
    }
    , 5000
);