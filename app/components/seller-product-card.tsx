"use client";

import { Product } from "@/lib/products";
import { ProductCardHeader } from "./product-card-header";
import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { chainConfigs } from "@/config/chains";
import { storefrontAbi } from "@/abi/storefront";
import { SellerProductCardFooterVerification } from "./seller-product-card-footer-verification";
import { isAddressEqual } from "viem";
import { SellerProductCardFooterVerified } from "./seller-product-card-footer-verified";
import { Separator } from "./ui/separator";

export function SellerProductCard(props: {
  product: Product;
  sellerAmazonToken: string;
}) {
  const { address } = useAccount();
  const [state, setState] = useState<
    "VERIFICATION_REQUIRED" | "VERIFIED" | undefined
  >();
  const storefrontChainConfing = chainConfigs.optimismSepolia;

  const { data: verifiedSeller } = useReadContract({
    address: storefrontChainConfing.storefront,
    abi: storefrontAbi,
    functionName: "getVerifiedSeller",
    args: [props.product.asin],
    chainId: storefrontChainConfing.chain.id,
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
        storefrontChainConfing={storefrontChainConfing}
      />
      <Separator className="my-6" />
      {state === "VERIFICATION_REQUIRED" && (
        <SellerProductCardFooterVerification
          product={props.product}
          sellerAmazonToken={props.sellerAmazonToken}
          storefrontChainConfing={storefrontChainConfing}
        />
      )}
      {state === "VERIFIED" && (
        <SellerProductCardFooterVerified
          product={props.product}
          storefrontChainConfing={storefrontChainConfing}
        />
      )}
    </div>
  );
}
