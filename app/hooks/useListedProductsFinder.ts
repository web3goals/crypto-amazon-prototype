import { getStorefrontChainConfig } from "@/lib/chains";
import { getListedProductsByIndexer } from "@/lib/indexer";
import { getListedProductsBySignProtocol } from "@/lib/sign-protocol";
import { ListedProduct } from "@/types/listed-product";
import { useEffect, useState } from "react";
import useError from "./useError";

export default function useListedProductsFinder() {
  const { handleError } = useError();
  const [data, setData] = useState<ListedProduct[] | undefined>();

  useEffect(() => {
    // Load listed product by indexer
    if (getStorefrontChainConfig().indexerUrl) {
      getListedProductsByIndexer(getStorefrontChainConfig().indexerUrl)
        .then((listedProducts) => {
          setData(listedProducts);
        })
        .catch((error) => handleError(error, true));
    }
    // Load listed product by sign protocol
    else if (
      getStorefrontChainConfig().signProtocolApi &&
      getStorefrontChainConfig().signProtocolSchemaId
    ) {
      getListedProductsBySignProtocol(
        getStorefrontChainConfig().signProtocolApi,
        getStorefrontChainConfig().signProtocolSchemaId
      )
        .then((listedProducts) => {
          setData(listedProducts);
        })
        .catch((error) => handleError(error, true));
    } else {
      setData(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data };
}
