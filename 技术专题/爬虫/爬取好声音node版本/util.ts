let memorized: any;

export function memorize<T extends (...args: any) => any>(fn: T) {
    return (...args: any[]) => {
        if (memorized) {
            return memorized;
        }
        memorized = fn(...args);
        return memorized as ReturnType<T>;
    }
}


export function useSignal<T>(): [((value: T) => void), ((reason: any) => void), Promise<T>] {
    let signal: null | ((value: T) => void) = null;
    let refuse: null | ((reason: any) => void) = null;

    const promise = new Promise<T>((resolve, reject) => { signal = resolve; refuse = reject; });

    return [signal!, refuse!, promise];
}

let count = -1;

export function tickCount(ticks: number): boolean {
    if (count === -1) {
        count = ticks;
        return true;
    } 
    
    count -= 1;
    if (count === 0) {
        count = -1;
        return false;
    }

    return true;
    
}