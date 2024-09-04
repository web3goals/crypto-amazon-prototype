import useProductFinder from "@/hooks/useProductFinder";
import { ListedProduct } from "@/types/listed-product";
import { BuyerProductCard } from "./buyer-product-card";

export function BuyerProductListedCard(props: {
  listedProduct: ListedProduct;
}) {
  const { data: product } = useProductFinder(props.listedProduct.asin);

  if (!product) {
    return <></>;
  }

  return (
    <BuyerProductCard product={product} listedProduct={props.listedProduct} />
  );
}
