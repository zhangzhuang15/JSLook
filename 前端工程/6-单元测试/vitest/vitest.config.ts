// ref: https://vitest.dev/config/#configuration

import { defineConfig } from "vitest/config"
import path from "path"


export default defineConfig({
    test: {
        /**
         * oh my god! vitest is too stupid!🤦
         * 
         * if you write { "@/*": "./src/*" }, vitest cannot find our .ts file under src directory😨
         * 
         * ref: https://juejin.cn/post/7139463114088513567
         */
        alias: [
            {
                find: /@\/(.*)/,
                replacement: path.join(__dirname, "src", "$1")
            }
        ],
        include: ["./test/*.{test,spec}.ts"],
        // "./src/**/*.ts" for in source test case which
        // vitest supports like Rust
        includeSource: ["./src/**/*.ts"],

        coverage: {
            provider: "v8"
        },

        /**
         * benchmark test config
         */
        benchmark: {
            "include": ["./test/*.bench.ts"]
        },

        /**
         * typecheck test config
         */
        typecheck: {
            include: ["./test/*.type.ts"]
        }

    },

    define: {
        // there are test codes in source code, we have
        // to delete those codes in production, so do this:
        "import.meta.vitest": undefined
    }
})


