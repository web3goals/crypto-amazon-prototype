"use client";

import { storefrontAbi } from "@/abi/storefront";
import { ChainConfig } from "@/config/chains";
import { Product } from "@/lib/products";
import { useEffect, useState } from "react";
import { isAddressEqual } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { ProductCardHeader } from "./product-card-header";
import { SellerProductCardFooterVerification } from "./seller-product-card-footer-verification";
import { SellerProductCardFooterVerified } from "./seller-product-card-footer-verified";
import { Separator } from "./ui/separator";

export function SellerProductCard(props: {
  product: Product;
  price: bigint | undefined;
  storefrontChainConfig: ChainConfig;
  sellerAmazonToken: string;
}) {
  const { address } = useAccount();
  const [state, setState] = useState<
    "VERIFICATION_REQUIRED" | "VERIFIED" | undefined
  >();

  const { data: verifiedSeller } = useReadContract({
    address: props.storefrontChainConfig.storefront,
    abi: storefrontAbi,
    functionName: "getVerifiedSeller",
    args: [props.product.asin],
    chainId: props.storefrontChainConfig.chain.id,
  });

  useEffect(() => {
    if (verifiedSeller && address && !isAddressEqual(verifiedSeller, address)) {
      setState("VERIFICATION_REQUIRED");
    }
    if (verifiedSeller && address && isAddressEqual(verifiedSeller, address)) {
      setState("VERIFIED");
    }
  }, [verifiedSeller, address]);

  return (
    <div className="w-full flex flex-col border rounded px-6 py-8">
      <ProductCardHeader
        product={props.product}
        price={props.price}
        storefrontChainConfig={props.storefrontChainConfig}
      />
      <Separator className="my-6" />
      {state === "VERIFICATION_REQUIRED" && (
        <SellerProductCardFooterVerification
          product={props.product}
          sellerAmazonToken={props.sellerAmazonToken}
          storefrontChainConfig={props.storefrontChainConfig}
        />
      )}
      {state === "VERIFIED" && (
        <SellerProductCardFooterVerified
          product={props.product}
          storefrontChainConfig={props.storefrontChainConfig}
        />
      )}
    </div>
  );
}
