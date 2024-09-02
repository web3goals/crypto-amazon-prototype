import { getStorefrontChainConfig } from "@/lib/chains";
import { errorToString } from "@/lib/converters";
import { ListedProduct } from "@/types/listed-product";
import axios from "axios";
import { useEffect, useState } from "react";

export default function useListedProductFinder(asin?: string) {
  const [listedProduct, setListedProduct] = useState<
    ListedProduct | undefined
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
          const listedProducts: ListedProduct[] =
            data.data.Storefront_ProductListed;
          setListedProduct(
            listedProducts.length > 0 ? listedProducts[0] : undefined
          );
        })
        .catch((error) => {
          console.error(
            `Failed to find listed product by '${asin}':` + errorToString(error)
          );
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asin]);

  return { listedProduct };
}
