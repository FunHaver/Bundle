import { type DatabasePool, sql } from "slonik";
import type { Subscription } from "../types/subscription.js";
import type { Publisher } from "../types/publisher.js";
import * as z from "zod";

class BundleService {
  private static serviceInstance: BundleService;
  private pool: DatabasePool | null;

  private constructor(pool:DatabasePool) {
    this.pool = pool;
  }

  public static getBundleService(pool?:DatabasePool): BundleService {
    if(!BundleService.serviceInstance){
      if(!pool) {
        throw new Error("ERROR: database pool is required for first instantiation");
      }
      BundleService.serviceInstance = new BundleService(pool);
    }
    return BundleService.serviceInstance;
  }

  //Gets all OUTGOING publishers. Every publisher that is not the one that the subscriber used to sign up.
  public async getAssociatedPublishersFromSubscription(sub:Subscription):Promise<Array<Publisher>> {
    //TODO get bundle from subscriber data -> get publishers from bundle
  }

  public async addOutgoingSubscription(sub:Subscription) {
    
    //Refactor to insert multiple in transaction, one insert for each publisher
    await this.pool?.query(sql.type(
      z.object({}).strict())
    `INSERT INTO outgoing_subscribers (subscription_request_id,outgoing_publisher_id,subscription_completed)
    VALUES (${sub.id},${publisher.id},false)`);
  }

}

export default BundleService;
