"use client";

import { BuyerProductCard } from "@/components/buyer/buyer-product-card";
import EntityList from "@/components/entity-list";
import { Separator } from "@/components/ui/separator";
import useListedProductFinder from "@/hooks/useListedProductsFinder";
import usePrices from "@/hooks/usePrices";
import useProductFinder from "@/hooks/useProductFinder";

export default function ProductPage({ params }: { params: { asin: string } }) {
  const { listedProduct } = useListedProductFinder(params.asin);
  const { product } = useProductFinder(listedProduct?.asin);
  const { prices } = usePrices();

  return (
    <main className="container py-10 lg:px-80">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Product</h2>
        <p className="text-muted-foreground">That you can buy with crypto</p>
      </div>
      <Separator className="my-6" />
      <EntityList
        entities={product ? [product] : []}
        renderEntityCard={(product, index) => (
          <BuyerProductCard
            key={index}
            product={product}
            price={prices?.get(product.asin)}
          />
        )}
        noEntitiesText={`Product not found 😐`}
      />
    </main>
  );
}
