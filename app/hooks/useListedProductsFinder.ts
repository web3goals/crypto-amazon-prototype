import { getStorefrontChainConfig } from "@/lib/chains";
import { errorToString } from "@/lib/converters";
import { ListedProduct } from "@/types/listed-product";
import axios from "axios";
import { useEffect, useState } from "react";

// TODO: Use sign protocol api to get listed products if indexer not defined
export default function useListedProductsFinder(asin?: string) {
  const [listedProducts, setListedProducts] = useState<
    ListedProduct[] | undefined
  >();

  useEffect(() => {
    if (asin) {
      axios
        .post(
          getStorefrontChainConfig().indexer,
          {
            query: `
              query MyQuery {
                Storefront_ProductListed(where: {asin: {_eq: "${asin}"}}) {
                  id
                  asin
                  price
                  seller
                }
              }
            `,
          },
          { headers: { "x-hasura-admin-secret": "testing" } }
        )
        .then(({ data }) => {
          setListedProducts(data.data.Storefront_ProductListed);
        })
        .catch((error) => {
          console.error(
            `Failed to find listed product by '${asin}':` + errorToString(error)
          );
        });
    } else {
      setListedProducts([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asin]);

  return { listedProducts };
}
