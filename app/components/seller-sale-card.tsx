"use client";

import { storefrontAbi } from "@/abi/storefront";
import { getStorefrontChainConfig } from "@/lib/chains";
import { findProduct, Product } from "@/lib/products";
import { useReadContract } from "wagmi";
import { ProductCardHeader } from "./product-card-header";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import useError from "@/hooks/useError";
import { ChainConfig } from "@/config/chains";
import { Address } from "viem";

export function SellerSaleCard(props: {
  deal: {
    asin: string;
    buyer: Address;
    date: bigint;
    paymentAmount: bigint;
    paymentTokenSymbol: string;
    chainConfig: ChainConfig;
  };
  price: bigint | undefined;
}) {
  const { handleError } = useError();
  const [product, setProduct] = useState<Product | undefined>();

  const { data: verifiedSeller } = useReadContract({
    address: getStorefrontChainConfig().storefront,
    abi: storefrontAbi,
    functionName: "getVerifiedSeller",
    args: [props.deal.asin],
    chainId: getStorefrontChainConfig().chain.id,
  });

  useEffect(() => {
    findProduct(props.deal.asin)
      .then((product) => setProduct(product))
      .catch((error) => {
        handleError(error, true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.deal.asin]);

  if (!product) {
    return <Skeleton className="w-4" />;
  }

  return (
    <div className="w-full flex flex-col border rounded px-6 py-8">
      <ProductCardHeader
        product={product}
        price={props.price}
        verifiedSeller={verifiedSeller}
        deal={{
          buyer: props.deal.buyer,
          date: props.deal.date,
          paymentAmount: props.deal.paymentAmount,
          paymentTokenSymbol: props.deal.paymentTokenSymbol,
          chainConfig: props.deal.chainConfig,
        }}
      />
      {/* TODO: Add footer */}
    </div>
  );
}
