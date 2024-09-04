"use client";

import { BuyerProductListedCard } from "@/components/buyer/buyer-product-listed-card";
import EntityList from "@/components/entity-list";
import { Separator } from "@/components/ui/separator";
import useListedProductsFinder from "@/hooks/useListedProductsFinder";

export default function ProductsPage() {
  const { data: listedProducts } = useListedProductsFinder();

  return (
    <main className="container py-10 lg:px-80">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Products</h2>
        <p className="text-muted-foreground">
          Amazon products that can be bought for crypto
        </p>
      </div>
      <Separator className="my-6" />
      <EntityList
        entities={listedProducts}
        renderEntityCard={(listedProduct, index) => (
          <BuyerProductListedCard key={index} listedProduct={listedProduct} />
        )}
        noEntitiesText="No products 😐"
      />
    </main>
  );
}
