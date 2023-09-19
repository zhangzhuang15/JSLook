import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import copy from "rollup-plugin-copy";
import { rmSync } from "node:fs";

function devRollupConfig() {
    return [
        defineConfig({
            input: "index.ts",
            plugins: [
                typescript({
                    tsconfig: "./tsconfig.json",
                    exclude: "./rollup.config.ts",
                    removeComments: true,
                }),
                // ts代码中，我们引用了 data.json，需要将这个文件
                // 拷贝到 output.dir 中，否则编译好的文件找不到
                // data.json，执行就出错了
                copy({
                    targets: [{ src: "./data.json", dest: "./dist/"}]
                })
            ],
            output: {
                dir: "dist",
                format: "esm",
                // 将 utils/index.ts 的代码单独提取到chunk文件中，
                // 避免一起打包到entry文件里（index.js）
                manualChunks: (id: string) => {
                    return id.split("/").slice(-2).join("-");
                    // if (id.includes("utils")) return "utils";
                    // return null;
                   
                },
            }
        })
    ]
}

const clearDistLastGenerated = () =>  rmSync("./dist", { recursive: true, force: true })

export default (commandLineArgs: any) => {
    clearDistLastGenerated()
    return devRollupConfig()
}