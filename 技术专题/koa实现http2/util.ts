import { spawnSync } from 'child_process';
import { readdirSync, rmSync } from 'fs';
import { resolve } from 'path';

// 在 dir 目录下，生成 {token}-privatekey.pem 和 {token}-cert.pem 文件
export function createSecureFile(dir: string, token: string) {
  const fileNameList: string[] = readdirSync(dir);
  fileNameList.forEach(fileName => {
    if (/\.(pem)/.test(fileName)) {
      rmSync(resolve(dir, fileName), { force: true });
    }
  });
  spawnSync('openssl', [
    'req',
    '-x509',
    '-newkey',
    'rsa:2048',
    '-nodes',
    '-sha256',
    '-subj',
    `/CN=localhost`,
    '-keyout',
    `${token}-privatekey.pem`,
    '-out',
    `${token}-cert.pem`,
  ]);
}
