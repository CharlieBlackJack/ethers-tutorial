import {
  ethers,
  ErrorCode,
  BytesLike,
  UnicodeNormalizationForm,
  Utf8ErrorFunc,
} from "ethers";

const _parseUnits = (value: string, unit?: string): bigint => {
  // value 是以太币数量的字符串
  // unit 是单位，转换后相对于ether为： "wei 10的18次方"、"kwei 10的15次方"、"mwei 10的12次方"、"gwei 10的9次方"、"szabo 10的6次方"、"finney 10的3次方"
  // eg: _parseUnits("1", "wei") => 1 * 10 ** 18
  // eg: _parseUnits("1", "gwei") => 1 * 10 ** 9
  return ethers.parseUnits(value, unit);
};
const _formatUnits = (value: bigint, unit?: string): string => {
  // value 是以wei为单位的bigint

  // eg: _formatUnits(1 * 10 ** 18, "wei") => "1"
  // eg: _formatUnits(1 * 10 ** 18, "gwei") => "1 * 10 ** 9"
  return ethers.formatUnits(value, unit);
};

const _parseEther = (value: string): bigint => {
  // value 是以太币数量的字符串
  // eg: _parseEther("1") => 1 * 10 ** 18
  return ethers.parseEther(value);
};

const _formatEther = (value: bigint): string => {
  // value 是以wei为单位的bigint
  // eg: _formatEther(1 * 10 ** 18) => "1"
  return ethers.formatEther(value);
};

const _isAddress = (address: string): boolean => {
  // address 是地址字符串
  // eg: ethers.isAddress("0x2cFC43B94126595E8B636fed9fB585fF220Bc97d"); // true
  // eg: ethers.isAddress("0x"); // false
  return ethers.isAddress(address);
};

const _isError = (error: Error, code: ErrorCode): boolean => {
  // isError 的主要用途是帮助开发者在处理以太坊交易或智能合约交互时，准确识别和处理 ethers.js 抛出的特定错误。
  // 错误码有以下：
  // 通用错误
  // UNKNOWN_ERROR：当以太坊无法知道潜在问题是什么情况时抛出。
  // NOT_IMPLEMENTED：此错误主要用作未来功能的存根，但目前尚未实现。
  // UNSUPPORTED_OPERATION：此错误表示不支持尝试的操作，可能包括从不支持功能的特定 JSON-RPC 端点到禁止操作的对象的特定配置。
  // NETWORK_ERROR：此错误表示连接到网络时出现问题。
  // SERVER_ERROR：此错误表示从服务器获取资源时出现问题。
  // TIMEOUT：此错误表示超时时间已过，操作已被隐式取消。
  // BAD_DATA：此错误表示无法正确解释提供的数据集。
  // CANCELLED：此错误表示操作被程序调用取消，例如“cancel（）”。
  // 操作错误
  // BUFFER_OVERRUN：此错误表示有人试图读取受保护数据的边界之外的数据。
  // NUMERIC_FAULT：此错误表示发生了可能导致错误算术输出的操作。
  // 参数错误
  // INVALID_ARGUMENT：此错误表示传递给函数或方法的类型或值不正确。
  // MISSING_ARGUMENT：此错误表示提供的参数太少。
  // UNEXPECTED_ARGUMENT：此错误表示提供的参数太多。
  // 块链错误
  // CALL_EXCEPTION：此错误表示交易已恢复。
  // INSUFFICIENT_FUNDS：发送账户的资金不足以支付全部交易成本。
  // NONCE_EXPIRED：发送帐户已在已包含的交易中使用了此随机数。
  // REPLACEMENT_UNDERPRICED：试图替换一个事务，但额外费用不足以从内存池中删除旧事务。
  // TRANSACTION_REPLACED：一笔待处理的交易被另一笔交易所取代。
  // UNCONFIGURED_NAME：此错误表示使用了 ENS 名称，但尚未配置该名称。
  // OFFCHAIN_FAULT：CCIP 读取异常，无法从中恢复或进一步处理。
  // 用户接口错误
  // ACTION_REJECTED：此错误表示用户拒绝了请求。
  // --------------------------------------------------------------
  //   eg: try {
  //     const provider = new ethers.JsonRpcProvider("");
  //     await provider.getBalance("0x");
  //   } catch (error: any) {
  //     // 返回 true, ethers.js 抛出的错误
  //     if (ethers.isError(error, "UNSUPPORTED_OPERATION")) {
  //       // code...
  //     }
  //   }
  return ethers.isError(error, code);
};

const _isHexString = (value: string, length?: number): boolean => {
  //  函数用于判断一个值是否为有效的length进制字符串, 默认16进制
  // eg: ethers.isHexString("0x742d35Cc6634C0532925a3b844Bc454e4438f44e"); // true
  // eg: ethers.isHexString("0x"); // false
  return ethers.isHexString(value, length ?? 16);
};

const _keccak256 = (value: string | Uint8Array): string => {
  // 函数用于计算 Keccak-256 哈希值
  // eg:
  // const value = keccak256(toUtf8Bytes("Hello World"));
  // console.log(value); // 0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba

  // const value2 = keccak256(new Uint8Array([0x13, 0x37]));
  // console.log(value2); // 0x2636a8beb2c41b8ccafa9a55a5a5e333892a83b491df3a67d2768946a9f9c6dc

  return ethers.keccak256(value);
};

const _id = (value: string | Uint8Array): string => {
  // 语法糖，实际上调用 _keccak256(value)
  return _keccak256(value);
};

const _sha256 = (value: string | Uint8Array): string => {
  // 函数用于计算 SHA-256 哈希值
  // eg:
  // 如果传入的是字符串，必须使用 toUtf8Bytes 转换为 Uint8Array
  // const value = sha256(toUtf8Bytes("Hello World"));
  // console.log(value); // 0xa591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e

  // const value2 = sha256(new Uint8Array([0x13, 0x37]));
  // console.log(value2); // 0x158760c856e5ea1ba97e2e2a456736c4bf30d964559afa6d748cf05694a636ff
  return ethers.sha256(value);
};

const _encodeBase64 = (value: string | Uint8Array): string => {
  // 函数用于将字节数据编码成 Base64 字符串

  // eg:
  // const value = encodeBase64(toUtf8Bytes("Hello World"));
  // console.log(value); // SGVsbG8gV29ybGQ=

  // const value2 = encodeBase64(new Uint8Array([0x13, 0x37]));
  // console.log(value2); // Ezc=
  return ethers.encodeBase64(value);
};

const _decodeBase64 = (value: string): Uint8Array => {
  // 函数用于将 Base64 字符串解码为字节数据

  // eg:
  // const value = decodeBase64("SGVsbG8gV29ybGQ=");
  // console.log(value);  // Uint8Array(11) [72, 101, 108, 108, 111,  32,  87, 111, 114, 108, 100]
  return ethers.decodeBase64(value);
};

const _getBytes = (value: BytesLike, name?: string): Uint8Array => {
  // 函数用于将字节数据转换为 Uint8Array
  // eg:
  //   const value = getBytes("0x2cFC43B94126595E8B636fed9fB585fF220Bc97d");
  //   console.log(value);
  //   // Uint8Array(20) [44, 252,67,185,65,38,89,94,139,99,111,237,159,181,133,255,34,11,201, 125]

  //   const value2 = getBytes(new Uint8Array([0x13, 0x37]));
  //   console.log(value2); // Uint8Array(2) [19, 55]

  //   try {
  //     getBytes("gg", "hello");
  //   } catch (error: any) {
  //     console.log(error.argument); // hello
  //   }
  return ethers.getBytes(value, name);
};

const _toUtf8Bytes = (
  value: string,
  form?: UnicodeNormalizationForm
): Uint8Array => {
  // 将字符串（通常是 Unicode 字符串）转换为 UTF-8 编码的字节数组（Uint8Array）。
  // 这个函数在处理以太坊相关的数据时非常有用，因为以太坊智能合约和区块链数据通常需要以字节形式操作，而字符串在 JavaScript 中通常是 Unicode 格式。

  // eg:
  //   const value = toUtf8Bytes("hello world");
  //   console.log(value);
  //   // Uint8Array(11) [104,101,108,108,111,32,119,111,114,108,100]

  //   const value2 = toUtf8Bytes("\u00F1");
  //   const value3 = toUtf8Bytes("\u006E\u0303");
  //   console.log(value2); // Uint8Array(2) [ 195, 177 ]
  //   console.log(value3); // Uint8Array(3) [ 110, 204, 131 ]

  //   // 使用 NFC 规范化，这使得他们相等
  //   console.log(
  //     toUtf8Bytes("\u00F1", "NFC").toString() ===
  //       toUtf8Bytes("\u006E\u0303", "NFC").toString()
  //   ); // true

  return ethers.toUtf8Bytes(value);
};

const _toUtf8String = (bytes: BytesLike, onError?: Utf8ErrorFunc): string => {
  // 将给定的字节数据（可以是十六进制字符串、字节数组或 Uint8Array）转换为 UTF-8 编码的字符串。
  // 它是处理以太坊区块链中编码数据的常用工具，因为许多智能合约的返回值或事件日志以字节形式存储，而这些字节通常表示 UTF-8 编码的字符串。
  // eg:
  //   const value = toUtf8String("0x48656c6c6f");
  //   console.log(value);
  //   // hello

  //   const value2 = toUtf8String(new Uint8Array([72, 101, 108, 108, 111]));
  //   console.log(value2);
  //   // hello

  //   // 如果输入的字节数据包含无效的 UTF-8 编码，默认情况下 toUtf8String 会抛出错误。
  //   // 可以通过提供 onError 函数来处理这些错误，例如忽略无效字节或替换为特定字符。
  //   const value3 = toUtf8String(
  //     new Uint8Array([0xff, 0xff, 0x48, 0x65, 0x6c, 0x6c, 0x6f]),
  //     (reason, offset, bytes, output) => {
  //       console.log(reason, offset, bytes, output);
  //       // BAD_PREFIX, 0, Uint8Array(7)[255, 255,72,101,108,108,111], []
  //       return 1; // 跳过 1 个字节
  //     }
  //   );
  //   console.log(value3); // 输出: "Hello"（跳过了无效字节）
  return ethers.toUtf8String(bytes, onError);
};

const _randomBytes = (length: number): Uint8Array => {
  // 生成指定长度的随机字节数组
  // eg:
  // const value = randomBytes(10);
  // console.log(value);
  // 每次执行结果都会不一样
  // Uint8Array(10) [4, 199,  59, 204, 6, 199, 123, 137, 143, 155]
  return ethers.randomBytes(length);
};

const _hexlify = (value: BytesLike): string => {
  // 将输入的数据转换为以 "0x" 开头的十六进制字符串转换为十六进制字符串
  // eg:
  //   const value = hexlify("0x592fa7");
  //   console.log(value); // 0x592fa7

  //   const value2 = hexlify(new Uint8Array([89, 47, 167]));
  //   console.log(value2); // 0x592fa7
  return ethers.hexlify(value);
};

const _zeroPadValue = (data: BytesLike, length: number): string => {
  // 将输入值转换为固定长度的字节序列（以十六进制字符串形式表示）
  // 通过在左侧填充零字节（0x00）来确保输出长度符合要求
  // eg:
  // const value = zeroPadValue("0x592fa7", 10);
  // console.log(value); // 0x00000000000000592fa7

  // const value2 = zeroPadValue("0x592fa7", 6);
  // console.log(value2); // 0x000000592fa7
  return ethers.zeroPadValue(data, length);
};
export {
  _parseUnits,
  _formatUnits,
  _parseEther,
  _formatEther,
  _isAddress,
  _isError,
  _isHexString,
  _keccak256,
  _id,
  _sha256,
  _encodeBase64,
  _decodeBase64,
  _getBytes,
  _toUtf8Bytes,
  _toUtf8String,
  _randomBytes,
  _hexlify,
  _zeroPadValue,
};
