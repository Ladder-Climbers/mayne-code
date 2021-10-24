import CryptoJS from "crypto-js";
import tencentConfig from "../../secrets/tencent_cloud.json";

/** 获取签名 start */

export function toUint8Array(wordArray) {
  // Shortcuts
  const words = wordArray.words;
  const sigBytes = wordArray.sigBytes;

  // Convert
  const u8 = new Uint8Array(sigBytes);
  for (let i = 0; i < sigBytes; i++) {
    u8[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  }
  return u8;
}

export function Uint8ArrayToString(fileData) {
  let dataString = '';
  for (let i = 0; i < fileData.length; i++) {
    dataString += String.fromCharCode(fileData[i]);
  }
  return dataString;
}
// 签名函数示例
export function signCallback(signStr) {
  const secretKey = tencentConfig.secretkey;
  const hash = CryptoJS.HmacSHA1(signStr, secretKey);
  const bytes = Uint8ArrayToString(toUint8Array(hash));
  return window.btoa(bytes);
}

/** 获取签名 end */
