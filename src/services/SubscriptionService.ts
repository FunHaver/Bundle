import { type DatabasePool,sql } from "slonik";
import * as z from "zod";
import { type Subscriber,type SubscriberRow, type NewSubscriber, type GhostMember, GhostMemberSchema, SubscriberRowSchema } from "../types/subscription.js";
import BundleService from "./BundleService.js";
import PublisherService from "./PublisherService.js";
class SubscriptionService {  
  private static serviceInstance: SubscriptionService;
  private pool: DatabasePool | null;
  
  private constructor (pool:DatabasePool){
    this.pool = pool;
  }

  public static getSubscriptionService(pool?:DatabasePool): SubscriptionService {
    if(!SubscriptionService.serviceInstance){
      if(!pool) {
        throw new Error("ERROR: database pool is required for first instantiation");
      }
      SubscriptionService.serviceInstance = new SubscriptionService(pool);
    }
    return SubscriptionService.serviceInstance;
  }

  //publisherId is already validated during auth step prior to parsing
  public parseGhostRequest(publisherUUID: string,requestBody:unknown):NewSubscriber {
    const parsed = GhostMemberSchema.parse(requestBody);
    return {
      "email":parsed.email,
      "publisherUUID":publisherUUID,
      "webhookUUID": parsed.uuid
    }
  }

  public async getSubscriberByID(subID: number): Promise<Subscriber> {
    const subscriberRow = await this.pool!.one(sql.type(SubscriberRowSchema)
    `SELECT * FROM subscriber WHERE id = ${subID}`);
    return {
      id: subscriberRow.id,
      email: subscriberRow.email,
      creationDate: subscriberRow.creation_date,
      originID: subscriberRow.origin,
      webhookUniqueID: subscriberRow.webhook_unique_id
    }
  }

  public async getSubscriberByWebhookUUID(uuid:string):Promise<Subscriber>{
    const subscriberRow = await this.pool!.one(sql.type(SubscriberRowSchema)
    `SELECT * FROM subscriber WHERE webhook_unique_id = ${uuid}`);

    return {
      id: subscriberRow.id,
      email: subscriberRow.email,
      creationDate: subscriberRow.creation_date,
      originID: subscriberRow.origin,
      webhookUniqueID: subscriberRow.webhook_unique_id
    }
  }

  public async addNewSubscriber(parsedSubscriptionRequest:NewSubscriber){
    //persist in database
    //outgoing subscription api service will
    //look at db for queue
    
    const subWebhookId = await this.pool?.maybeOneFirst(
      sql.type(z.object({
        "webhook_unique_id":z.string()
      }))
    `SELECT webhook_unique_id FROM subscriber WHERE webhook_unique_id = ${parsedSubscriptionRequest.webhookUUID}`);
    if(typeof subWebhookId === "string"){
      console.log(`Subscriber with webhook_unique_id: ${subWebhookId} has already been submitted`);
      return 
    }

    const publisherService = PublisherService.getPublisherService();

    const originalPub = await publisherService.getPublisherFromUUID(parsedSubscriptionRequest.publisherUUID);
    //add to subscriber table
    await this.pool?.query(sql.type(
    z.object({}).strict())
    `INSERT INTO subscriber (email,
              creation_date,
              origin,
              webhook_unique_id)
       VALUES ('${parsedSubscriptionRequest.email}',
                '${new Date().toISOString()}',
                ${originalPub.id},
                '${parsedSubscriptionRequest.webhookUUID}')`);

    const subscriber = await this.getSubscriberByWebhookUUID(parsedSubscriptionRequest.webhookUUID);
    const bundleService = BundleService.getBundleService();
    bundleService.addOutgoingSubscription(subscriber);
    
    return;
  }
}

export default SubscriptionService;
