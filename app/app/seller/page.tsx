import { SellerProducts } from "@/components/seller-products";
import { Separator } from "@/components/ui/separator";

export default function SellerPage() {
  return (
    <div className="container py-10 lg:px-80">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Seller</h2>
        <p className="text-muted-foreground">
          Amazon products that you can sell for crypto
        </p>
      </div>
      <Separator className="my-6" />
      <SellerProducts />
    </div>
  );
}
