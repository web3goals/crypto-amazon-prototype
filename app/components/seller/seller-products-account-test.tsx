"use client";

import { testSellerAccountConfig } from "@/config/test-seller-account";
import usePrices from "@/hooks/usePrices";
import { Product } from "@/lib/products";
import { useEffect, useState } from "react";
import EntityList from "../entity-list";
import { SellerProductCard } from "./seller-product-card";

export function SellerProductsAccountTest() {
  const [products, setProducts] = useState<Product[] | undefined>();
  const { prices } = usePrices();

  useEffect(() => {
    new Promise((resolve) => setTimeout(resolve, 1000)).then(() =>
      setProducts(testSellerAccountConfig.products)
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
          sellerAmazonToken={testSellerAccountConfig.amazonToken}
        />
      )}
      noEntitiesText="No products 😐"
    />
  );
}
