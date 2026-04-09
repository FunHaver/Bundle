import { type DatabasePool, sql } from "slonik";
import type { Subscriber } from "../types/subscription.js";
import * as z from "zod";
import PublisherService from "./PublisherService.js";
import { BundleSchema, type Bundle } from "../types/bundle.js";

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

  public async getBundleFromPublisherID(publisherId: number) {
    const bundle = await this.pool!.one(sql.type(BundleSchema)`
      SELECT * FROM publisher
      INNER JOIN publisher_bundle_association pba ON publisher.id = pba.publisher_id
      WHERE pba.publisher_id = ${publisherId}
    `);
    return bundle;
  }

  public async getBundleFromSubscriber(subscriber:Subscriber):Promise<Bundle> {
    //TODO add more granular bundle scopes
    
    //Currently a publisher can only have one bundle.
    return await this.getBundleFromPublisherID(subscriber.originID);

  }

  public async addOutgoingSubscription(subscriber:Subscriber) {
    //Publisher service get publishers
    const publisherService = PublisherService.getPublisherService();
    const bundle = await this.getBundleFromSubscriber(subscriber);
    const publishers = await publisherService.getPublishersFromBundle(bundle.id);
    const outgoingPublishers = publishers.filter(pub => pub.id !== subscriber.originID);
    
    await this.pool!.transaction(async (connection) => {
      for (const publisher of outgoingPublishers) {
        await connection.query(sql.type(z.object({}).strict()) 
          `INSERT INTO outgoing_subscribers (subscription_request_id,outgoing_publisher_id,subscription_completed)
          VALUES (${subscriber.id},${publisher.id},false)`
        )
      }
    })
  }

}

export default BundleService;
