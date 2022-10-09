const fs = require("fs");


const dirents = fs.readdirSync(__dirname, 
              {
                  withFileTypes: true
              }
);
dirents.forEach(
    dirent => {
        console.log(dirent.name, "\t", "is File: ", dirent.isFile());
    }
);


fs.readdir(__dirname, 
          (err, files) => {
              if(!err) {
                  files.forEach(
                      (filename, index) => {
                          console.log("filename-", index, ": ", filename);
                      }
                  );
              }
          }
);

