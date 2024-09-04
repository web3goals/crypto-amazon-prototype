"use client";

import { Product } from "@/types/product";
import { useState } from "react";
import { storefrontAbi } from "@/abi/storefront";
import useError from "@/hooks/useError";
import {
  getStorefrontChainConfig,
  getSummarizerChainConfig,
} from "@/lib/chains";
import { zodResolver } from "@hookform/resolvers/zod";
import { BarcodeIcon, CheckIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import Confetti from "react-confetti";
import { useForm } from "react-hook-form";
import { parseEther } from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { summarizerAbi } from "@/abi/summarizer";

// TODO: Implement
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
