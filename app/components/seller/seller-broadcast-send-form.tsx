"use client";

import useError from "@/hooks/useError";
import useEthersWalletClient from "@/hooks/useEthersWalletClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { Client } from "@xmtp/xmtp-js";
import { Loader2, MegaphoneIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/use-toast";
import { invitation } from "@xmtp/proto";
import { getSubscriptions } from "@/lib/actions";

export function SellerBroadcastSendForm() {
  const { handleError } = useError();
  const { data: walletClient } = useEthersWalletClient();
  const [submitting, setSubmitting] = useState(false);

  const formSchema = z.object({
    message: z.string().min(2),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setSubmitting(true);
      // Load subscriptions from backend
      const getSubscriptionsResponse = await getSubscriptions(
        await walletClient.getAddress()
      );
      const subscriptions = getSubscriptionsResponse?.data || [];
      console.log({ subscriptions });
      // Send messages
      for (const subscription of subscriptions) {
        const xmtp = await Client.create(walletClient, { env: "production" });
        const canMessage = await xmtp.canMessage(subscription.subscriber);
        if (canMessage) {
          const consentProofPayload = invitation.ConsentProofPayload.decode(
            Buffer.from(
              subscription.subscriberConsentProofPayloadBase64,
              "base64"
            )
          );
          const conversation = await xmtp.conversations.newConversation(
            subscription.subscriber,
            undefined,
            consentProofPayload
          );
          await conversation.send(values.message);
        }
      }
      toast({ title: "Message sent to subscribers 🎉" });
      form.reset();
    } catch (error) {
      handleError(error, true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Hey..."
                  disabled={submitting}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <MegaphoneIcon className="mr-2 h-4 w-4" />
          )}
          Send
        </Button>
      </form>
    </Form>
  );
}
