let activeEffect: null | Function = null;

// 当前依赖
function effect(eff: Function) {
    activeEffect = eff
    activeEffect?.();
    activeEffect = null;
}

// 全局依赖追踪图
const targetMap = new WeakMap();

// 收集依赖
function track<T extends object>(target: T, key: string | symbol) {
    if (activeEffect) {
        let depsMap = targetMap.get(target);
        if (!depsMap) {
            depsMap = new Map();
            targetMap.set(target, depsMap);
        }
        let dep = depsMap.get(key);
        if (!dep) {
            dep = new Set();
            depsMap.set(key, dep);
        }
        dep.add(activeEffect);
    }
};

// 触发依赖
function trigger<T extends object>(target: T, key: string | symbol) {
    const depsMap = targetMap.get(target);
    const deps = depsMap.get(key) as Set<Function>;
    deps.forEach(eff => eff());
}

function reactive<T extends object>(obj: T) {
    const handler: ProxyHandler<T> = {
        get(target, key, receiver) {
            track(target, key);
            return Reflect.get(target, key, receiver);
        },
        set(target, key, value, receiver) {
            const oldValue = Reflect.get(target, key, receiver);
            const ok = Reflect.set(target, key, value, receiver);
            if (oldValue !== value) {
                trigger(target, key);
            }
            return ok;
        }
    }

    return new Proxy(obj, handler);
}

function ref(initialValue?: any) {
    let state = initialValue;
    let tracked = false;

    // 不使用reactive实现的目的是只暴露 value属性
    const node = {
        get value() {
            track(node, "value");
            tracked = true;
            return state;
        },
        set value(val) {
            if (tracked === false) return;
            
            const oldValue = state
            // 必须先更新值，然后触发 trigger
            // trigger的目的就是将新值传递给依赖
            state = val;

            if (oldValue !== val) {
                trigger(node, "value");
            }
           
        },
    };

    return node;
}


function computed(getter: Function) {
    let result = ref();
    effect(() => {
        // 如果没有此处代码，将会直接 trigger, 没有track
        result.value;
        result.value = getter();
    });

    return result;
}

const product = reactive({ price: 5,  quantity: 2 });

let total = 0;
let realPrice = ref(0);
let unRealTotal = computed(() => product.price * product.quantity);

effect(() => {
    realPrice.value = product.price * 0.9;
});

effect(() => {
    total = realPrice.value * product.quantity;
});

console.log("before price change, total: ", total);
console.log("before price change, unRealTotal: ", unRealTotal.value);

product.price = 10;

console.log("price has changed to 10, and total: ", total);
console.log("price has changed to 10, and unRealTotal: ", unRealTotal.value);


