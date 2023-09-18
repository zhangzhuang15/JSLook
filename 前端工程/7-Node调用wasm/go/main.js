const fs = require("fs");

globalThis.require = require;
globalThis.fs = fs;
globalThis.TextEncoder = require("util").TextEncoder;
globalThis.TextDecoder = require("util").TextDecoder;

globalThis.performance = {
	now() {
		const [sec, nsec] = process.hrtime();
		return sec * 1000 + nsec / 1000000;
	},
};

const crypto = require("crypto");
globalThis.crypto = {
	getRandomValues(b) {
		crypto.randomFillSync(b);
	},
};
require("./wasm_exec.js");

const go = new Go();
go.argv = process.argv.slice(2);
go.env = Object.assign({ TMPDIR: require("os").tmpdir() }, process.env);
go.exit = process.exit;

const buffer = fs.readFileSync("./go/main.wasm")
WebAssembly
    .instantiate(buffer, go.importObject)
    .then(({instance}) => {
        process.on('exit', (code) => {
            // Node.js exits if no event handler is pending
      
            // commend the block avoid deadlock
            // if (code === 0 && !go.exited) {
            //   // deadlock, make Go print error and stack traces
            //   go._pendingEvent = { id: 0 };
            //   go._resume();
            // }
      
            // below code is to avoid deadlock
            const result = globalThis.add(1,2);
            globalThis.echo("hello");
      
            // output as strout
            console.log(result);
            process.exit();
          });
        return go.run(instance);
    })