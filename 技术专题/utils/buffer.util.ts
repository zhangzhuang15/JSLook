/**
 * 将字符串编码成 base64 字符串
 * @param source 
 * @returns 
 */
const base64ify = (source: string): string => {
    const buffer = Buffer.from(source);
    return buffer.toString("base64");
};

/**
 * 将base64字符串还原
 * @param source 
 * @returns 
 */
const unBase64ify = (source: string): string => {
    const buffer = Buffer.from(source, "base64");
    return buffer.toString("utf-8");
}