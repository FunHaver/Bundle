import type { DatabasePool } from "slonik";
import type { Publisher } from "../types/publisher.js";

class PublisherService {
  private static serviceInstance: PublisherService;
  private pool: DatabasePool | null;

  private constructor(pool:DatabasePool) {
    this.pool = pool;
  }

  public static getPublisherService(pool?:DatabasePool): PublisherService {
    if(!PublisherService.serviceInstance){
      if(!pool) {
        throw new Error("ERROR: database pool is required for first instantiation");
      }
      PublisherService.serviceInstance = new PublisherService(pool);
    }
    return PublisherService.serviceInstance;
  }


  public getPublisherByUUID(publisherUUID:string):Publisher {
    //slonik db retrieval
    //return constructed publisher
    return {
      "id":-1,
      "name": "pubName",
      "owner": {"id": -1, "username":"test@example.com", "authenticationMethod": "BASIC"},
      "platform": "GHOST",
      "uuid":"some-uuid-39094s0"
    }
  }
}

export default PublisherService;