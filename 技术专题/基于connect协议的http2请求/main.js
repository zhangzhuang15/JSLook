// http2 protocol refer: https://datatracker.ietf.org/doc/html/rfc7540
const http2 = require("http2");
const https = require("https");

const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkN1VWI0NkVHT3BHaXI4TDh3VkRQRCJ9.eyJpc3MiOiJodHRwczovL2N1cnNvci51cy5hdXRoMC5jb20vIiwic3ViIjoiZ2l0aHVifDc0MDEzMTg0IiwiYXVkIjpbImh0dHBzOi8vY3Vyc29yLnVzLmF1dGgwLmNvbS9hcGkvdjIvIiwiaHR0cHM6Ly9jdXJzb3IudXMuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTY4NTI4NTE1NCwiZXhwIjoxNjg1MzcxNTU0LCJhenAiOiJLYlpVUjQxY1k3VzZ6UlNkcFNVSjdJN21MWUJLT0NtQiIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgb2ZmbGluZV9hY2Nlc3MifQ.JO_N5KhZn3dBujVItaCiS_dQtav3H_QamenZP29gIPcc6OlrzGza04javkTkQWXNag_795TbKn6H9Tmy9Nc3GooQP4FLtbLmNiIXYdlrqon-9pj3_vD0LvDNt1sRLH5DfWerujb09cAp3ffExweR4ajegJdh_-ItNfZfYd1qKutAeFJ5YBJ1kU2tMvVpkgltLTEJOLSo4pU-3jAZ4XdLSL3vHsriq9-ScPNrKyPt32W36MvYlgkmlOOtr1wLx_OXsQqj0L-OmDIqf1VGCh7Nli8CQfHv1eB_TsVenIkRMveejyU4yJgYkZJE4pKqjygHswb_uNlEczgvTApxSFsD5Q";

const body = {
    "currentFile": {
        "relativeWorkspacePath": "main.c",
        "contents": "#include <libproc.h>\n#include <stdio.h>\n#include <unistd.h>\n\nint main(int argc, char* argv[]) {\n     struct proc_bsdinfo info;\n\n     pid_t currentProc = getpid();\n     int success = proc_pidinfo(currentProc, PROC_PIDTBSDINFO, 0, &info, sizeof(info));\n     if (success <= 0) {\n        perror(\"proc_pidinfo\");\n        return -1;\n     }\n\n     printf(\"process program name: %s\\n\", info.pbi_name);\n     printf(\"process PPID: %ld\\n\", info.pbi_ppid);\n     printf(\"process user ID: %ld\\n\", info.pbi_uid);\n     printf(\"process real user ID: %ld\\n\", info.pbi_ruid);\n     printf(\"process svuid: %ld\\n\", info.pbi_svuid);\n\n}",
        "cursorPosition": {
            "line": 8,
            "column": 11
        },
        // "languageId": "c",
        "selection": {
            "startPosition": {
                "line": 8,
                "column": 11
            },
            "endPosition": {
                "line": 8,
                "column": 11
            }
        }
    },
    "conversation": [
        {
            "text": "how to write a markdown editor",
            "type": "MESSAGE_TYPE_HUMAN"
        },
        {
            "type": "MESSAGE_TYPE_AI"
        }
    ],
    // "explicitContext": {},
    "workspaceRootPath": "/Users/zhangzhuang/.cursor-tutor",
    "modelDetails": {
        "modelName": "gpt-3.5-turbo",
        "apiKey": "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"
    }
};

const encode = (jsonString) => {
    const buffer = Buffer.from(jsonString);
    let length = buffer.length;
    const message = new Uint8Array(length + 5 + 5);

    message[0] = 0;
    for (let i = 4; i > 0; i--) {
        message[i] = length & 255;
        length = length >> 8;
    }
    message.set(buffer, 5);

    length = buffer.length;
    
    message[length + 5] = 2;
    message[length + 6] = 0;
    message[length + 7] = 0;
    message[length + 8] = 0;
    message[length + 9] = 0;

    return message;

};

const requestMessage = encode(JSON.stringify(body));
const client = http2.connect("https://api2.cursor.sh/aiserver.v1.AiService/StreamChat");

const headers = {
    [http2.constants.HTTP2_HEADER_PATH]: "/aiserver.v1.AiService/StreamChat",
    [http2.constants.HTTP2_HEADER_METHOD]: "POST",
    [http2.constants.HTTP2_HEADER_SCHEME]: "https",
    [http2.constants.HTTP2_HEADER_AUTHORITY]: "api2.cursor.sh",
    "connect-protocol-version": "1",
    "accept": "*/*",
    "accept-encoding": "gzip, deflate, br",
    "authorization": `Bearer ${token}`,
    "content-type": "application/connect+json",
    "content-length": requestMessage.byteLength,
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Cursor/0.2.21 Chrome/102.0.5005.167 Electron/19.1.9 Safari/537.36"
};

const req = client.request(headers);

console.log("request headers: ", headers);

req.on("response", (headers) => { console.log("headers: ", headers);});

const messagesBox = [{ flags: 0, data: new Uint8Array(0) }];
let message = new Uint8Array(0);
let currentMessageFlagAndLength = null;

req.write(requestMessage); 
req.end();

req.on("data", (chunk) => {
    const s = message;
    message = new Uint8Array(message.length + chunk.length);
    message.set(s, 0);
    message.set(chunk, s.length);
    for (;;) {
        if (currentMessageFlagAndLength === null && message.length >= 5) {
            const flags = message[0];
            let messageLength = 0;
            for(let i = 1; i < 5; i++) {
                messageLength = (messageLength << 8) + message[i];
            }
            currentMessageFlagAndLength = {
                flags,
                messageLength
            };
        } else if (currentMessageFlagAndLength !== null && message.length >= currentMessageFlagAndLength.messageLength + 5) {
            messagesBox.push({ flags: currentMessageFlagAndLength.flags, data: message.subarray(5, currentMessageFlagAndLength.messageLength + 5)});
            message = message.subarray(currentMessageFlagAndLength.messageLength + 5);
            currentMessageFlagAndLength = null;
            break;
        } else break;
    }
    
});

req.on("end", () => {
    let s = "";

    messagesBox.slice(1).forEach(value => {
        s += Buffer.from(value.data).toString();
    });

    console.log("response: ", s);
   //client.close();
    req.session.close();
});

