"use client";

import { storefrontAbi } from "@/abi/storefront";
import useError from "@/hooks/useError";
import { getStorefrontChainConfig } from "@/lib/chains";
import { findProduct, Product } from "@/lib/products";
import { CheckoutDeal } from "@/types/checkout-deal";
import { MessagesSquareIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import { ProductCardHeader } from "../product-card-header";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import { BuyerSubscribeToSellerButton } from "./buyer-subscribe-to-seller-button";

export function BuyerPurchaseCard(props: {
  deal: CheckoutDeal;
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
        deal={props.deal}
      />
      <Separator className="my-6" />
      <div className="flex flex-row gap-2">
        <Link
          href={`https://app.converse.xyz/conversation?mainConversationWithPeer=${props.deal.seller}`}
          target="_blank"
        >
          <Button variant="default">
            <MessagesSquareIcon className="mr-2 h-4 w-4" />
            Contact Seller
          </Button>
        </Link>
        <BuyerSubscribeToSellerButton seller={props.deal.seller} />
      </div>
    </div>
  );
}
