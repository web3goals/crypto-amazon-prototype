"use client";

import { ChainConfig, chainConfigs } from "@/config/chains";
import useError from "@/hooks/useError";
import { getChainConfigById, getChainConfigsWithCheckout } from "@/lib/chains";
import { Product } from "@/types/product";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckIcon,
  Loader2,
  MoveRightIcon,
  ShoppingBasketIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Confetti from "react-confetti";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Skeleton } from "../ui/skeleton";
import { Address, erc20Abi, formatEther, maxUint256 } from "viem";
import { checkoutAbi } from "@/abi/checkout";
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWalletClient,
} from "wagmi";

type BuyingFormData = {
  buyerName: string;
  buyerAddress: string;
  chainConfig: ChainConfig;
};

export function BuyerProductCardFooterBuying(props: {
  product: Product;
  price: bigint | undefined;
  verifiedSeller: Address | undefined;
}) {
  const [buyingFormData, setBuyingFormData] = useState<
    BuyingFormData | undefined
  >(undefined);
  const [bought, setBought] = useState(false);

  if (bought) {
    return <SellerProductCardFooterBuyingMessage />;
  }

  if (buyingFormData) {
    return (
      <SellerProductCardFooterBuyingFormConfirm
        product={props.product}
        price={props.price}
        verifiedSeller={props.verifiedSeller}
        buyingFormData={buyingFormData}
        onBought={() => setBought(true)}
      />
    );
  }

  return (
    <SellerProductCardFooterBuyingForm
      product={props.product}
      onFilled={(formData) => {
        setBuyingFormData(formData);
      }}
    />
  );
}

function SellerProductCardFooterBuyingForm(props: {
  product: Product;
  onFilled: (buyingFormData: BuyingFormData) => void;
}) {
  const { handleError } = useError();
  const [submitting, setSubmitting] = useState(false);

  const formSchema = z.object({
    name: z.string().min(2),
    address: z.string().min(2),
    chain: z.string({
      required_error: "Please select a token",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setSubmitting(true);
      const chainConfig = getChainConfigById(values.chain);
      if (!chainConfig) {
        throw new Error("Failed to define chain config");
      }
      props.onFilled({
        buyerName: values.name,
        buyerAddress: values.address,
        chainConfig: chainConfig,
      });
    } catch (error) {
      handleError(error, true);
      setSubmitting(false);
    }
  }

  return (
    <div>
      <p className="text-base font-bold">Fill out the form</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Alice..."
                    disabled={submitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="789 Pine Avenue..."
                    disabled={submitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="chain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token for payment</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a token" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {getChainConfigsWithCheckout().map((chainConfig, index) => (
                      <SelectItem
                        key={index}
                        value={chainConfig.chain.id.toString()}
                      >
                        {chainConfig.checkoutPaymentTokenSymbol} (
                        {chainConfig.chain.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  You can use{" "}
                  <Link href="/faucet" className="underline underline-offset-4">
                    this faucet
                  </Link>{" "}
                  to get free testnet tokens
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <MoveRightIcon className="mr-2 h-4 w-4" />
            )}
            Continue
          </Button>
        </form>
      </Form>
    </div>
  );
}

function SellerProductCardFooterBuyingFormConfirm(props: {
  product: Product;
  price: bigint | undefined;
  verifiedSeller: Address | undefined;
  buyingFormData: BuyingFormData;
  onBought: () => void;
}) {
  const { handleError } = useError();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const [submitting, setSubmitting] = useState(false);

  const { data: chainlinkDataFeedAnswer } = useReadContract({
    address: props.buyingFormData.chainConfig.checkout,
    abi: checkoutAbi,
    functionName: "getChainlinkDataFeedAnswer",
    args: [],
    chainId: props.buyingFormData.chainConfig.chain.id,
  });

  const { data: paymentToken } = useReadContract({
    address: props.buyingFormData.chainConfig.checkout,
    abi: checkoutAbi,
    functionName: "getPaymentToken",
    args: [],
    chainId: props.buyingFormData.chainConfig.chain.id,
  });

  const paymentAmount =
    props.price &&
    chainlinkDataFeedAnswer &&
    chainlinkDataFeedAnswer !== BigInt(0)
      ? (props.price / chainlinkDataFeedAnswer) * BigInt(10 ** 8)
      : BigInt(0);

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
      // Check other params
      if (!paymentToken) {
        throw new Error("Payment token not defined");
      }
      if (!props.verifiedSeller) {
        throw new Error("Seller not defined");
      }
      // Approve transfer
      const approveTxHash = await walletClient.writeContract({
        address: paymentToken,
        abi: erc20Abi,
        functionName: "approve",
        args: [props.buyingFormData.chainConfig.checkout, maxUint256],
        chain: props.buyingFormData.chainConfig.chain,
      });
      await publicClient.waitForTransactionReceipt({
        hash: approveTxHash,
      });
      // Buy product
      const buyTxHash = await walletClient.writeContract({
        address: props.buyingFormData.chainConfig.checkout,
        abi: checkoutAbi,
        functionName: "buyProduct",
        args: [
          props.product.asin,
          props.verifiedSeller,
          props.buyingFormData.buyerName,
          props.buyingFormData.buyerAddress,
          paymentAmount,
        ],
        chain: props.buyingFormData.chainConfig.chain,
      });
      await publicClient.waitForTransactionReceipt({
        hash: buyTxHash,
      });
      props.onBought();
    } catch (error) {
      handleError(error, true);
      setSubmitting(false);
    }
  }

  if (
    !chainlinkDataFeedAnswer ||
    !paymentToken ||
    paymentAmount === BigInt(0)
  ) {
    return <Skeleton className="h-8" />;
  }

  return (
    <div>
      <p className="text-base font-bold">Final payment</p>
      <div className="flex flex-row items-end gap-2 mt-1">
        <p className="text-2xl font-bold">{formatEther(paymentAmount)}</p>
        <p>USDT ({props.buyingFormData.chainConfig.chain.name})</p>
      </div>
      <Button
        type="submit"
        disabled={submitting}
        onClick={() => onSubmit()}
        className="mt-6"
      >
        {submitting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <CheckIcon className="mr-2 h-4 w-4" />
        )}
        Confirm
      </Button>
    </div>
  );
}

function SellerProductCardFooterBuyingMessage() {
  return (
    <div>
      <p className="text-base font-bold">Product bought 🎉</p>
      <p className="text-sm text-muted-foreground mt-1">
        You can contact the seller on your purchases page
      </p>
      <Link href={`/buyer/purchases`}>
        <Button className="mt-4">
          <ShoppingBasketIcon className="mr-2 h-4 w-4" /> Open Purchases Page
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
