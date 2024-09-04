import { ListedProduct } from "@/types/listed-product";
import axios from "axios";
import { decodeAbiParameters } from "viem";

function signProtocolDataToListedProducts(data: any): ListedProduct[] {
  const listedProducts: Map<string, ListedProduct> = new Map();
  const attestations: any[] = data.data.rows;
  for (const attestation of attestations.toReversed()) {
    const values = decodeAbiParameters(
      attestation.schema.data,
      attestation.data
    );
    listedProducts.set(values[0], {
      asin: values[0],
      seller: values[1],
      price: values[2],
    });
  }
  return Array.from(listedProducts.values());
}

export async function getListedProductsBySignProtocol(
  signProtocolApi: string,
  signProtocolSchemaId: string
): Promise<ListedProduct[] | undefined> {
  const { data } = await axios.get(
    signProtocolApi + "/index/attestations?schemaId=" + signProtocolSchemaId
  );
  const listedProducts = signProtocolDataToListedProducts(data);
  return listedProducts.toReversed();
}

export async function getListedProductBySignProtocol(
  signProtocolApi: string,
  signProtocolSchemaId: string,
  asin: string
): Promise<ListedProduct | undefined> {
  const { data } = await axios.get(
    signProtocolApi + "/index/attestations?schemaId=" + signProtocolSchemaId
  );
  const listedProducts = signProtocolDataToListedProducts(data);
  return listedProducts
    .toReversed()
    .find((listedProduct) => listedProduct.asin === asin);
}
