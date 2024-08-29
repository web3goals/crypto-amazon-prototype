"use client";

import { UserCogIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import { SellerProductsTestAmazonAccount } from "./seller-products-test-amazon-account";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

export function SellerProducts() {
  const { toast } = useToast();
  const [state, setState] = useState<
    "CHOICE" | "TEST_ACCOUNT" | "REAL_ACCOUNT"
  >("CHOICE");

  if (state === "CHOICE") {
    return (
      <div className="flex flex-col items-start gap-4">
        <Button variant="default" onClick={() => setState("TEST_ACCOUNT")}>
          <UserCogIcon className="mr-2 h-4 w-4" /> Connect Test Amazon Account
        </Button>
        {/* TODO: Implement */}
        <Button
          variant="secondary"
          onClick={() => toast({ title: "Not implemented yet 😬" })}
        >
          <UserIcon className="mr-2 h-4 w-4" />
          Connect Real Amazon Account
        </Button>
      </div>
    );
  }

  if (state === "TEST_ACCOUNT") {
    return <SellerProductsTestAmazonAccount />;
  }

  return <></>;
}
