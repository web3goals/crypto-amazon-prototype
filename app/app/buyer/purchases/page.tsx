import { BuyerPurchases } from "@/components/buyer/buyer-purchases";
import { Separator } from "@/components/ui/separator";

export default function BuyerPurchasesPage() {
  return (
    <main className="container py-10 lg:px-80">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Purchases</h2>
        <p className="text-muted-foreground">
          Amazon product you bought for crypto
        </p>
      </div>
      <Separator className="my-6" />
      <BuyerPurchases />
    </main>
  );
}
