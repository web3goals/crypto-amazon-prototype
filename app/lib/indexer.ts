import { ListedProduct } from "@/types/listed-product";
import axios from "axios";

export async function getListedProductByIndexer(
  indexerUrl: string,
  asin: string
): Promise<ListedProduct | undefined> {
  const { data } = await axios.post(
    indexerUrl,
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
  );
  const listedProducts = data.data.Storefront_ProductListed;
  return listedProducts?.[0];
}
