import koa from "koa";
import { readFileSync } from "node:fs";
import http2 from "node:http2";
import { createSecureFile } from "./util";

const app = new koa();
app.use(async ctx => {
  ctx.body = "Hello world";
});

createSecureFile(__dirname, "zhuang");
const server = http2.createSecureServer(
  {
    key: readFileSync(`${__dirname}/zhuang-privatekey.pem`),
    cert: readFileSync(`${__dirname}/zhuang-cert.pem`),
  },
  app.callback(),
);

server.listen(8003);
