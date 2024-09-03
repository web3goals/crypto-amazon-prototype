"use client";

import { checkoutAbi } from "@/abi/checkout";
import { ChainConfig } from "@/config/chains";
import useListedProductsFinder from "@/hooks/useListedProductsFinder";
import { getChainConfigsWithCheckout } from "@/lib/chains";
import { erc20Abi, zeroAddress } from "viem";
import { useAccount, useReadContract } from "wagmi";
import EntityList from "../entity-list";
import { BuyerPurchaseCard } from "./buyer-purchase-card";

export function BuyerPurchases() {
  return (
    <div className="flex flex-col gap-6">
      {getChainConfigsWithCheckout().map((chainConfig, index) => (
        <BuyerPurchasesByChain key={index} chainConfig={chainConfig} />
      ))}
    </div>
  );
}

function BuyerPurchasesByChain(props: { chainConfig: ChainConfig }) {
  const { address } = useAccount();
  const { data: listedProducts } = useListedProductsFinder();

  const { data: purchases } = useReadContract({
    address: props.chainConfig.checkout,
    abi: checkoutAbi,
    functionName: "getPurchases",
    args: [address || zeroAddress],
    chainId: props.chainConfig.chain.id,
  });

  const { data: paymentToken } = useReadContract({
    address: props.chainConfig.checkout,
    abi: checkoutAbi,
    functionName: "getPaymentToken",
    args: [],
    chainId: props.chainConfig.chain.id,
  });

  const { data: paymentTokenSymbol } = useReadContract({
    address: paymentToken,
    abi: erc20Abi,
    functionName: "symbol",
    args: [],
    chainId: props.chainConfig.chain.id,
  });

  return (
    <EntityList
      entities={purchases}
      renderEntityCard={(purchase, index) => {
        return (
          <BuyerPurchaseCard
            key={index}
            deal={{
              asin: purchase.asin,
              seller: purchase.seller,
              buyer: purchase.buyer,
              buyerName: purchase.buyerName,
              buyerAddress: purchase.buyerAddress,
              date: purchase.date,
              paymentAmount: purchase.paymentAmount,
              paymentTokenSymbol: paymentTokenSymbol || "",
              chainConfig: props.chainConfig,
            }}
            listedProduct={listedProducts?.find(
              (listedProduct) => listedProduct.asin === purchase.asin
            )}
          />
        );
      }}
      noEntitiesText={`No purchases on ${props.chainConfig.chain.name} 😐`}
    />
  );

  return <></>;
}
