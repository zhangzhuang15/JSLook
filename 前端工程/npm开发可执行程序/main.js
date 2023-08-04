#!/usr/bin/env node

function main() {
    const argv = process.argv;
    console.log("process.argv: ", argv);

    const args = argv.slice(1);
    console.log("args: ", args);
    
    if (args[0] === '--help') {
        console.log('this is a help message');
    }
}

main();

// if we exec this file with node,
// process.argv[0] refers to the path of node,
// process.argv[1:] refers to the command line args,
//
// e.g. node main.js --help
// process.argv[1:] will be ["main.js", "--help"]
//
// if you wanna give some args to node,
// e.g. node <node-option-1> <node-option-2>  -- main.js --help
// <node-option-1> <node-option-2> will be considered as args of node instead of main.js,
// "--" means the end of node args,
// in this case, process.argv[0] still prefers to the path of node,
// process.argv[1:] will still be ["main.js", "--help"]

// if you exec this file directly after we set this file executable file by chmod command,
// process.argv[0] refers to the path of node,
// process.argv[1:] refers to the command line args,
//
// in this way, you cannot give some args to node.