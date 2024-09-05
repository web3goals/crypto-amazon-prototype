import {
  AccountId,
  Client,
  PrivateKey,
  TokenCreateTransaction,
  TokenType,
} from "@hashgraph/sdk";
import dotenv from "dotenv";

async function main() {
  // Ensure required environment variables are available
  dotenv.config();
  if (!process.env.ACCOUNT_ID || !process.env.ACCOUNT_PRIVATE_KEY) {
    throw new Error("Please set required keys in .env file.");
  }

  // Configure client using environment variables
  const accountId = AccountId.fromString(process.env.ACCOUNT_ID);
  const accountKey = PrivateKey.fromStringECDSA(
    process.env.ACCOUNT_PRIVATE_KEY
  );
  const client = Client.forTestnet().setOperator(accountId, accountKey);

  // Create the token
  let tokenCreateTx = await new TokenCreateTransaction()
    .setTokenType(TokenType.FungibleCommon)
    .setTokenName("USD Token")
    .setTokenSymbol("USDT")
    .setDecimals(3)
    .setInitialSupply(1_000_000_000)
    .setTreasuryAccountId(accountId)
    .setAdminKey(accountKey)
    .setFreezeDefault(false)
    .freezeWith(client);
  const tokenCreateTxSigned = await tokenCreateTx.sign(accountKey);
  const tokenCreateTxSubmitted = await tokenCreateTxSigned.execute(client);
  const tokenCreateTxReceipt = await tokenCreateTxSubmitted.getReceipt(client);
  const tokenId = tokenCreateTxReceipt.tokenId;
  const tokenExplorerUrl = `https://hashscan.io/testnet/token/${tokenId}`;

  // Query token balance of acount (mirror node)
  // Need to wait 3 seconds for the record files to be ingested by the mirror nodes
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const accountBalanceFetchApiUrl = `https://testnet.mirrornode.hedera.com/api/v1/accounts/${accountId}/tokens?token.id=${tokenId}&limit=1&order=desc`;
  const accountBalanceFetch = await fetch(accountBalanceFetchApiUrl);
  const accountBalanceJson = await accountBalanceFetch.json();
  const accountBalanceToken = accountBalanceJson?.tokens[0]?.balance;

  client.close();

  // output results
  console.log(`accountId: ${accountId}`);
  console.log(`tokenId: ${tokenId}`);
  console.log(`tokenExplorerUrl: ${tokenExplorerUrl}`);
  console.log(`accountTokenBalance: ${accountBalanceToken}`);
  console.log(`accountBalanceFetchApiUrl: ${accountBalanceFetchApiUrl}`);

  return {
    accountId,
    tokenId,
    tokenExplorerUrl,
    accountBalanceToken,
    accountBalanceFetchApiUrl,
  };
}

main();

export default main;
