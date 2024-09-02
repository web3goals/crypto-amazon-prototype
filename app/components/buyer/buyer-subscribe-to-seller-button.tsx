"use client";

import useError from "@/hooks/useError";
import { saveSubscription } from "@/lib/actions";
import {
  createConsentMessage,
  createConsentProofPayload,
} from "@xmtp/consent-proof-signature";
import { BellIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { Address } from "viem";
import { useWalletClient } from "wagmi";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";

export function BuyerSubscribeToSellerButton(props: { seller: Address }) {
  const { handleError } = useError();
  const { data: walletClient } = useWalletClient();
  const [subscribing, setSubscribing] = useState(false);

  async function onSubscribe() {
    try {
      setSubscribing(true);
      if (!walletClient) {
        throw new Error("Wallet client not defined");
      }
      // Sign message to subscribe
      const timestamp = Date.now();
      const message = createConsentMessage(props.seller, timestamp);
      const signature = await walletClient.signMessage({
        message,
      });
      const consentProofPayloadBytes = createConsentProofPayload(
        signature,
        timestamp
      );
      const consentProofPayloadBase64 = Buffer.from(
        consentProofPayloadBytes
      ).toString("base64");
      // Save subscription
      await saveSubscription({
        seller: props.seller,
        subscriber: walletClient.account.address,
        subscriberConsentProofPayloadBase64: consentProofPayloadBase64,
      });
      toast({ title: "Subscribed 🎉" });
    } catch (error) {
      handleError(error, true);
    } finally {
      setSubscribing(false);
    }
  }

  return (
    <Button
      variant="secondary"
      disabled={subscribing}
      onClick={() => onSubscribe()}
    >
      {subscribing ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <BellIcon className="mr-2 h-4 w-4" />
      )}
      Subscribe to promotions
    </Button>
  );
}
