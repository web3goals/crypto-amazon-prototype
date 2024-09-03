import { testSellerAccountConfig } from "@/config/test-seller-account";
import { Product } from "@/lib/products";
import { useEffect, useState } from "react";

export default function useProductFinder(asin: string | undefined) {
  const [data, setData] = useState<Product | undefined>();

  // TODO: Use Amazon API to find a product
  useEffect(() => {
    if (asin) {
      const product = testSellerAccountConfig.products.find(
        (product) => product.asin === asin
      );
      setData(product);
    } else {
      setData(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asin]);

  return { data };
}
