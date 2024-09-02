import { ObjectId } from "mongodb";

/**
 * Class for MongoDB data model.
 */
export class Subscription {
  constructor(
    public seller: `0x${string}`,
    public subscriber: `0x${string}`,
    public subscriberConsentProofPayloadBase64: string,
    public _id?: ObjectId
  ) {}
}
