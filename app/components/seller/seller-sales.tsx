"use client";

import { checkoutAbi } from "@/abi/checkout";
import { ChainConfig } from "@/config/chains";
import useListedProductsFinder from "@/hooks/useListedProductsFinder";
import { getChainConfigsWithCheckout } from "@/lib/chains";
import { erc20Abi, zeroAddress } from "viem";
import { useAccount, useReadContract } from "wagmi";
import EntityList from "../entity-list";
import { SellerSaleCard } from "./seller-sale-card";

export function SellerSales() {
  return (
    <div className="flex flex-col gap-6">
      {getChainConfigsWithCheckout().map((chainConfig, index) => (
        <SellerSalesByChain key={index} chainConfig={chainConfig} />
      ))}
    </div>
  );
}

function SellerSalesByChain(props: { chainConfig: ChainConfig }) {
  const { address } = useAccount();
  const { data: listedProducts } = useListedProductsFinder();

  const { data: sales } = useReadContract({
    address: props.chainConfig.checkout,
    abi: checkoutAbi,
    functionName: "getSales",
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
      entities={sales as any[]}
      renderEntityCard={(sale, index) => {
        return (
          <SellerSaleCard
            key={index}
            deal={{
              asin: sale.asin,
              seller: sale.seller,
              buyer: sale.buyer,
              buyerName: sale.buyerName,
              buyerAddress: sale.buyerAddress,
              date: sale.date,
              paymentAmount: sale.paymentAmount,
              paymentTokenSymbol: paymentTokenSymbol || "",
              chainConfig: props.chainConfig,
            }}
            listedProduct={listedProducts?.find(
              (listedProduct) => listedProduct.asin === sale.asin
            )}
          />
        );
      }}
      noEntitiesText={`No sales on ${props.chainConfig.chain.name} 😐`}
    />
  );
}
