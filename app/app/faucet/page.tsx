"use client";

import { fanTokenAbi } from "@/abi/fan-token";
import { usdtAbi } from "@/abi/usdt";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { ChainConfig } from "@/config/chains";
import useError from "@/hooks/useError";
import {
  getChainConfigsWithFanToken,
  getChainConfigsWithUsdt,
} from "@/lib/chains";
import { CoinsIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { parseUnits } from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

export default function FaucetPage() {
  return (
    <main className="container py-10 lg:px-80">
      <h2 className="text-2xl font-bold tracking-tight"></h2>
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Faucet</h2>
        <p className="text-muted-foreground">
          Get free testnet tokens to test the app
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col gap-4">
        {getChainConfigsWithUsdt().map((chainConfig, index) => (
          <FaucetUsdt key={index} chainConfig={chainConfig} />
        ))}
        {getChainConfigsWithFanToken().map((chainConfig, index) => (
          <FaucetFanToken key={index} chainConfig={chainConfig} />
        ))}
      </div>
    </main>
  );
}

function FaucetUsdt(props: { chainConfig: ChainConfig }) {
  const { handleError } = useError();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const [minting, setMinting] = useState(false);
  const mintAmount = 500;

  async function onMint() {
    try {
      setMinting(true);
      // Check public client
      if (!publicClient) {
        throw new Error("Public client is not ready");
      }
      // Check wallet
      if (!address || !walletClient) {
        throw new Error("Wallet is not connected");
      }
      // Send transaction
      const txHash = await walletClient.writeContract({
        address: props.chainConfig.usdt,
        abi: usdtAbi,
        functionName: "mint",
        args: [parseUnits(mintAmount.toString(), 18), address],
        chain: props.chainConfig.chain,
      });
      await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });
      toast({ title: "Token minted 🎉" });
    } catch (error) {
      handleError(error, true);
    } finally {
      setMinting(false);
    }
  }

  return (
    <div className="w-full flex flex-col items-start border rounded px-6 py-8">
      <p className="text font-bold">USDT ({props.chainConfig.chain.name})</p>
      <a
        href={
          props.chainConfig.chain.blockExplorers?.default.url +
          "/token/" +
          props.chainConfig.usdt
        }
        target="_blank"
        className="text-sm text-muted-foreground break-all underline underline-offset-4 mt-1"
      >
        {props.chainConfig.usdt}
      </a>
      <Button className="mt-8" disabled={minting} onClick={() => onMint()}>
        {minting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <CoinsIcon className="mr-2 h-4 w-4" />
        )}
        Mint {mintAmount} USDT
      </Button>
    </div>
  );
}

function FaucetFanToken(props: { chainConfig: ChainConfig }) {
  const { handleError } = useError();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const [minting, setMinting] = useState(false);
  const mintAmount = 100;

  async function onMint() {
    try {
      setMinting(true);
      // Check public client
      if (!publicClient) {
        throw new Error("Public client is not ready");
      }
      // Check wallet
      if (!address || !walletClient) {
        throw new Error("Wallet is not connected");
      }
      // Send transaction
      const txHash = await walletClient.writeContract({
        address: props.chainConfig.fanToken,
        abi: fanTokenAbi,
        functionName: "mint",
        args: [parseUnits(mintAmount.toString(), 0), address],
        chain: props.chainConfig.chain,
      });
      await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });
      toast({ title: "Token minted 🎉" });
    } catch (error) {
      handleError(error, true);
    } finally {
      setMinting(false);
    }
  }

  return (
    <div className="w-full flex flex-col items-start border rounded px-6 py-8">
      <p className="text font-bold">FANT ({props.chainConfig.chain.name})</p>
      <a
        href={
          props.chainConfig.chain.blockExplorers?.default.url +
          "/token/" +
          props.chainConfig.fanToken
        }
        target="_blank"
        className="text-sm text-muted-foreground break-all underline underline-offset-4 mt-1"
      >
        {props.chainConfig.fanToken}
      </a>
      <Button className="mt-8" disabled={minting} onClick={() => onMint()}>
        {minting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <CoinsIcon className="mr-2 h-4 w-4" />
        )}
        Mint {mintAmount} FANT
      </Button>
    </div>
  );
}
