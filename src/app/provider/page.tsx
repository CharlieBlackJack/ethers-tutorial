"use client";
import { ethers, FeeData, Network } from "ethers";
import { useState } from "react";

const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL!;
const address = process.env.NEXT_PUBLIC_ADDRESS!;

export default function Practice() {
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  const [balance, setBalance] = useState("");
  const [network, setNetwork] = useState<Network>();
  const [feeData, setFeeData] = useState<FeeData>();
  const [blockNumber, setBlockNumber] = useState<number>();
  const [transactionCount, setTransactionCount] = useState<number>();
  const [code, setCode] = useState<string>();
  const [ENSAddress, setENSAddress] = useState<string>();
  const [avatar, setAvatar] = useState<string>();

  const getBalance = async () => {
    const balance = await provider.getBalance(address);
    setBalance(parseInt(ethers.formatEther(balance)).toFixed(2));
  };

  const getNetwork = async () => {
    const network = await provider.getNetwork();
    setNetwork(network);
  };

  const getFeeData = async () => {
    const feeData = await provider.getFeeData();
    setFeeData(feeData);
  };

  const getBlockNumber = async () => {
    const blockNumber = await provider.getBlockNumber();
    setBlockNumber(blockNumber);
  };

  const getTransaction = async () => {
    const transaction = await provider.getTransaction(
      "0xf950eddd57cfa2c382d16d34de47a2ea2ce2e74ef4cf815cedcf688b18a2efec"
    );
    console.log(transaction);
  };

  const getTransactionReceipt = async () => {
    const transactionReceipt = await provider.getTransactionReceipt(
      "0xf950eddd57cfa2c382d16d34de47a2ea2ce2e74ef4cf815cedcf688b18a2efec"
    );
    console.log(transactionReceipt);
  };

  const getTransactionCount = async () => {
    const transactionCount = await provider.getTransactionCount(address);
    setTransactionCount(transactionCount);
  };

  const getCode = async () => {
    const code = await provider.getCode(address);
    setCode(code);
  };

  const getBlock = async () => {
    const block = await provider.getBlock(blockNumber!);
    console.log(block);
  };

  const resolveName = async () => {
    const name = await provider.resolveName("vitalik.eth");
    setENSAddress(name || "");
  };

  const getAvatar = async () => {
    const avatar = await provider.getAvatar("vitalik.eth");
    setAvatar(avatar || "");
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div>
        <div>RPC: https://rpc.buildbear.io/eventual-sunspot-a5af3df4</div>
        <div>钱包地址: {address}</div>
      </div>
      <main>
        <h1 className="text-2xl font-bold mb-4">Practice Provider</h1>
        <div className="grid grid-cols-5 gap-4">
          <div className="card">
            <button className="test-btn mb-2" onClick={getBalance}>
              <div>查询余额 </div>
              <div>get balance</div>
            </button>
            {balance && <div>余额: {balance} ETH</div>}
          </div>

          <div className="card">
            <button className="test-btn mb-2" onClick={getNetwork}>
              <div>获取网络 </div>
              <div>get network</div>
            </button>
            {network?.name && <div>网络: {network?.name}</div>}
            {network?.chainId && <div>链ID: {network?.chainId}</div>}
          </div>

          <div className="card">
            <button className="test-btn mb-2" onClick={getFeeData}>
              <div>获取交易费用 </div>
              <div>getFeeData</div>
            </button>
            <div className="flex flex-col gap-2">
              {feeData?.gasPrice && (
                <div>gasPrice: {feeData?.gasPrice + " wei"}</div>
              )}
              {feeData?.maxFeePerGas && (
                <div>maxFeePerGas: {feeData?.maxFeePerGas + " wei"}</div>
              )}
              {feeData?.maxPriorityFeePerGas && (
                <div>
                  maxPriorityFeePerGas: {feeData?.maxPriorityFeePerGas + " wei"}
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <button className="test-btn mb-2" onClick={getBlockNumber}>
              <div>获取区块高度</div>
              <div>get block number</div>
            </button>
            {blockNumber && <div>最新区块高度: {blockNumber}</div>}
          </div>

          <div className="card">
            <button className="test-btn mb-2" onClick={getTransaction}>
              <div>查询交易详情</div>
              <div>get transaction</div>
            </button>
          </div>

          <div className="card">
            <button className="test-btn mb-2" onClick={getTransactionReceipt}>
              <div>查询交易回执</div>
              <div>get transaction receipt</div>
            </button>
          </div>

          <div className="card">
            <button className="test-btn mb-2" onClick={getTransactionCount}>
              <div>查询地址交易次数</div>
              <div>get transaction count</div>
            </button>
            {transactionCount && <div>交易次数: {transactionCount}</div>}
          </div>

          <div className="card">
            <button className="test-btn mb-2" onClick={getCode}>
              <div>获取指定地址的字节码</div>
              <div>get Code</div>
            </button>
            {code && <div>字节码: {code}</div>}
          </div>

          <div className="card">
            <button className="test-btn mb-2" onClick={getBlock}>
              <div>获取指定区块信息</div>
              <div>get Block</div>
            </button>
          </div>

          <div className="card">
            <button className="test-btn mb-2" onClick={resolveName}>
              <div>查询 ENS 地址</div>
              <div>resolveName</div>
            </button>
            {ENSAddress && <div>vitalik.eth: {ENSAddress}</div>}
          </div>

          <div className="card">
            <button className="test-btn mb-2" onClick={getAvatar}>
              <div>查询 ENS 头像</div>
              <div>getAvatar</div>
            </button>
            {avatar && <div>vitalik.eth: {avatar}</div>}
          </div>
        </div>
      </main>
    </div>
  );
}
