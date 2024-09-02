"use server";

import { mongoDbConfig } from "@/config/mongodb";
import { Subscription } from "@/models/subscription";
import { errorToString } from "./converters";
import clientPromise from "./mongodb";

export type ActionResponse<T> = {
  data?: T;
  error?: string;
};

export async function saveSubscription(
  subscription: Subscription
): Promise<ActionResponse<string> | undefined> {
  console.log("saveSubscription()");
  try {
    const client = await clientPromise;
    const db = client.db(mongoDbConfig.database);
    const insertedDocument = await db
      .collection(mongoDbConfig.collectionSubscriptions)
      .insertOne(subscription);
    return {
      data: insertedDocument.insertedId.toString(),
    };
  } catch (error) {
    return {
      error: `Failed to save subscription: ${errorToString(error)}`,
    };
  }
}

export async function getSubscriptions(
  seller: `0x${string}`
): Promise<ActionResponse<Subscription[]> | undefined> {
  console.log("getSubscriptions()");
  try {
    const client = await clientPromise;
    const db = client.db(mongoDbConfig.database);
    const findCursor = await db
      .collection<Subscription>(mongoDbConfig.collectionSubscriptions)
      .find({ seller: seller });
    const documents: Subscription[] = [];
    for await (const document of findCursor) {
      documents.push(document);
    }
    return {
      data: documents,
    };
  } catch (error) {
    return {
      error: `Failed to get subscriptions: ${errorToString(error)}`,
    };
  }
}
