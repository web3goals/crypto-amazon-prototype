"use client";

import { Product } from "@/types/product";
import { useState } from "react";
import { ProductCardHeader } from "../product/product-card-header";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { ShoppingCartIcon } from "lucide-react";
import { BuyerProductCardFooterBuying } from "./buyer-product-card-footer-bying";
import { storefrontAbi } from "@/abi/storefront";
import { getStorefrontChainConfig } from "@/lib/chains";
import { useReadContract } from "wagmi";
import { Address } from "viem";
import { ListedProduct } from "@/types/listed-product";

export function BuyerProductCard(props: {
  product: Product;
  listedProduct: ListedProduct | undefined;
}) {
  const { data: verifiedSeller } = useReadContract({
    address: getStorefrontChainConfig().storefront,
    abi: storefrontAbi,
    functionName: "getVerifiedSeller",
    args: [props.product.asin],
    chainId: getStorefrontChainConfig().chain.id,
  });

  return (
    <div className="w-full flex flex-col border rounded px-6 py-8">
      <ProductCardHeader
        product={props.product}
        listedProduct={props.listedProduct}
        verifiedSeller={verifiedSeller}
      />
      {props.listedProduct && (
        <>
          <Separator className="my-6" />
          <BuyerProductCardFooterSaleable
            product={props.product}
            listedProduct={props.listedProduct}
            verifiedSeller={verifiedSeller}
          />
        </>
      )}
    </div>
  );
}

function BuyerProductCardFooterSaleable(props: {
  product: Product;
  listedProduct: ListedProduct | undefined;
  verifiedSeller: Address | undefined;
}) {
  const [clicked, setClicked] = useState(false);

  if (clicked) {
    return (
      <BuyerProductCardFooterBuying
        product={props.product}
        listedProduct={props.listedProduct}
        verifiedSeller={props.verifiedSeller}
      />
    );
  } else {
    return (
      <div>
        <Button onClick={() => setClicked(true)}>
          <ShoppingCartIcon className="mr-2 h-4 w-4" /> Buy
        </Button>
      </div>
    );
  }
}
