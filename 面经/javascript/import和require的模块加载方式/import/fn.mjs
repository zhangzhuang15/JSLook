import * as util from "./util.mjs";

export const log = () => {
    console.log("util.value: ", util.value);
    console.log("util.data: ", util.data);
}

export let num = 0;

export function increase() {
        num++;
}
