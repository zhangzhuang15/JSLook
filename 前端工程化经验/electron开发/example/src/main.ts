import { app, BrowserWindow } from "electron";


async function main() {
    await app.whenReady();
    BrowserWindow.fromId(0)?.setSize(400, 500);
}


main();