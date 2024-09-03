import { Product } from "@/types/product";

export type TestSellerAccountConfig = typeof testSellerAccountConfig;

export const testSellerAccountConfig = {
  amazonToken: "TEST_TOKEN",
  products: [
    {
      asin: "B07L83HND8",
      image: "https://c.media-amazon.com/images/I/51wmGOk1EjL._AC_SL1000_.jpg",
      title:
        "SafePal S1, Cryptocurrency Hardware Wallet, Cold Storage for Bitcoin, Ethereum and More Tokens, Securely Stores Private Keys, Seeds & Crypto Assets",
      seller: "A3JVUYUGKS46N6",
      sellerTitle: "SafePal Official",
    },
    {
      asin: "B08R8838ZH",
      image: "https://c.media-amazon.com/images/I/61qn7QK8XML._AC_SL1000_.jpg",
      title:
        "SafePal Cypher - Steel Crypto Seed Backup, Metal Cold Storage, Steel Bitcoin Wallet, Store up to 24 Seed Words, Compatible with BIP39 Crypto Wallets, Ledger, Trezor, KeepKey",
      seller: "A3JVUYUGKS46N6",
      sellerTitle: "SafePal Official",
    },
  ] as Product[],
};
