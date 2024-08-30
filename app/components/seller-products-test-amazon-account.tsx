"use client";

import usePrices from "@/hooks/usePrices";
import { getTestAmazonAccountProducts, Product } from "@/lib/products";
import { useEffect, useState } from "react";
import EntityList from "./entity-list";
import { SellerProductCard } from "./seller-product-card";

export function SellerProductsTestAmazonAccount() {
  const sellerAmazonToken = "TEST_TOKEN";
  const [products, setProducts] = useState<Product[] | undefined>();
  const { prices } = usePrices();

  useEffect(() => {
    new Promise((resolve) => setTimeout(resolve, 1000)).then(() =>
      setProducts(getTestAmazonAccountProducts())
    );
  }, []);

  return (
    <EntityList
      entities={products}
      renderEntityCard={(product, index) => (
        <SellerProductCard
          key={index}
          product={product}
          price={prices?.get(product.asin)}
          sellerAmazonToken={sellerAmazonToken}
        />
      )}
      noEntitiesText="No products 😐"
    />
  );
}
