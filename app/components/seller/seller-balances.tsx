"use client";

import { getChainConfigsWithCheckout } from "@/lib/chains";
import EntityList from "../entity-list";
import { SellerBalanceCard } from "./seller-balance-card";

export function SellerBalances() {
  return (
    <EntityList
      entities={getChainConfigsWithCheckout()}
      renderEntityCard={(chainConfig, index) => (
        <SellerBalanceCard key={index} chainConfig={chainConfig} />
      )}
      noEntitiesText={`No balances 😐`}
    />
  );
}
