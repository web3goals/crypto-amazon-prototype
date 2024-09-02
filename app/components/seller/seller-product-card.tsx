"use client";

import { storefrontAbi } from "@/abi/storefront";
import { getStorefrontChainConfig } from "@/lib/chains";
import { Product } from "@/lib/products";
import { useEffect, useState } from "react";
import { isAddressEqual } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { ProductCardHeader } from "../product/product-card-header";
import { Separator } from "../ui/separator";
import { SellerProductCardFooterNotVerified } from "./seller-product-card-footer-not-verified";
import { SellerProductCardFooterVerified } from "./seller-product-card-footer-verified";

export function SellerProductCard(props: {
  product: Product;
  price: bigint | undefined;
  sellerAmazonToken: string;
}) {
  const { address } = useAccount();
  const [verified, setVerified] = useState<boolean | undefined>();

  const { data: verifiedSeller } = useReadContract({
    address: getStorefrontChainConfig().storefront,
    abi: storefrontAbi,
    functionName: "getVerifiedSeller",
    args: [props.product.asin],
    chainId: getStorefrontChainConfig().chain.id,
  });

  useEffect(() => {
    if (verifiedSeller && address && !isAddressEqual(verifiedSeller, address)) {
      setVerified(false);
    }
    if (verifiedSeller && address && isAddressEqual(verifiedSeller, address)) {
      setVerified(true);
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
      {verified === false && (
        <SellerProductCardFooterNotVerified
          product={props.product}
          sellerAmazonToken={props.sellerAmazonToken}
        />
      )}
      {verified === true && (
        <SellerProductCardFooterVerified product={props.product} />
      )}
    </div>
  );
}
