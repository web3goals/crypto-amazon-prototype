import { errorToString } from "@/lib/converters";
import { findProduct, Product } from "@/lib/products";
import { useEffect, useState } from "react";

export default function useProductFinder(asin?: string) {
  const [product, setProduct] = useState<Product | undefined>();

  useEffect(() => {
    if (asin) {
      findProduct(asin)
        .then((product) => {
          setProduct(product);
        })
        .catch((error) => {
          console.error(
            `Failed to find product by '${asin}':` + errorToString(error)
          );
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asin]);

  return { product };
}
