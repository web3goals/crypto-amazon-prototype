import { checkoutAbi } from "@/abi/checkout";
import { ChainConfig } from "@/config/chains";
import useError from "@/hooks/useError";
import { Loader2, NetworkIcon, PiggyBankIcon } from "lucide-react";
import { useState } from "react";
import { formatUnits, zeroAddress } from "viem";
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWalletClient,
} from "wagmi";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { toast } from "../ui/use-toast";

export function SellerBalanceCard(props: { chainConfig: ChainConfig }) {
  const { handleError } = useError();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: props.chainConfig.checkout,
    abi: checkoutAbi,
    functionName: "getBalance",
    args: [address || zeroAddress],
    chainId: props.chainConfig.chain.id,
  });

  async function onWithdraw() {
    try {
      setIsWithdrawing(true);
      // Check public client
      if (!publicClient) {
        throw new Error("Public client is not ready");
      }
      // Check wallet
      if (!address || !walletClient) {
        throw new Error("Wallet is not connected");
      }
      // Send tx
      const txHash = await walletClient.writeContract({
        address: props.chainConfig.checkout,
        abi: checkoutAbi,
        functionName: "withdrawBalance",
        args: [],
        chain: props.chainConfig.chain,
      });
      await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });
      refetchBalance();
      toast({
        title: "Withdrawal successful 🤘",
      });
    } catch (error) {
      handleError(error, true);
    } finally {
      setIsWithdrawing(false);
    }
  }

  return (
    <div className="w-full flex flex-row gap-4 border rounded px-6 py-8">
      <div>
        {/* Define avatar */}
        <Avatar className="size-20">
          <AvatarImage
            src={`/images/chains/${props.chainConfig.chain.id}.png`}
            alt="Icon"
          />
          <AvatarFallback>
            <NetworkIcon />
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="w-full">
        <p className="text-xl font-bold">{props.chainConfig.chain.name}</p>
        {balance !== undefined ? (
          <div className="flex flex-col items-start gap-4 mt-1">
            <p className="text-sm text-muted-foreground">
              {formatUnits(
                balance,
                props.chainConfig.checkoutPaymentTokenDecimals
              )}{" "}
              {props.chainConfig.checkoutPaymentTokenSymbol}
            </p>
            <Button
              variant="default"
              disabled={balance == BigInt(0) || isWithdrawing}
              onClick={() => onWithdraw()}
            >
              {isWithdrawing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <PiggyBankIcon className="mr-2 h-4 w-4" />
              )}
              ️Withdraw
            </Button>
          </div>
        ) : (
          <Skeleton className="h-6 mt-1" />
        )}
      </div>
    </div>
  );
}
