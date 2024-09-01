import { Product } from "@/lib/products";
import { CircleDollarSignIcon, WandSparklesIcon } from "lucide-react";
import { useState } from "react";
import { SellerProductCardFooterSelling } from "./seller-product-card-footer-selling";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";

export function SellerProductCardFooterVerified(props: { product: Product }) {
  const [state, setState] = useState<"SELLING" | "SUMMARIZING" | undefined>();

  if (state === "SELLING") {
    return <SellerProductCardFooterSelling product={props.product} />;
  }

  return (
    <div className="flex flex-rol gap-2">
      <Button variant="default" onClick={() => setState("SELLING")}>
        <CircleDollarSignIcon className="mr-2 h-4 w-4" /> Sell
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast({ title: "Not implemented yet 😬" })}
      >
        <WandSparklesIcon className="mr-2 h-4 w-4" /> Generate Summary
      </Button>
    </div>
  );
}
