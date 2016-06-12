'use strict'

let chars = '123456789ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    base = chars.length;

function encode(id){
  let encoded = '';
  while(id){
    let remainder = id % base;

    id = Math.floor(id / base);
    encoded = chars[remainder].toString() + encoded;
  }
  return encoded;
}

function decode(str){
  let decoded = 0;
  while(str){
    let index = chars.indexOf(str[0]),
        power = str.length - 1;

    decoded += index * (Math.pow(base, power));
    str = str.substring(1);
  }
  return decoded;
}

module.exports.encode = encode;
module.exports.decode = decode;