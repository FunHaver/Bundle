import { type DatabasePool,sql } from "slonik";
import * as z from "zod";
import { type Subscription,type SubscriptionRow, type NewSubscription, type GhostMember, GhostMemberSchema, SubscriptionRowSchema } from "../types/subscription.js";
import type { Publisher } from "../types/publisher.js";
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
  public parseGhostRequest(publisherUUID: string,requestBody:unknown):NewSubscription {
    const parsed = GhostMemberSchema.parse(requestBody);
    return {
      "email":parsed.email,
      "publisherUUID":publisherUUID,
      "webhookUUID": parsed.uuid
    }
  }

  public async getSubscriberByWebhookUUID(uuid:string):Promise<Subscription>{
    const subscriptionRow = await this.pool!.one(sql.type(SubscriptionRowSchema)
    `SELECT * FROM subscriber WHERE webhook_unique_id = '${uuid}'`);

    if(!subscriptionRow){
      throw new Error(`Subscription with webhook_unique_id: ${uuid} not found`);
    } else {
      return {
        id: subscriptionRow.id,
        email: subscriptionRow.email,
        creationDate: subscriptionRow.creation_date,
        originID: subscriptionRow.origin,
        webhookUniqueID: subscriptionRow.webhook_unique_id
      }
    }
  }

  public async addNewSubscriber(parsedSubscriptionRequest:NewSubscription){
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
