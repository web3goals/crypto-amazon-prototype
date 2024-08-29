"use client";

import useError from "@/hooks/useError";
import { Product } from "@/lib/products";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { Loader2, ShieldCheckIcon } from "lucide-react";
import { useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { Button } from "./ui/button";
import { ChainConfig } from "@/config/chains";
import { storefrontAbi } from "@/abi/storefront";

export function SellerProductCardFooterVerification(props: {
  product: Product;
  sellerAmazonToken: string;
  storefrontChainConfing: ChainConfig;
  className?: ClassValue;
}) {
  const [verified, setVerified] = useState(false);

  return (
    <div className={cn(props.className)}>
      {verified ? (
        <SellerProductCardFooterVerificationMessage />
      ) : (
        <SellerProductCardFooterVerificationButton
          product={props.product}
          sellerAmazonToken={props.sellerAmazonToken}
          storefrontChainConfing={props.storefrontChainConfing}
          onVerify={() => setVerified(true)}
        />
      )}
    </div>
  );
}

function SellerProductCardFooterVerificationButton(props: {
  product: Product;
  sellerAmazonToken: string;
  storefrontChainConfing: ChainConfig;
  onVerify: () => void;
}) {
  const { handleError } = useError();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const [verifying, setVerifying] = useState(false);

  async function onVerify() {
    try {
      setVerifying(true);
      // Check public client
      if (!publicClient) {
        throw new Error("Public client is not ready");
      }
      // Check wallet
      if (!address || !walletClient) {
        throw new Error("Wallet is not connected");
      }
      // Send tx
      const txHash = await walletClient.writeContract({
        address: props.storefrontChainConfing.storefront,
        abi: storefrontAbi,
        functionName: "verifyProduct",
        args: [props.product.asin, props.sellerAmazonToken],
        chain: props.storefrontChainConfing.chain,
      });
      await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });
      props.onVerify();
    } catch (error) {
      handleError(error, true);
      setVerifying(false);
    }
  }

  return (
    <Button variant="default" disabled={verifying} onClick={() => onVerify()}>
      {verifying ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <ShieldCheckIcon className="mr-2 h-4 w-4" />
      )}
      Verify
    </Button>
  );
}

function SellerProductCardFooterVerificationMessage() {
  return (
    <div>
      <p className="text font-bold">Verification request sent 👌</p>
      <p className="text-sm text-muted-foreground mt-1">
        Reload the page to see the updates
      </p>
    </div>
  );
}
