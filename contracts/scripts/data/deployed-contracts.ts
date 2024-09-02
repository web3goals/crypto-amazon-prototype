export const CHAINLINK_SOURCE = `const asin = args[0]; const sellerAmazonToken = args[1]; const apiResponse = await Functions.makeHttpRequest({url: "https://crypto-amazon.vercel.app/api/verifier?asin=" + asin + "&sellerAmazonToken=" + sellerAmazonToken,}); if (apiResponse.error) { throw Error("Request failed"); } const { data } = apiResponse; if (data.status !== "success") { throw Error("Request failed"); } return Functions.encodeString(data.data);`;

export const CONTRACTS: {
  [key: string]: {
    chainlinkFunctions:
      | {
          router: `0x${string}`;
          donId: `0x${string}`;
          subscriptionId: number;
          source: string;
        }
      | undefined;
    chainlinkDataFeed:
      | {
          address: `0x${string}`;
          customAnswer: string;
        }
      | undefined;
    signProtocol:
      | {
          address: `0x${string}`;
          schemaId: `0x${string}`;
        }
      | undefined;
    storefront: `0x${string}` | undefined;
    usdt: `0x${string}` | undefined;
    checkout: `0x${string}` | undefined;
  };
} = {
  optimismSepolia: {
    chainlinkFunctions: {
      router: "0xC17094E3A1348E5C7544D4fF8A36c28f2C6AAE28",
      donId:
        "0x66756e2d6f7074696d69736d2d7365706f6c69612d3100000000000000000000",
      subscriptionId: 225,
      source: CHAINLINK_SOURCE,
    },
    chainlinkDataFeed: {
      address: "0xF83696ca1b8a266163bE252bE2B94702D4929392",
      customAnswer: "100000000",
    },
    signProtocol: {
      address: "0x4e4af2a21ebf62850fD99Eb6253E1eFBb56098cD",
      schemaId: "0x5",
    },
    storefront: "0xF48ACd216a09CC72f71e2f8E3C5c9aE36a8bbE7c",
    usdt: "0x55FC13643e03284242941F043967583aB79b288F",
    checkout: "0xE008d8d7C4a0368c68a37DE2e9E0D5C323EA9978",
  },
};
