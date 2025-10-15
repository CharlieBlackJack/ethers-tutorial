"use client";
import { ethers } from "ethers";
import { useState } from "react";

const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL!;
const address = process.env.NEXT_PUBLIC_ADDRESS!;
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

const abi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

export default function Contract() {
  const [info, setInfo] = useState({
    balance: "0",
    symbol: "-",
    decimals: 0,
  });

  const readContract = async () => {
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    // 第一个参数是合约地址
    const tokencontract = new ethers.Contract(contractAddress, abi, provider);
    // 调用 ABI 编写的方法
    // 查询代币余额，返回原始 wei
    const balance = await tokencontract.balanceOf(address);

    // 查询代币符号
    const symbol = await tokencontract.symbol();
    // 查询代币小数位数
    const decimals = await tokencontract.decimals();

    setInfo({
      balance,
      symbol,
      decimals,
    });
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div>
        <div>RPC: {rpcUrl}</div>
        <div>钱包地址: {address}</div>
      </div>
      <main>
        <h1 className="text-2xl font-bold mt-8 mb-4">Practice Contract</h1>
        <div className="grid grid-cols-5 gap-4">
          <div className="card">
            <button className="test-btn mb-2" onClick={readContract}>
              <div></div>
              <div>readContract</div>
            </button>
            <div className="flex flex-col gap-2 ml-2">
              <div>balance： {info.balance}</div>
              <div>symbol： {info.symbol}</div>
              <div>decimals： {info.decimals}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
