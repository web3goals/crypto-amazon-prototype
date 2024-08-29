"use client";

import { getTestAmazonAccountProducts, Product } from "@/lib/products";
import { useEffect, useState } from "react";
import EntityList from "./entity-list";
import { SellerProductCard } from "./seller-product-card";

export function SellerProductsTestAmazonAccount() {
  const [products, setProducts] = useState<Product[] | undefined>();
  const sellerAmazonToken = "TEST_TOKEN";

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
          sellerAmazonToken={sellerAmazonToken}
        />
      )}
      noEntitiesText="No products 😐"
    />
  );
}
