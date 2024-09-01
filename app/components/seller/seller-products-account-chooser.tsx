"use client";

import { UserCogIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import { SellerProductsAccountTest } from "./seller-products-account-test";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";

export function SellerProductsAccountChooser() {
  const { toast } = useToast();
  const [testAccountChosen, setTestAccountChosen] = useState(false);

  if (testAccountChosen) {
    return <SellerProductsAccountTest />;
  }

  return (
    <div className="flex flex-col items-start gap-4">
      <Button variant="default" onClick={() => setTestAccountChosen(true)}>
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
