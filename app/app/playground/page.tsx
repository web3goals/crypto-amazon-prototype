"use client";

import { BuyerSubscribeToSellerButton } from "@/components/buyer/buyer-subscribe-to-seller-button";
import { Separator } from "@/components/ui/separator";

export default function PlaygroundPage() {
  return (
    <main className="container py-10 lg:px-80">
      <h2 className="text-2xl font-bold tracking-tight">Playground</h2>
      <Separator className="my-6" />
      <BuyerSubscribeToSellerButton seller="0x4306D7a79265D2cb85Db0c5a55ea5F4f6F73C4B1" />
    </main>
  );
}
