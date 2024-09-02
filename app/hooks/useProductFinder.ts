import { testSellerAccountConfig } from "@/config/test-seller-account";
import { Product } from "@/lib/products";
import { useEffect, useState } from "react";

export default function useProductFinder(asin?: string) {
  const [product, setProduct] = useState<Product | undefined>();

  // TODO: Use Amazon API to find a product
  useEffect(() => {
    if (asin) {
      const product = testSellerAccountConfig.products.find(
        (product) => product.asin === asin
      );
      setProduct(product);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asin]);

  return { product };
}
