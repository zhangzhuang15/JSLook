const net = require("net");
const crypto = require("crypto");

// GUID格式为 XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
// X 取值范围 [0-9A-Z]
const GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";


const server = net.createServer(
  // 客户端发送TCP连接请求成功后，server产生套接字对象 socket处理请求
  socket => {
    
    let generator = generateRawData();
    generator.next();

    // 收到客户端发送的数据时，
    // 因为客户端发送http请求，data就是http的报文啦。
    // 由于建立连接只需要一次，所以用 once方法只处理一次。
    socket.once('data', data => {
      // data是Buffer，字节码，需要转为字符串处理
      let d = data.toString();
     
      // 记录请求头各个字段
      let map = {};

      d.trim().split('\r\n').forEach((item, index) => {
          // 请求的首行是 请求方法 路由 http协议版本号，跳过
          if(index > 0){
              // 请求头字段结构 key: value， 但是个别字段的 value中也包含 : 号,
              // 所以 split的时候要指定分成2截。
              let [key, value] = item.split(":", 2);
              map[key.toLowerCase()] = value.trim();
          }
      });
      
      // websocket连接的请求头中必带 sec-websocket-key 字段，
      // 我们需要用到该信息。
      let websocketKey = map['sec-websocket-key'];

      // 使用sha1算法
      let hash =crypto.createHash("sha1");
      // 送入要hash的内容
      hash.update(`${websocketKey}${GUID}`);
      // 计算摘要值，也就是hash值
      const result = hash.digest("base64");

      // 作为 Sec-WebSocket-Accept的字段值把result返回给客户端；
      // 同时要带上响应头首行，Upgrade、Connection字段；
      const header = `HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${result}\r\n\r\n`;
      
      let finish = socket.write(header);
     
      // finish == true, 表示刚才 write的数据全部送入到内核缓存中准备经网卡发送出去啦
      if (finish) {
        // 使用setTimeout方法模拟服务端主动推送数据

        // 把opcode改成 2， 浏览器收到的将是一个 Blob类型的数据哦
        setTimeout(() => { socket.write(encodeWsFrame({payloadData:"hello join",opcode: 1, isFinal: false}))}, 3000);
        setTimeout(()=>{ socket.write(encodeWsFrame({payloadData:"this is apple", opcode:0, isFinal: true}))}, 4000);
        //setTimeout(()=> { socket.write(encodeWsFrame({payloadData:"主动关闭", opcode:8}));}, 20000);

        // 有意思的是，客户端会一次接到数据 hello jointhis is apple，而不是分两次接到数据！
        // 
        // 🔥websocket数据帧见底下的图！
        //
        // 这里有个连续帧和非连续帧的概念。
        //
        // 非连续帧很好理解，对方已接收到立马解析得到结果。对于这种websocket数据帧，opcode≠0，FIN=1；
        //
        // 连续帧是说，我们这边要发送一批数据给对方，但是这些数据分散在连续的几个websocket数据帧中，对方接收到一个数据帧后，
        // 先把解析出来的数据缓存起来，直到作为结尾的帧被解析缓存起来后，将所有缓存的数据拼成一个整体，作为最终收到的一个数据。
        // 而连续帧要求，非结尾数据帧 opcode≠零，FIN=0，作为结尾的数据帧 opcode=0，FIN=1；
        //
        // 关闭websocket连接也是依赖发送数据帧完成的。主动关闭连接的一方发送的数据帧，要使 opcode=8,FIN=1即可。

      }


      socket.on('data', (data) => {
   
        let result = generator.next(data).value;
        
        // 对方发送的是连续帧，还有一个部分数据没有到达
        if (result == null) return;

        // 关闭帧，数据帧中有效负载数据超过 1GB, 或者有其他错误
        if (result.type === "close" || result.isOutOfRange || result.isError) {
          socket.end();
        }
        
        // 好啦，数据全部就绪，可以处理啦
        if (result.isFinal) {
          dealwith(result);
        }
    });
      
  });
 


  socket.on("end", () => {
    socket.destroy();
  });


  socket.on('close', (err) => {
    if(!err){
      console.log("websocket连接关闭");
    }
  });
});


server.listen("4433", () => {
    console.log("server is running");
});


function dealwith(result) {

  if (result.type === "text") {
    console.log("text data from client: ", result.data.toString());
  }
  if (result.type === "bin") {
    console.log("bin data from client: ", result.data);
  }
}



/** websocket报文结构🔥*/

/**  0 1 2 ··········
 *  +-+-+-+-+---------+-+--------------+-------------------------------+----------------------+
 *  |F|R|R|R|  opcode |M|  Payload len |   Extended payload length     |       Mask key       |
 *  |I|S|S|S|  (4bit) |A|   (7bit)     | (16bit if payload len == 126) | (32bit if MASK == 1) |
 *  |N|V|V|V|         |S|              | (64bit if payload len == 127) | (0bit if MASK == 0)  |
 *  | |1|2|3|         |K|              | (0bit if payload len ≤ 125)   |                      |
 *  +-+-+-+-+---------+-+--------------+-------------------------------+----------------------+
 *  :                        Payload Data                                                     :
 *  +   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   - +
 *  :                                                                                         :
 *  +-----------------------------------------------------------------------------------------+
 * 
 *  FIN(1bit): if 1, 数据帧最后一个片段。（传送的数据过大，一个报文发送不完所有的数据，也要拆包传送）
 * 
 *  RSV1(1bit): just set 0 
 *  RSV2(1bit): just set 0
 *  RSV3(1bit): just set 0
 * 
 *  opcode(4bit): if 0, 表示这是一个持续帧
 *                if 1, 表示这是一个文本帧
 *                if 2， 表示这是一个二进制帧
 *                if 3-7, reserve
 *                if 8， 表示这是一个连接关闭帧
 *                if 9， 表示一个ping帧
 *                if A， 表示一个pong帧
 *                if B-F， reserve
 * 
 *  MASK(1bit): if 1, 对数据帧解码时，有效负载需要和Mask key异或后得到的数据才是真正的有效负载数据。
 * 
 *  Payload len(7bit): 有效负载数据的长度，单位字节。
 * 
 *  Extended Payload len: 当有效负载数据长度 > 125时，由该字段值表示有效负载数据的长度，
 *                        该字段长度由Paylaod len的取值而定，如上图所示。
 * 
 *  Mask Key: 掩码。
 * 
 *  Payload Data：有效负载数据。这才是你在应用层上真正想发给对方的数据！🎉
 */


/** 🌟🌟
 *  客户端的解码和编码工作，浏览器已经实现啦，我们不必实现；
 *  如果想开发websocket客户端，就需要自己实现啦，道理和服务端
 *  实现的编码和解码工作一样。
 */

/** 将javascript的数据结构转换成websocket报文 */
function encodeWsFrame(data) {
    const isFinal = data.isFinal !== undefined ? data.isFinal : true;
    const opcode = data.opcode !== undefined ? data.opcode : 1;
    const payloadData = data.payloadData ? Buffer.from(data.payloadData) : null;
    const payloadLen = payloadData ? payloadData.length : 0;
  
    let frame = [];
  
    // FIN ~ opcode 刚好 8bit
    //
    // 1<<7后得到：
    // 7 6 5 4 3 2 1 0
    // 1 0 0 0 0 0 0 0
    // 
    // opcode & 0xFF,保证取的是 opcode 低8bit
    if (isFinal) frame.push((1 << 7) + (opcode & 0xFF));
    else frame.push(opcode&0xFF);
    
    // 这里不使用 Mask，Mask直接设置为0
    if (payloadLen < 126) {
      frame.push(payloadLen);

      // 长度不超过 2^16 - 1, 也就是 65535， payload len=126, extended payload len占据16it；
      // payload >>8 取 payload高8bit， payload & 0xFF取低8bit；
    } else if (payloadLen < 65536) { 
      frame.push(126, payloadLen >> 8, payloadLen & 0xFF);
    } else {
      // 为方便起见，暂不实现长度超过 2^64 -1 的分片情况；
      // 此时 extended payload len 占据64bit，
      // 8bit 一组，分成 8组， payloadlen右移7组（也就是56bit），在 & 0xff，就可以取到最高的8bit。以此类推。
      frame.push(127);
      for (let i = 7; i >= 0; --i) {
        frame.push( (payloadLen >>(i * 8)) & 0xFF);
      }
    }
  
    // 最后加上 有效负载数据，拼接成一个完整的报文
    frame = payloadData ? Buffer.concat([Buffer.from(frame), payloadData]) : Buffer.from(frame);
    return frame;
  }


  // 这里使用生成器设计一个协程，而一个协程绑定一个socket，
  // 在解析不同socket收到的数据帧时不会互相干扰，而且面临
  // 连续帧的情况下，可以暂存上一帧的解析结果，直到连续帧全
  // 部处理完。当然，也可以直接使用result，不必封装一层，
  // 但要注意，result应定义在第13行，和socket对应上，不要
  // 定义一个全局变量，否则不同socket之间就会竞争。
  function* generateRawData() {

    var result = {
      isFinal: false,
      isOutOfRange: false,
      isError: false,
      type: "",
      data: Buffer.from([]),
    };

    while (true) {
      let websocketFrame = yield ;

      decodeFrame(websocketFrame, result);

      if (result.isOutOfRange || result.isFinal || result.isError) {
        yield result;
        result.isFinal = false;
        result.isOutOfRange = false;
        result.isError = false;
        result.type = "";
        result.data = Buffer.from([]);
      }
    }
  }



  /** 解码 websocket数据帧
   *  frame： Buffer
   */
  function decodeFrame(frame, result) {

    let currentType;
    // 由opcode 判断 发来的数据帧 类型
    switch ((frame[0] & 0x0F)) {
      case 0:
        currentType = "continue";  // 持续帧
        break;
      case 1:
        currentType = "text"; // 文本帧
        break;
      case 2:
        currentType = "bin"; // 二进制帧
        break;
      case 8:
        currentType = "close"; // 断开连接帧
        break;
      case 9:
        currentType = "ping"; // ping帧
        break;
      case 0x0A:
        currentType = "pong"; // pong帧
        break;
      default:
        currentType = "reserve"; // 保留帧
    }
    
    // 如果是 关闭帧，可以在设置之后立即返回，
    // 其他数据不用理会。
    if (currentType === "close") {
      result.type = currentType;
      return;
    }

    let isFinal = (frame[0] >> 7 ) === 1;

    // result目前记录的是上一个帧处理后的结果，
    // 当上一个帧是非连续帧 或者 连续帧中的结尾帧，在generateRawData函数处理后，result.type === "";
    // 
    // 换个角度来理解，如果 result.type === ""，表示当前处理的这一帧是 新的非连续帧 或者 新的连续帧，他们由isFinal的值区分；
    // 如果 result.type !== "", 那么这一帧一定是连续帧中的一帧。

    // 当前帧是连续帧，类型又和上一帧不一样，只能是作为结尾帧的 continue类型
    if (result.type !== "" && currentType !== result.type && currentType !== "continue") { result.isError = true; }

    // 当前帧是连续帧，类型和上一帧一样，那么一定不是结尾帧，isFinal肯定等于false
    if (result.type !== "" && currentType === result.type && isFinal) { result.isError = true; }

    // 当前帧是新的一帧，无论是连续帧还是非连续帧，类型肯定不能是 continue
    if (result.type === "" && currentType === "continue") { result.isError = true; }

    // 当前帧的类型如果是 continue, 那么 isFinal 必定是 true
    if (currentType === "continue" && !isFinal) { result.isError = true; }

    if (result.isError) return;

    result.isFinal = isFinal;
    result.type = currentType;
    
    // 在编码的时候，没有使用mask掩码，
    // 但是浏览器实现websocket报文编码时，
    // 会使用掩码，因此这里要把掩码带上
    let isMask = (frame[1] >> 7) === 1;
    let mask = 0;

    // 0111 1111
    //  7     F
    let payloadlen = frame[1] & 0x7F;
    let payload;
    
    // 根据payload len取值情况，确定 mask-key payload；
    // mask变量就是 mask key哦
    if (payloadlen < 126) {
      if (isMask) {
        mask = frame.slice(2, 6);
        payload = frame.slice(6, 6+payloadlen);
      }
      else payload = frame.slice(2, 2+payloadlen);
    }

    else if (payloadlen === 126) {
      payloadlen = (frame[2] << 8) | (frame[3]);
      if (isMask) {
        mask = frame.slice(4, 8);
        payload = frame.slice(8, 8 + payloadlen);
      }
      else payload = frame.slice(4, 4 + payloadlen);
    }

    else if (payloadlen === 127) {
      // 这里限制一个数据帧最多只能传入512M的数据；
      // 因此 extended payload len 高 32bit 必须等于0；
      // 低32bit最高2bit必须等于0；

      // 验证高32bit
      for (let i = 2; i < 6; i++) {
        if(frame[i] !== 0) {
          result.isOutOfRange = true;
          return;
        }
      }

      // 验证低32bit最高2bit
      // 1100 0000
      if ((frame[6] & 0xC0) !== 0) {
        result.isOutOfRange = true;
        return;
      }
 
      // ok， 可以解析 extended payload len啦
      payloadlen = 0;
      for (let i = 6; i < 10; i++) {
        payloadlen += (frame[i] << ((9 - i) * 8));
      }
      if (isMask) {
        mask = frame.slice(10, 14);
        payload = frame.slice(14, 14 + payloadlen);
      }
      else payload = frame.slice(10, 10 + payloadlen);

    }

    else {}

    for (let i = 0; i < payload.length; i++) {
      if (isMask) payload[i] = payload[i] ^ mask[i%4];
    }
    
    result.data = Buffer.concat([result.data, payload]);
    return ;
  }




  // 以上只是 websocket 服务端的基本原理，非常简陋，
  // 还需要做一些整理加工、框架设计、对象封装，才能成
  // 为一个模块使用。