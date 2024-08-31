"use client";

import { storefrontAbi } from "@/abi/storefront";
import { getStorefrontChainConfig } from "@/lib/chains";
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
  sellerAmazonToken: string;
}) {
  const { address } = useAccount();
  const [state, setState] = useState<
    "VERIFICATION_REQUIRED" | "VERIFIED" | undefined
  >();

  const { data: verifiedSeller } = useReadContract({
    address: getStorefrontChainConfig().storefront,
    abi: storefrontAbi,
    functionName: "getVerifiedSeller",
    args: [props.product.asin],
    chainId: getStorefrontChainConfig().chain.id,
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
        verifiedSeller={verifiedSeller}
      />
      <Separator className="my-6" />
      {state === "VERIFICATION_REQUIRED" && (
        <SellerProductCardFooterVerification
          product={props.product}
          sellerAmazonToken={props.sellerAmazonToken}
        />
      )}
      {state === "VERIFIED" && (
        <SellerProductCardFooterVerified product={props.product} />
      )}
    </div>
  );
}
