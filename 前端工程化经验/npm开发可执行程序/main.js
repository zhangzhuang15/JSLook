#!/usr/bin/env node

function main() {
    const args = process.arg.slice(1)
    console.log("args: ", args);

    if (args[0] === '--help') {
        console.log('this is a help message');
    }
}

main();