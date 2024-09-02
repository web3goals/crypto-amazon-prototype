import { zeroAddress, type Address } from "viem";
import { useWalletClient } from "wagmi";

/**
 * Hook for XMTP.
 */
const useEthersWalletClient = (): {
  data: {
    getAddress: () => Promise<Address>;
    signMessage: (message: string) => Promise<string>;
  };
  isLoading: boolean;
} => {
  const { data: wagmiWalletClient, isLoading } = useWalletClient();

  const ethersWalletClient = {
    getAddress: async (): Promise<Address> => {
      const address = wagmiWalletClient?.account.address ?? zeroAddress;
      return address;
    },
    signMessage: async (message: string): Promise<string> => {
      const signature = await wagmiWalletClient?.signMessage({
        message: (message as any).message,
      });
      return signature ?? "";
    },
  };

  const { signMessage, ...rest } = wagmiWalletClient ?? {};

  const mergedWalletClient = {
    data: {
      ...ethersWalletClient,
      ...{ ...rest },
    },
  };

  return { data: mergedWalletClient.data, isLoading };
};

export default useEthersWalletClient;
