import { ListedProduct } from "@/types/listed-product";
import axios from "axios";

function indexerDataToListedProducts(data: any): ListedProduct[] {
  const listedProducts: Map<string, ListedProduct> = new Map();
  const dataListedProducts: any[] = data.data.Storefront_ProductListed;
  for (const dataListedProduct of dataListedProducts) {
    listedProducts.set(dataListedProduct.asin, {
      asin: dataListedProduct.asin,
      seller: dataListedProduct.seller,
      price: BigInt(dataListedProduct.price),
    });
  }
  return Array.from(listedProducts.values());
}

export async function getListedProductsByIndexer(
  indexerUrl: string
): Promise<ListedProduct[] | undefined> {
  const { data } = await axios.post(indexerUrl, {
    query: `
        query MyQuery {
            Storefront_ProductListed {
                id
                asin
                price
                seller
            }
        }
        `,
  });
  return indexerDataToListedProducts(data);
}

export async function getListedProductByIndexer(
  indexerUrl: string,
  asin: string
): Promise<ListedProduct | undefined> {
  const { data } = await axios.post(indexerUrl, {
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
  });
  return indexerDataToListedProducts(data)[0];
}
