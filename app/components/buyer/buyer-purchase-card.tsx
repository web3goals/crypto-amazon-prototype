"use client";

import { storefrontAbi } from "@/abi/storefront";
import useProductFinder from "@/hooks/useProductFinder";
import { getStorefrontChainConfig } from "@/lib/chains";
import { CheckoutDeal } from "@/types/checkout-deal";
import { MessagesSquareIcon } from "lucide-react";
import Link from "next/link";
import { useReadContract } from "wagmi";
import { ProductCardHeader } from "../product/product-card-header";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import { BuyerSubscribeToSellerButton } from "./buyer-subscribe-to-seller-button";

export function BuyerPurchaseCard(props: {
  deal: CheckoutDeal;
  price: bigint | undefined;
}) {
  const { product } = useProductFinder(props.deal.asin);

  const { data: verifiedSeller } = useReadContract({
    address: getStorefrontChainConfig().storefront,
    abi: storefrontAbi,
    functionName: "getVerifiedSeller",
    args: [props.deal.asin],
    chainId: getStorefrontChainConfig().chain.id,
  });

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
