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
    galadriel:
      | {
          oracle: `0x${string}`;
          prompt: string;
        }
      | undefined;
    storefront: `0x${string}` | undefined;
    usdt: `0x${string}` | undefined;
    checkout: `0x${string}` | undefined;
    chatGpt: `0x${string}` | undefined;
    summarizer: `0x${string}` | undefined;
    fanToken: `0x${string}` | undefined;
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
    galadriel: undefined,
    storefront: "0xf2F5F769509065DFdfe9f31E440F3f94e9F7c21b",
    usdt: "0x55FC13643e03284242941F043967583aB79b288F",
    fanToken: "0x0000000000000000000000000000000000000000",
    checkout: "0xE008d8d7C4a0368c68a37DE2e9E0D5C323EA9978",
    chatGpt: "0x0000000000000000000000000000000000000000",
    summarizer: "0x0000000000000000000000000000000000000000",
  },
  galadrielDevnet: {
    chainlinkFunctions: undefined,
    chainlinkDataFeed: undefined,
    signProtocol: undefined,
    galadriel: {
      oracle: "0x68EC9556830AD097D661Df2557FBCeC166a0A075",
      prompt:
        "You are an amazon seller assistant. You need to read the following amazon product reviews written by customers and summarize them into one post that will be posted on the product page for everyone to see. Maximum 240 characters. Reviews: ",
    },
    storefront: "0x0000000000000000000000000000000000000000",
    usdt: "0x0000000000000000000000000000000000000000",
    fanToken: "0x0000000000000000000000000000000000000000",
    checkout: "0x0000000000000000000000000000000000000000",
    chatGpt: "0x12884Fb3EAEB3C0A2C6EC390954304bc37192611",
    summarizer: "0x07b7e2AE0A9B1f74610e2465d8043e7E7a5632A6",
  },
  rootstockTestnet: {
    chainlinkFunctions: undefined,
    chainlinkDataFeed: {
      address: "0x0000000000000000000000000000000000000000",
      customAnswer: "100000000",
    },
    signProtocol: undefined,
    galadriel: undefined,
    storefront: "0x0000000000000000000000000000000000000000",
    usdt: "0xF1843bab521395b7aE283E93A98423Dc2956bd84",
    fanToken: "0x0000000000000000000000000000000000000000",
    checkout: "0xe9F2eaF94D0F94329381037b98F6795410B8E8F8",
    chatGpt: "0x0000000000000000000000000000000000000000",
    summarizer: "0x0000000000000000000000000000000000000000",
  },
  morphHoleskyTestnet: {
    chainlinkFunctions: undefined,
    chainlinkDataFeed: {
      address: "0x0000000000000000000000000000000000000000",
      customAnswer: "100000000",
    },
    signProtocol: undefined,
    galadriel: undefined,
    storefront: "0x0000000000000000000000000000000000000000",
    usdt: "0xF1843bab521395b7aE283E93A98423Dc2956bd84",
    fanToken: "0x0000000000000000000000000000000000000000",
    checkout: "0xe9F2eaF94D0F94329381037b98F6795410B8E8F8",
    chatGpt: "0x0000000000000000000000000000000000000000",
    summarizer: "0x0000000000000000000000000000000000000000",
  },
  chilizSpicyTestnet: {
    chainlinkFunctions: undefined,
    chainlinkDataFeed: {
      address: "0x0000000000000000000000000000000000000000",
      customAnswer: "100000000",
    },
    signProtocol: undefined,
    galadriel: undefined,
    storefront: "0x0000000000000000000000000000000000000000",
    usdt: "0x0000000000000000000000000000000000000000",
    fanToken: "0xF1843bab521395b7aE283E93A98423Dc2956bd84",
    checkout: "0x12884Fb3EAEB3C0A2C6EC390954304bc37192611",
    chatGpt: "0x0000000000000000000000000000000000000000",
    summarizer: "0x0000000000000000000000000000000000000000",
  },
};
