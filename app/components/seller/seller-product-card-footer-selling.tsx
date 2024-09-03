"use client";

import { storefrontAbi } from "@/abi/storefront";
import useError from "@/hooks/useError";
import { getStorefrontChainConfig } from "@/lib/chains";
import { Product } from "@/types/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { BarcodeIcon, CheckIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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

export function SellerProductCardFooterSelling(props: { product: Product }) {
  const [listed, setListed] = useState(false);

  if (listed) {
    return <SellerProductCardFooterSellingMessage product={props.product} />;
  }

  return (
    <SellerProductCardFooterSellingForm
      product={props.product}
      onList={() => setListed(true)}
    />
  );
}

function SellerProductCardFooterSellingForm(props: {
  product: Product;
  onList: () => void;
}) {
  const { handleError } = useError();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const [listing, setListing] = useState(false);

  const formSchema = z.object({
    price: z.coerce.number().gt(0),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setListing(true);
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
        functionName: "listProduct",
        args: [props.product.asin, parseEther(String(values.price))],
        chain: getStorefrontChainConfig().chain,
      });
      await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });
      props.onList();
    } catch (error) {
      handleError(error, true);
      setListing(false);
    }
  }

  return (
    <div>
      <p className="text-base font-bold">Set a price for the sale (USD)</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="420"
                    type="number"
                    disabled={listing}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={listing}>
            {listing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckIcon className="mr-2 h-4 w-4" />
            )}
            Сonfirm
          </Button>
        </form>
      </Form>
    </div>
  );
}

function SellerProductCardFooterSellingMessage(props: { product: Product }) {
  return (
    <div>
      <p className="text-base font-bold">Congratulations 🎉</p>
      <p className="text-sm text-muted-foreground mt-1">
        Your product can now be bought in crypto
      </p>
      <Link href={`/products/${props.product.asin}`}>
        <Button className="mt-4">
          <BarcodeIcon className="mr-2 h-4 w-4" /> Open Product Page
        </Button>
      </Link>
      <Confetti
        width={document.body.clientWidth}
        height={document.body.scrollHeight}
        recycle={false}
      />
    </div>
  );
}
