import { ListedProduct } from "@/types/listed-product";
import axios from "axios";
import { decodeAbiParameters } from "viem";

function signProtocolDataToListedProducts(data: any): ListedProduct[] {
  const listedProducts: ListedProduct[] = [];
  const attestations: any[] = data.data.rows;
  for (const attestation of attestations.toReversed()) {
    const values = decodeAbiParameters(
      attestation.schema.data,
      attestation.data
    );
    listedProducts.push({
      asin: values[0],
      seller: values[1],
      price: values[2],
    });
  }
  return listedProducts;
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
  console.log({ listedProducts });
  return listedProducts.find((listedProduct) => listedProduct.asin === asin);
}
