import { Product } from "@/types/product";

export type TestSellerAccountConfig = typeof testSellerAccountConfig;

export const testSellerAccountConfig = {
  amazonToken: "TEST_TOKEN",
  products: [
    {
      asin: "B0CSS772MB",
      image: "https://c.media-amazon.com/images/I/518R2CA7HAL._AC_SL1000_.jpg",
      title:
        "SecuX Shield Bio Crypto Hardware Wallet - Secure Biometric Authentication, Cold Storage Card for NFT, Bitcoin, Ethereum, Cardano, ERC20, BEP20, and More",
      seller: "A3JVUYUGKS46N6",
      sellerTitle: "SafePal Official",
      reviews: `1. This is such a great cold wallet. It was easy to set up and use. I really like that I can carry it in my wallet and it has multiple authentication methods to protect your investments. It can seem intimidating, but the instructions and app help to make the setup very easy. 2. Super easy crypto card. Easy for beginners to get started. Way more secure feeling then leaving crypto online. 3. This wallet is built like a vault, keeping crypto assets secure. Its biometric authentication adds an advanced layer of security in a compact and sleek design. Using it is intuitive, making it accessible even for those new to crypto.`,
    },
    {
      asin: "B07L83HND8",
      image: "https://c.media-amazon.com/images/I/51wmGOk1EjL._AC_SL1000_.jpg",
      title:
        "SafePal S1, Cryptocurrency Hardware Wallet, Cold Storage for Bitcoin, Ethereum and More Tokens, Securely Stores Private Keys, Seeds & Crypto Assets",
      seller: "A3JVUYUGKS46N6",
      sellerTitle: "SafePal Official",
      reviews: `1. Setup was a breeze. little Con is that the Screen is Fingerprint Magnet and I am considering putting carbon fiber sticker skin for this. Highly recommended for first wallet! 2. Good product. USB-C charger. Easy to set up and use. Works great. 3. So before I start, I want to point out I've purchased and tested 5 different hardware wallets so far: SafePal S1, Ledger Nano S, KeepKey, Ellipal Titan and Trezor Model T. SafePal S1 wins against all of these by far, for my specific purpose - emphasizing that latter part. If you're new to crypto a very important thing to understand is that it's very hard for a crypto hardware vendor to support all coins, or even a great number of coins. Each coin (not "token") uses different algorithms to generate private keys so with all the different coins out there it becomes a task to get these baked into the hardware, slowly but surely they're building the integration but the key point here is every single hardware wallet out there is right now limited.`,
    },
    {
      asin: "B08R8838ZH",
      image: "https://c.media-amazon.com/images/I/61qn7QK8XML._AC_SL1000_.jpg",
      title:
        "SafePal Cypher - Steel Crypto Seed Backup, Metal Cold Storage, Steel Bitcoin Wallet, Store up to 24 Seed Words, Compatible with BIP39 Crypto Wallets, Ledger, Trezor, KeepKey",
      seller: "A3JVUYUGKS46N6",
      sellerTitle: "SafePal Official",
      reviews: `1. Plenty of letters for your 24 words. Heavy and built to withstand a worse case scenario. A touch tedious to setup, but knowing you have your seed phrase fire/water/corrosive proofed is worth the 30-45min. Would recommend for any crypto wallet/cold storage user. 2. This BIP 0039 Recovery Phrase Cypher is exactly what I expected and half the cost of the Billfodl. This DOES HAVE etched letters and is everything I would want or need to secure my recovery phrase. 3. Steel Pal is a simpler design with a hole that you can put a lock or key ring through to prevent it from opening.`,
    },
  ] as Product[],
};
