import { SellerBalances } from "@/components/seller/seller-balances";
import { Separator } from "@/components/ui/separator";

export default function SellerBalancePage() {
  return (
    <main className="container py-10 lg:px-80">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Balance</h2>
        <p className="text-muted-foreground">
          Income you made by selling your products for crypto
        </p>
      </div>
      <Separator className="my-6" />
      <SellerBalances />
    </main>
  );
}
