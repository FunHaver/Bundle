import type { DatabasePool } from "slonik";
import type { NewSubscription } from "../types/subscription.js";

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

  public addOutgoingSubscription(parsedSub:NewSubscription) {
    //slonik INSERT INTO outgoing_subscribers
  }

}

export default BundleService;