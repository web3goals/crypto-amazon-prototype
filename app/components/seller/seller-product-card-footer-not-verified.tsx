"use client";

import { storefrontAbi } from "@/abi/storefront";
import useError from "@/hooks/useError";
import { getStorefrontChainConfig } from "@/lib/chains";
import { Product } from "@/lib/products";
import { Loader2, ShieldCheckIcon } from "lucide-react";
import { useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { Button } from "../ui/button";

export function SellerProductCardFooterNotVerified(props: {
  product: Product;
  sellerAmazonToken: string;
}) {
  const [verified, setVerified] = useState(false);

  if (verified) {
    return <SellerProductCardFooterVerificationMessage />;
  }

  return (
    <SellerProductCardFooterVerificationButton
      product={props.product}
      sellerAmazonToken={props.sellerAmazonToken}
      onVerify={() => setVerified(true)}
    />
  );
}

function SellerProductCardFooterVerificationButton(props: {
  product: Product;
  sellerAmazonToken: string;
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
        address: getStorefrontChainConfig().storefront,
        abi: storefrontAbi,
        functionName: "verifyProduct",
        args: [props.product.asin, props.sellerAmazonToken],
        chain: getStorefrontChainConfig().chain,
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
    <div>
      <Button variant="default" disabled={verifying} onClick={() => onVerify()}>
        {verifying ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <ShieldCheckIcon className="mr-2 h-4 w-4" />
        )}
        Verify
      </Button>
    </div>
  );
}

function SellerProductCardFooterVerificationMessage() {
  return (
    <div>
      <p className="text-base font-bold">Verification request sent 👌</p>
      <p className="text-sm text-muted-foreground mt-1">
        Reload the page to see the updates
      </p>
    </div>
  );
}
