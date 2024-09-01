import { ChainConfig } from "@/config/chains";
import { Address } from "viem";

export type CheckoutDeal = {
  asin: string;
  seller: Address;
  buyer: Address;
  buyerName: string;
  buyerAddress: string;
  date: bigint;
  paymentAmount: bigint;
  paymentTokenSymbol: string;
  chainConfig: ChainConfig;
};
