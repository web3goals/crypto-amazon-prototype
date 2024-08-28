"use client";

import { getTestAmazonAccountProducts, Product } from "@/lib/products";
import { useEffect, useState } from "react";
import EntityList from "./entity-list";
import { ProductCard } from "./product-card";

export function SellerProductsTestAmazonAccount() {
  const [products, setProducts] = useState<Product[] | undefined>();

  useEffect(() => {
    new Promise((resolve) => setTimeout(resolve, 1000)).then(() =>
      setProducts(getTestAmazonAccountProducts())
    );
  }, []);

  return (
    <EntityList
      entities={products}
      renderEntityCard={(product, index) => (
        <ProductCard key={index} product={product} />
      )}
      noEntitiesText="No products 😐"
    />
  );
}
