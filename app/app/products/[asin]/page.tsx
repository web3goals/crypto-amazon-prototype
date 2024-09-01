"use client";

import { BuyerProductCard } from "@/components/buyer/buyer-product-card";
import EntityList from "@/components/entity-list";
import { Separator } from "@/components/ui/separator";
import useError from "@/hooks/useError";
import usePrices from "@/hooks/usePrices";
import { findProduct, Product } from "@/lib/products";
import { useEffect, useState } from "react";

export default function ProductPage({ params }: { params: { asin: string } }) {
  const { handleError } = useError();
  const [products, setProducts] = useState<Product[] | undefined>();
  const { prices } = usePrices();

  useEffect(() => {
    findProduct(params.asin)
      .then((product) => {
        product ? setProducts([product]) : setProducts([]);
      })
      .catch((error) => {
        handleError(error, true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.asin]);

  return (
    <main className="container py-10 lg:px-80">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Product</h2>
        <p className="text-muted-foreground">That you can buy with crypto</p>
      </div>
      <Separator className="my-6" />
      <EntityList
        entities={products}
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
