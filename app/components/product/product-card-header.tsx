"use client";

import { getStorefrontChainConfig } from "@/lib/chains";
import { addressToShortAddress } from "@/lib/converters";
import { Product } from "@/types/product";
import { CheckoutDeal } from "@/types/checkout-deal";
import { ShieldCheckIcon } from "lucide-react";
import { Address, formatEther, isAddressEqual, zeroAddress } from "viem";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ListedProduct } from "@/types/listed-product";

export function ProductCardHeader(props: {
  product: Product;
  listedProduct: ListedProduct | undefined;
  verifiedSeller: Address | undefined;
  deal?: CheckoutDeal;
}) {
  return (
    <div className="flex flex-col items-start">
      <Avatar className="size-48 rounded-sm">
        <AvatarImage src={props.product.image} alt="Product" />
        <AvatarFallback className="text-6xl rounded-sm">🖼️</AvatarFallback>
      </Avatar>
      <p className="text font-bold mt-4">{props.product.title}</p>
      {props.verifiedSeller &&
        !isAddressEqual(props.verifiedSeller, zeroAddress) && (
          <div className="flex flex-row items-center gap-1 bg-primary px-3 py-1.5 rounded-xl mt-2">
            <ShieldCheckIcon className="text-primary-foreground h-4 w-4" />
            <p className="text-xs font-semibold text-primary-foreground">
              Seller & Product Verified
            </p>
          </div>
        )}
      <div className="flex flex-col md:flex-row md:gap-3 mt-4">
        <p className="min-w-[90px] text-sm text-muted-foreground">Seller:</p>
        <a
          href={`https://www.amazon.com/sp?&seller=${props.product.seller}`}
          target="_blank"
          className="text-sm break-all underline underline-offset-4"
        >
          <p className="text-sm break-all">{props.product.sellerTitle}</p>
        </a>
        {props.verifiedSeller && (
          <a
            href={
              getStorefrontChainConfig().chain.blockExplorers?.default.url +
              "/address/" +
              props.verifiedSeller
            }
            target="_blank"
            className="text-sm text-muted-foreground break-all underline underline-offset-4"
          >
            {addressToShortAddress(props.verifiedSeller)}
          </a>
        )}
      </div>
      <div className="flex flex-col md:flex-row md:gap-3 mt-2">
        <p className="min-w-[90px] text-sm text-muted-foreground">ASIN:</p>
        <a
          href={`https://www.amazon.com/dp/${props.product.asin}`}
          target="_blank"
          className="text-sm break-all underline underline-offset-4"
        >
          <p className="text-sm break-all">{props.product.asin}</p>
        </a>
      </div>
      <div className="flex flex-col md:flex-row md:gap-3 mt-2">
        <p className="min-w-[90px] text-sm text-muted-foreground">Price:</p>
        <p className="text-sm break-all">
          {props.listedProduct?.price
            ? `${formatEther(props.listedProduct.price)} USD`
            : "Unsaleable"}
        </p>
      </div>
      {props.deal && (
        <>
          <div className="flex flex-col md:flex-row md:gap-3 mt-2">
            <p className="min-w-[90px] text-sm text-muted-foreground">Buyer:</p>
            <a
              href={
                props.deal.chainConfig.chain.blockExplorers?.default.url +
                "/address/" +
                props.deal.buyer
              }
              target="_blank"
              className="text-sm break-all underline underline-offset-4"
            >
              {addressToShortAddress(props.deal.buyer)}
            </a>
          </div>
          <div className="flex flex-col md:flex-row md:gap-3 mt-2">
            <p className="min-w-[90px] text-sm text-muted-foreground">
              Payment:
            </p>
            <p className="text-sm break-all">
              {formatEther(props.deal.paymentAmount)}{" "}
              {props.deal.paymentTokenSymbol} (
              {props.deal.chainConfig.chain.name})
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:gap-3 mt-2">
            <p className="min-w-[90px] text-sm text-muted-foreground">
              Payment Date:
            </p>
            <p className="text-sm break-all">
              {new Date(Number(props.deal.date) * 1000).toLocaleString()}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
