import { type DatabasePool,sql } from "slonik";
import * as z from "zod";
import { type NewSubscription, type GhostMember, GhostMemberSchema } from "../types/subscription.js";
import type { Publisher } from "../types/publisher.js";
import BundleService from "./BundleService.js";
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
  public parseGhostRequest(publisher: Publisher,requestBody:unknown):NewSubscription {
    const parsed = GhostMemberSchema.parse(requestBody);
    return {
      "email":parsed.email,
      "publisherUUID":publisher.uuid,
      "webhookUUID": parsed.uuid
    }
  }

  public async addNewSubscription(parsedSubscriptionRequest:NewSubscription){
    //persist in database
    //outgoing subscription api service will
    //look at db for queue
    
    const subWebhookId = await this.pool?.maybeOneFirst(
      sql.type(z.object({
        "webhook_unique_id":z.string()
      }))
    `SELECT webhook_unique_id FROM subscriber_request WHERE webhook_unique_id = ${parsedSubscriptionRequest.webhookUUID}`);
    if(typeof subWebhookId === "string"){
      console.log(`Subscriber request with webhook_unique_id: ${subWebhookId} has already been submitted`);
      return 
    }

    //add to subscriber_request table
    await this.pool?.query(sql.type(
    z.object({}).strict())
    `INSERT INTO subscriber_request (email,
              creation_date,
              origin,
              webhook_unique_id)
              (${parsedSubscriptionRequest.email,
                new Date().toISOString(),
                parsedSubscriptionRequest.publisherUUID,
                parsedSubscriptionRequest.webhookUUID})`);
    
    //add to outgoing_subscription table
    const bundleService = BundleService.getBundleService();
    bundleService.addOutgoingSubscription(parsedSubscriptionRequest)
    
    return
  }
}

export default SubscriptionService;