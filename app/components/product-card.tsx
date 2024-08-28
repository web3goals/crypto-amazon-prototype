"use client";

import { Product } from "@/lib/products";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function ProductCard(props: { product: Product }) {
  return (
    <div className="w-full flex flex-col border rounded px-6 py-8">
      <Avatar className="size-48 rounded-sm">
        <AvatarImage src={props.product.image} alt="Product" />
        <AvatarFallback className="text-6xl rounded-sm">🖼️</AvatarFallback>
      </Avatar>
      <p className="text font-bold mt-4">{props.product.title}</p>
      {/* TODO: Add link to Amazon */}
      <div className="flex flex-col md:flex-row md:gap-3 mt-4">
        <p className="min-w-[60px] text-sm text-muted-foreground">Seller:</p>
        <p className="text-sm break-all">{props.product.sellerTitle}</p>
      </div>
      {/* TODO: Add link to Amazon */}
      <div className="flex flex-col md:flex-row md:gap-3 mt-2">
        <p className="min-w-[60px] text-sm text-muted-foreground">ASIN:</p>
        <p className="text-sm break-all">{props.product.asin}</p>
      </div>
    </div>
  );
}
