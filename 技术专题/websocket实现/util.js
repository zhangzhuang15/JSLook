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

  exports.WsFrame = encodeWsFrame