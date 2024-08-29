"use client";

import { getTestAmazonAccountProducts, Product } from "@/lib/products";
import { useEffect, useState } from "react";
import EntityList from "./entity-list";
import { SellerProductCard } from "./seller-product-card";
import { chainConfigs } from "@/config/chains";
import usePrices from "@/hooks/usePrices";

export function SellerProductsTestAmazonAccount() {
  const storefrontChainConfig = chainConfigs.optimismSepolia;
  const sellerAmazonToken = "TEST_TOKEN";
  const [products, setProducts] = useState<Product[] | undefined>();
  const { prices } = usePrices(storefrontChainConfig);

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
          storefrontChainConfig={storefrontChainConfig}
          sellerAmazonToken={sellerAmazonToken}
        />
      )}
      noEntitiesText="No products 😐"
    />
  );
}
