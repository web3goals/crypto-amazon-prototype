import { SellerSales } from "@/components/seller/seller-sales";
import { Separator } from "@/components/ui/separator";

export default function SellerSalesPage() {
  return (
    <main className="container py-10 lg:px-80">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Sales</h2>
        <p className="text-muted-foreground">
          Amazon products you sold for crypto
        </p>
      </div>
      <Separator className="my-6" />
      <SellerSales />
    </main>
  );
}
