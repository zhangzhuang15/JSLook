// source code string -> ast
const parser = require("@babel/parser");

// traverse node of ast
const traverse = require("@babel/traverse").default;

// es6 code -> es5 code
const babel = require("@babel/core");

// source code file -> source code string
const fs = require("fs");

const path = require("path");

// module id
let ID = 0;

// module id -> module
const moduleMap = new Map();

/**
 * 读取absoluteFilePath的js文件，利用babel将js代码转化为ast，
 * 遍历import declaration，得到依赖模块，使用babel将js代码
 * 转化为标准es5代码，将上述得到的信息，以一个对象的形式返回
 * 
 * @param {*} absoluteFilePath 模块所在的js文件的绝对路径
 */
function readImportFile(absoluteFilePath) {
    const code = fs.readFileSync(absoluteFilePath, "utf-8");

    const ast = parser.parse(code, { sourceType: "module" });

    const dependencies = [];

    traverse(ast, {
        // 对于 ast 中的每一个 import 语句，使用该方法处理
        ImportDeclaration(path) {
            const importedFile = path.node.source.value;
            dependencies.push(importedFile);
        }
    });

    // es6 -> es5
    const { code: es5Code } = babel.transformFromAstSync(ast, null, {
        presets: ["@babel/preset-env"]
    });

    return {
        id: ++ID,
        absoluteFilePath,
        code: es5Code,
        dependencies,
        mapping: {}
    }
}

/**
 * 从入口文件开始，遍历所有的module，并存入队列中，最后将该队列返回.
 * 
 * Graph就是module的集合.
 * 
 * 本函数仅仅解决单入口文件情形，对于多入口文件情形，需要引入base路径基准，
 * 统一module所在的文件路径，并基于这个文件路径，加入module缓存Map，这样
 * 在构建另一个入口文件的Graph时，可以减少重复的module解析工作.
 * 
 * @param {*} absoluteEntryFilePath 入口文件的绝对路径
 */
function createGraph(absoluteEntryFilePath) {
    // absolute module file path -> module id;
    const moduleIdMap = new Map();

    const rootPath = absoluteEntryFilePath;

    const entryModule = readImportFile(absoluteEntryFilePath);
    
    const queue = [entryModule];

    for (const mod of queue) {
        const relativeToRoot = path.relative(mod.absoluteFilePath, rootPath);
        if (moduleIdMap.has(relativeToRoot)) continue;

        moduleIdMap.set(relativeToRoot, mod.id);
        mod.dependencies.forEach(dependencyFilePath => {
            const { absoluteFilePath: basePath } = mod;
            // basePath不是以文件夹结尾，需要处理一下，否则会导致 path.resolve得到的路径是非法的
            const baseDir = path.dirname(basePath);
            const absoluteDependencyFilePath = path.resolve(baseDir, dependencyFilePath);
            // 防重复统计时，全部按照 rootPath取相对路径，压缩 key 的长度
            const relativeToRoot = path.relative(absoluteDependencyFilePath, rootPath);

            // 防止重复
            if (moduleIdMap.has(relativeToRoot)) return;

            const subMod = readImportFile(absoluteDependencyFilePath);
            const { id } = subMod;
            moduleIdMap.set(relativeToRoot, id);
            mod.mapping[dependencyFilePath] = id;

            queue.push(subMod);
        });
    }

    moduleIdMap.clear();

    return queue;
}

/** 
 * 根据 graph 提供的模块集合，生成bundle文件里的代码.
 * 
 * @param graph module集合
 * @param entryModuleId 入口module的id
 */
function bundle(graph, entryModuleId) {
    let modules = "";

    // mod.code 中存在 `require` `module` `module.exports`
    // `exports`，这个是babel编译出来的，但是我们定义一个函数
    // 包裹起这写代码，通过函数入参覆盖掉它们。我们定义好module对象，
    // 然后传入这个函数，当这个函数执行完毕，module对象的导出方法，
    // 导出数据就被带出来了。但我们必须定义好require，在mod.code中，
    // require的入参是 module path，而我们引入module，是利用moduleId，
    // 因此我们定义的require必须将 module path 转化成 moduleId,
    // 还好mod.mapping可以做到这点
    graph.forEach(mod => {
        modules += `
  ${mod.id}: [
      function(require, module, exports) {
          ${mod.code}
      },
      ${JSON.stringify(mod.mapping)}
  ],
`;

    });

    // 即时函数， 一旦执行，就会得到 requireModuleId() 的结果
    const iic = `(function(modules) {
    return requireModuleId(${entryModuleId});

    function requireModuleId(moduleId) {
        const mod = modules[moduleId];
        const loadFn = mod[0];
        const mapping = mod[1];

        const module = {
            exports: {},
        };

        loadFn(requireModuleString.bind(null, mapping), module, module.exports);
            
        return module.exports;
    }

    function requireModuleString(mapping, moduleString) {
        const moduleId = mapping[moduleString];
        return requireModuleId(moduleId);
    }
})({ ${modules} })`;

    return iic;
}

function output(bundleCode, outputFilePath) {
    fs.writeFileSync(outputFilePath, bundleCode);
}

const entryFile = path.join(__dirname, "./main.js");
const graph = createGraph(entryFile);
const bundleCode = bundle(graph, 1);
output(bundleCode, "./bundle.js");
