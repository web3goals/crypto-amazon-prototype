"use client";

import { storefrontAbi } from "@/abi/storefront";
import useProductsFinder from "@/hooks/useProductsFinder";
import { getStorefrontChainConfig } from "@/lib/chains";
import { CheckoutDeal } from "@/types/checkout-deal";
import { InfoIcon, MessagesSquareIcon } from "lucide-react";
import Link from "next/link";
import { useReadContract } from "wagmi";
import { ProductCardHeader } from "../product/product-card-header";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import { toast } from "../ui/use-toast";

export function SellerSaleCard(props: {
  deal: CheckoutDeal;
  price: bigint | undefined;
}) {
  const { products } = useProductsFinder(props.deal.asin);

  const { data: verifiedSeller } = useReadContract({
    address: getStorefrontChainConfig().storefront,
    abi: storefrontAbi,
    functionName: "getVerifiedSeller",
    args: [props.deal.asin],
    chainId: getStorefrontChainConfig().chain.id,
  });

  if (!products || products.length == 0) {
    return <Skeleton className="w-4" />;
  }

  return (
    <div className="w-full flex flex-col border rounded px-6 py-8">
      <ProductCardHeader
        product={products[0]}
        price={props.price}
        verifiedSeller={verifiedSeller}
        deal={props.deal}
      />
      <Separator className="my-6" />

      <div className="flex flex-row gap-2">
        <Link
          href={`https://app.converse.xyz/conversation?mainConversationWithPeer=${props.deal.buyer}`}
          target="_blank"
        >
          <Button variant="default">
            <MessagesSquareIcon className="mr-2 h-4 w-4" /> Contact Buyer
          </Button>
        </Link>
        {/* TODO: Implement button */}
        <Button
          variant="secondary"
          onClick={() => toast({ title: "Not implemented yet 😬" })}
        >
          <InfoIcon className="mr-2 h-4 w-4" />
          Open Details
        </Button>
      </div>
    </div>
  );
}
