import { Button } from "@/components/ui/button";
import { CompassIcon, ShoppingBasketIcon, StoreIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="container flex flex-col items-center py-10">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-center max-w-[880px]">
        Let 830 million people buy your Amazon products with crypto
      </h1>
      <h2 className="text-2xl font-normal tracking-tight text-center text-muted-foreground max-w-[680px] mt-4">
        Connect your Amazon seller account and start accepting crypto payments
        in a few clicks
      </h2>
      <div className="flex flex-row gap-2 mt-6">
        <Link href="/seller">
          <Button variant="default" size="lg">
            <StoreIcon className="mr-2 h-4 w-4" /> Sell
          </Button>
        </Link>
        <Link href="/products">
          <Button variant="secondary" size="lg">
            <CompassIcon className="mr-2 h-4 w-4" /> Explore
          </Button>
        </Link>
      </div>
      <div className="flex flex-col items-center max-w-[680px] mt-12">
        <Image
          src="/images/transformation.png"
          alt="Transformation"
          priority={false}
          width="100"
          height="100"
          sizes="100vw"
          className="w-full"
        />
      </div>
    </main>
  );
}
