"use client";

import { storefrontAbi } from "@/abi/storefront";
import { getStorefrontChainConfig } from "@/lib/chains";
import { addressToShortAddress } from "@/lib/converters";
import { Product } from "@/lib/products";
import { ShieldCheckIcon } from "lucide-react";
import { formatEther, isAddressEqual, zeroAddress } from "viem";
import { useReadContract } from "wagmi";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function ProductCardHeader(props: {
  product: Product;
  price: bigint | undefined;
}) {
  const { data: verifiedSeller } = useReadContract({
    address: getStorefrontChainConfig().storefront,
    abi: storefrontAbi,
    functionName: "getVerifiedSeller",
    args: [props.product.asin],
    chainId: getStorefrontChainConfig().chain.id,
  });

  return (
    <div className="flex flex-col items-start">
      <Avatar className="size-48 rounded-sm">
        <AvatarImage src={props.product.image} alt="Product" />
        <AvatarFallback className="text-6xl rounded-sm">🖼️</AvatarFallback>
      </Avatar>
      <p className="text font-bold mt-4">{props.product.title}</p>
      {verifiedSeller && !isAddressEqual(verifiedSeller, zeroAddress) && (
        <div className="flex flex-row items-center gap-1 bg-primary px-3 py-1.5 rounded-xl mt-2">
          <ShieldCheckIcon className="text-primary-foreground h-4 w-4" />
          <p className="text-xs font-semibold text-primary-foreground">
            Seller & Product Verified
          </p>
        </div>
      )}
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
              getStorefrontChainConfig().chain.blockExplorers?.default.url +
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
      <div className="flex flex-col md:flex-row md:gap-3 mt-2">
        <p className="min-w-[60px] text-sm text-muted-foreground">Price:</p>
        <p className="text-sm break-all">
          {props.price ? `${formatEther(props.price)} USD` : "Unsaleable"}
        </p>
      </div>
    </div>
  );
}
