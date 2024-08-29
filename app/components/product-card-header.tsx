"use client";

import { Product } from "@/lib/products";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useReadContract } from "wagmi";
import { storefrontAbi } from "@/abi/storefront";
import { ChainConfig } from "@/config/chains";
import { addressToShortAddress } from "@/lib/converters";

// TODO: Display verification status
// TODO: Load price
export function ProductCardHeader(props: {
  product: Product;
  storefrontChainConfing: ChainConfig;
}) {
  const { data: verifiedSeller } = useReadContract({
    address: props.storefrontChainConfing.storefront,
    abi: storefrontAbi,
    functionName: "getVerifiedSeller",
    args: [props.product.asin],
    chainId: props.storefrontChainConfing.chain.id,
  });

  return (
    <div>
      <Avatar className="size-48 rounded-sm">
        <AvatarImage src={props.product.image} alt="Product" />
        <AvatarFallback className="text-6xl rounded-sm">🖼️</AvatarFallback>
      </Avatar>
      <p className="text font-bold mt-4">{props.product.title}</p>
      <div className="flex flex-col md:flex-row md:gap-3 mt-4">
        <p className="min-w-[60px] text-sm text-muted-foreground">Seller:</p>
        <a
          href={`https://www.amazon.com/sp?&seller=${props.product.seller}`}
          target="_blank"
          className="text-sm break-all underline underline-offset-4"
        >
          <p className="text-sm break-all">{props.product.sellerTitle}</p>
        </a>
        {verifiedSeller && (
          <a
            href={
              props.storefrontChainConfing.chain.blockExplorers?.default.url +
              "/address/" +
              verifiedSeller
            }
            target="_blank"
            className="text-sm text-muted-foreground break-all underline underline-offset-4"
          >
            {addressToShortAddress(verifiedSeller)}
          </a>
        )}
      </div>
      <div className="flex flex-col md:flex-row md:gap-3 mt-2">
        <p className="min-w-[60px] text-sm text-muted-foreground">ASIN:</p>
        <a
          href={`https://www.amazon.com/dp/${props.product.asin}`}
          target="_blank"
          className="text-sm break-all underline underline-offset-4"
        >
          <p className="text-sm break-all">{props.product.asin}</p>
        </a>
      </div>
    </div>
  );
}
