import { getStorefrontChainConfig } from "@/lib/chains";
import { getListedProductByIndexer } from "@/lib/indexer";
import { getListedProductBySignProtocol } from "@/lib/sign-protocol";
import { ListedProduct } from "@/types/listed-product";
import { useEffect, useState } from "react";
import useError from "./useError";

export default function useListedProductFinder(asin: string | undefined) {
  const { handleError } = useError();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ListedProduct | undefined>();

  useEffect(() => {
    setLoading(true);
    // Load listed product by indexer
    if (asin && getStorefrontChainConfig().indexerUrl) {
      getListedProductByIndexer(getStorefrontChainConfig().indexerUrl, asin)
        .then((listedProduct) => {
          setData(listedProduct);
          setLoading(false);
        })
        .catch((error) => handleError(error, true));
    }
    // Load listed product by sign protocol
    else if (
      asin &&
      getStorefrontChainConfig().signProtocolApi &&
      getStorefrontChainConfig().signProtocolSchemaId
    ) {
      getListedProductBySignProtocol(
        getStorefrontChainConfig().signProtocolApi,
        getStorefrontChainConfig().signProtocolSchemaId,
        asin
      )
        .then((listedProduct) => {
          setData(listedProduct);
          setLoading(false);
        })
        .catch((error) => handleError(error, true));
    } else {
      setData(undefined);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asin]);

  return { data, loading };
}
