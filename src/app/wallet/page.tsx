"use client";
import { ethers } from "ethers";
import { useState } from "react";

const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL!;
const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY!;
const phrase = process.env.NEXT_PUBLIC_WALLET_PHRASE!;

export default function Wallet() {
  const [randomWallet, setRandomWallet] = useState({
    address: "",
    privateKey: "",
    publicKey: "",
    mnemonic: {
      phrase: "",
    },
  });
  const [importWallet, setImportWallet] = useState<{
    address: string;
    privateKey: string;
    provider?: ethers.JsonRpcProvider | null;
    signingKey?: ethers.Signer | null;
  }>({
    address: "",
    privateKey: "",
    // provider: null,
    // signingKey: null,
  });

  const [balance, setBalance] = useState<string>();

  const [receipt, setReceipt] = useState<ethers.TransactionReceipt | null>(
    null
  );

  const createRandomWallet = () => {
    const wallet = ethers.Wallet.createRandom();

    setRandomWallet({
      address: wallet.address,
      privateKey: wallet.privateKey,
      publicKey: wallet.publicKey,
      mnemonic: {
        phrase: wallet.mnemonic?.phrase || "",
      },
    });
  };

  const importWalletByPrivateKey = () => {
    const wallet = new ethers.Wallet(privateKey);

    setImportWallet({
      address: wallet.address,
      privateKey,
      //   provider: new ethers.JsonRpcProvider(rpcUrl),
      //   signingKey:
      //     (wallet.signingKey as unknown as ethers.Signer | null) || null,
    });
  };

  const importWalletByPhrase = () => {
    const wallet = ethers.Wallet.fromPhrase(phrase);
    setImportWallet({
      address: wallet.address,
      privateKey: wallet.privateKey,
    });
  };

  const getMyBalance = async () => {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const balance = await provider.getBalance(wallet.address);
    const formattedBalance = parseInt(ethers.formatEther(balance)).toFixed(2);
    setBalance(formattedBalance.toString());
  };

  const transferETH = async () => {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    // 转账参数
    const recipientAddress = "0x6E788566A96b3F4a764E6a16914F666558b30e56";
    const amountInEther = "1"; // 转账金额（单位：ETH）
    // 获取当前 nonce
    const nonce = await provider.getTransactionCount(wallet.address);
    // 获取 Gas 费用
    const feeData = await provider.getFeeData();

    const tx = {
      // 转账给谁
      to: recipientAddress,
      // 转账数量，需要将 0.01 ETH转换为 wei 单位
      value: ethers.parseEther(amountInEther),
      // 交易 nonce
      nonce: nonce,
      // 标准转账 gas 限制, 设置一个 gas 费用上限，避免多扣
      gasLimit: 21000,
      // 设置 gas 价格
      gasPrice: feeData.gasPrice,
    };

    // 签名并发送交易
    const transaction = await wallet.sendTransaction(tx);
    // 等待交易确认
    const receipt = await transaction.wait();
    setReceipt(receipt);
  };

  const transferERC20Token = async () => {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    const tokenAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC
    // 声明ABI接口，用于调用代币合约的方法
    const tokenABI = [
      "function symbol() view returns (string)",
      "function transfer(address to, uint256 value) public returns (bool)",
      "function decimals() view returns (uint8)",
    ];
    // 创建代币合约实例
    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, wallet);

    // 转账参数
    const recipientAddress = "0x6E788566A96b3F4a764E6a16914F666558b30e56"; // 替换为接收者地址
    const decimals = await tokenContract.decimals(); // 获取代币小数位数
    const amount = ethers.parseUnits(String(100), decimals); // 转账金额100个代币

    // 发送代币转账交易
    const tx = await tokenContract.transfer(recipientAddress, amount);

    // 等待交易确认
    const receipt = await tx.wait();
    setReceipt(receipt);
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div>
        <div>RPC: {rpcUrl}</div>
      </div>
      <main>
        <h1 className="text-2xl font-bold mt-8 mb-4">Practice Wallet</h1>
        <div className="grid gap-4">
          <div className="card">
            <button className="test-btn mb-2" onClick={createRandomWallet}>
              <div>createRandomWallet</div>
            </button>
            <div className="flex flex-col gap-2 ml-2">
              {randomWallet && (
                <div>
                  <div>address： {randomWallet.address}</div>
                  <div>privateKey： {randomWallet.privateKey}</div>
                  <div>publicKey： {randomWallet.publicKey}</div>
                  <div>mnemonic：{randomWallet.mnemonic.phrase}</div>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <button
              className="test-btn mb-2"
              onClick={importWalletByPrivateKey}
            >
              <div>importWalletByPrivateKey</div>
            </button>
            <div className="flex flex-col gap-2 ml-2">
              {importWallet && (
                <div>
                  <div>address： {importWallet.address}</div>
                  <div>privateKey： {importWallet.privateKey}</div>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <button className="test-btn mb-2" onClick={importWalletByPhrase}>
              <div>importWalletByPhrase</div>
            </button>
            <div className="flex flex-col gap-2 ml-2">
              {importWallet && (
                <div>
                  <div>address： {importWallet.address}</div>
                  <div>privateKey： {importWallet.privateKey}</div>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <button className="test-btn mb-2" onClick={getMyBalance}>
              <div>getBalance</div>
            </button>
            <div className="flex flex-col gap-2 ml-2">
              {balance && (
                <div>
                  <div>balance： {balance}</div>
                  <div>symbol： ETH</div>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <button className="test-btn mb-2" onClick={transferETH}>
              <div>transferETH</div>
            </button>
            <div className="flex flex-col gap-2 ml-2">
              {receipt && (
                <div>
                  <div>{`交易已确认，区块号：${receipt?.blockNumber}, Hash: ${receipt?.hash}`}</div>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <button className="test-btn mb-2" onClick={transferERC20Token}>
              <div>transferERC20Token</div>
            </button>
            <div className="flex flex-col gap-2 ml-2">
              {receipt && (
                <div>
                  <div>{`交易已确认，区块号：${receipt?.blockNumber}, Hash: ${receipt?.hash}`}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
