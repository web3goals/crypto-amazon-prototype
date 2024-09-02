import { SellerBroadcastSendForm } from "@/components/seller/seller-broadcast-send-form";
import { Separator } from "@/components/ui/separator";

export default function BroadcastPage() {
  return (
    <main className="container py-10 lg:px-80">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Broadcast</h2>
        <p className="text-muted-foreground">
          Tell subscribers about your promotions
        </p>
      </div>
      <Separator className="my-6" />
      <SellerBroadcastSendForm />
    </main>
  );
}
