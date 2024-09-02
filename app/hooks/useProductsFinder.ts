import { testSellerAccountConfig } from "@/config/test-seller-account";
import { Product } from "@/lib/products";
import { useEffect, useState } from "react";

export default function useProductsFinder(asin?: string) {
  const [products, setProducts] = useState<Product[] | undefined>();

  // TODO: Use Amazon API to find a product
  useEffect(() => {
    if (asin) {
      const product = testSellerAccountConfig.products.find(
        (product) => product.asin === asin
      );
      setProducts(product ? [product] : []);
    } else {
      setProducts([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asin]);

  return { products };
}
