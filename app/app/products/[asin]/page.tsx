"use client";

import { BuyerProductCard } from "@/components/buyer/buyer-product-card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import useListedProductFinder from "@/hooks/useListedProductFinder";
import useProductFinder from "@/hooks/useProductFinder";

export default function ProductPage({ params }: { params: { asin: string } }) {
  const { data: listedProduct, loading: listedProductLoading } =
    useListedProductFinder(params.asin);
  const { data: product } = useProductFinder(listedProduct?.asin);

  return (
    <main className="container py-10 lg:px-80">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Product</h2>
        <p className="text-muted-foreground">That you can buy with crypto</p>
      </div>
      <Separator className="my-6" />
      {listedProductLoading ? (
        <Skeleton className="h-8" />
      ) : listedProduct && product ? (
        <BuyerProductCard product={product} listedProduct={listedProduct} />
      ) : (
        <div className="w-full flex flex-col items-center border rounded px-6 py-8">
          <p className="text-sm text-muted-foreground">Product not found 😐</p>
        </div>
      )}
    </main>
  );
}
