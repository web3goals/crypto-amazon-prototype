"use client";

import { checkoutAbi } from "@/abi/checkout";
import { ChainConfig } from "@/config/chains";
import usePrices from "@/hooks/usePrices";
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
  const { prices } = usePrices();

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
              buyer: sale.buyer,
              date: sale.date,
              paymentAmount: sale.paymentAmount,
              paymentTokenSymbol: paymentTokenSymbol || "",
              chainConfig: props.chainConfig,
            }}
            price={prices?.get(sale.asin)}
          />
        );
      }}
      noEntitiesText={`No sales on ${props.chainConfig.chain.name} 😐`}
    />
  );
}
