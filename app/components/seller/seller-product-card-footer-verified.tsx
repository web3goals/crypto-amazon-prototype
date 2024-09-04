"use client";

import { Product } from "@/types/product";
import { CircleDollarSignIcon, WandSparklesIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { SellerProductCardFooterSelling } from "./seller-product-card-footer-selling";
import { SellerProductCardFooterSummarizing } from "./seller-product-card-footer-summarizing";

export function SellerProductCardFooterVerified(props: {
  product: Product;
  summary: string | undefined;
}) {
  const [sellingChosen, setSellingChosen] = useState(false);
  const [summarizingChosen, setSummarizingChosen] = useState(false);

  if (sellingChosen) {
    return <SellerProductCardFooterSelling product={props.product} />;
  }

  if (summarizingChosen) {
    return <SellerProductCardFooterSummarizing product={props.product} />;
  }

  return (
    <div className="flex flex-rol gap-2">
      <Button variant="default" onClick={() => setSellingChosen(true)}>
        <CircleDollarSignIcon className="mr-2 h-4 w-4" /> Sell
      </Button>
      {props.summary === "" && (
        <Button variant="secondary" onClick={() => setSummarizingChosen(true)}>
          <WandSparklesIcon className="mr-2 h-4 w-4" /> Generate Summary
        </Button>
      )}
    </div>
  );
}
