/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import { Storefront, Storefront_ProductListed } from "../generated";

Storefront.ProductListed.handler(async ({ event, context }) => {
  const entity: Storefront_ProductListed = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    asin: event.params.asin,
    seller: event.params.seller,
    price: event.params.price,
  };

  context.Storefront_ProductListed.set(entity);
});
