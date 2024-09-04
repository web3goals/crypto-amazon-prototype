"use client";

import { summarizerAbi } from "@/abi/summarizer";
import useError from "@/hooks/useError";
import { getSummarizerChainConfig } from "@/lib/chains";
import { Product } from "@/types/product";
import { CheckIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import Confetti from "react-confetti";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { Button } from "../ui/button";

export function SellerProductCardFooterSummarizing(props: {
  product: Product;
}) {
  const [summarized, setSummarized] = useState(false);

  if (summarized) {
    return <SellerProductCardFooterSummarizinMessage />;
  }

  return (
    <SellerProductCardFooterSummarizingForm
      product={props.product}
      onSummarize={() => setSummarized(true)}
    />
  );
}

function SellerProductCardFooterSummarizingForm(props: {
  product: Product;
  onSummarize: () => void;
}) {
  const { handleError } = useError();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit() {
    try {
      setSubmitting(true);
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
        address: getSummarizerChainConfig().summarizer,
        abi: summarizerAbi,
        functionName: "createSummary",
        args: [props.product.asin, props.product.reviews],
        chain: getSummarizerChainConfig().chain,
      });
      await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });
      props.onSummarize();
    } catch (error) {
      handleError(error, true);
      setSubmitting(false);
    }
  }

  return (
    <div>
      <p className="text-base font-bold">Do you confirm?</p>
      <p className="text-sm text-muted-foreground mt-1">
        The app will analyze the reviews on Amazon and generate a summary
      </p>
      <Button
        type="submit"
        disabled={submitting}
        onClick={() => onSubmit()}
        className="mt-4"
      >
        {submitting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <CheckIcon className="mr-2 h-4 w-4" />
        )}
        Сonfirm
      </Button>
    </div>
  );
}

function SellerProductCardFooterSummarizinMessage() {
  return (
    <div>
      <p className="text-base font-bold">Summary generated 🎉</p>
      <p className="text-sm text-muted-foreground mt-1">
        Refresh the page to see the result
      </p>
      <Confetti
        width={document.body.clientWidth}
        height={document.body.scrollHeight}
        recycle={false}
      />
    </div>
  );
}
