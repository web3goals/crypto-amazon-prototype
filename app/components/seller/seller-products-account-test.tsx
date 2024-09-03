"use client";

import { testSellerAccountConfig } from "@/config/test-seller-account";
import useListedProductsFinder from "@/hooks/useListedProductsFinder";
import { Product } from "@/types/product";
import { useEffect, useState } from "react";
import EntityList from "../entity-list";
import { SellerProductCard } from "./seller-product-card";

export function SellerProductsAccountTest() {
  const [products, setProducts] = useState<Product[] | undefined>();
  const { data: listedProducts } = useListedProductsFinder();

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
          price={
            listedProducts?.find(
              (listedProduct) => listedProduct.asin === product.asin
            )?.price
          }
          sellerAmazonToken={testSellerAccountConfig.amazonToken}
        />
      )}
      noEntitiesText="No products 😐"
    />
  );
}
