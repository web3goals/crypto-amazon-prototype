import { getStorefrontChainConfig } from "@/lib/chains";
import { errorToString } from "@/lib/converters";
import axios from "axios";
import { useEffect, useState } from "react";
import { decodeAbiParameters } from "viem";

// TODO: Replace with "useListedProductsFinder"
export default function usePricesLoader() {
  const [prices, setPrices] = useState<Map<string, bigint> | undefined>();

  function dataToPrices(data: any): Map<string, bigint> {
    const prices: Map<string, bigint> = new Map();
    const attestations: any[] = data.data.rows;
    for (const attestation of attestations.toReversed()) {
      const values = decodeAbiParameters(
        attestation.schema.data,
        attestation.data
      );
      prices.set(values[0], values[2]);
    }
    return prices;
  }

  useEffect(() => {
    const url =
      getStorefrontChainConfig().signProtocolApi +
      "/index/attestations?schemaId=" +
      getStorefrontChainConfig().signProtocolSchemaId;
    axios
      .get(url)
      .then(({ data }) => setPrices(dataToPrices(data)))
      .catch((error) =>
        console.error("Failed to get product price:" + errorToString(error))
      );
  }, []);

  return { prices };
}
