/**
 * 使用运行时的方式，支持函数重载
 */

function addMethod(obj, name, fn) {
    if (!obj.reloadMap) {
        obj.reloadMap = new Map();
    }

    const reloadMap = obj.reloadMap;

    if (!reloadMap.has(name)) {
        reloadMap.set(name, []);
    };

    const calls = reloadMap.get(name);
    calls[fn.length] = fn;
}

function activateMethod(obj, name) {
    Object.defineProperty(obj, name, {
        get: () => {
            return (...args) => {
                const calls = obj.reloadMap.get(name);
                const call = calls[args.length];
                if (call) {
                    call(...args);
                }
            }
        },
        configurable: true,
        enumerable: true,
    })
}

function main() {
    const search = {};

    addMethod(search, 'find', () => { console.log('hello')});

    addMethod(search, 'find', (name) => { console.log('hello ', name)});

    addMethod(search, 'find', (name, message) => { console.log('hello %s %s', name, message)});

    activateMethod(search, 'find');

    search.find();

    search.find('peter');

    search.find('peter', 'this is mike');

    search.find('', '', '');

}

main()