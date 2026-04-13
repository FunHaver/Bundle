import { type DatabasePool, sql } from "slonik";
import { PublisherSchema, type Publisher } from "../types/publisher.js";

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

  public async getPublishersFromBundle(bundleId: Number): Promise<Readonly<Array<Publisher>>> {
    //TODO handle NotFoundError
    const result = await this.pool!.many(sql.type(PublisherSchema)`
      SELECT * FROM publisher
      INNER JOIN publisher_bundle_association pba ON publisher.id = pba.publisher_id
      WHERE pba.bundle_id = ${bundleId.toString()}
    `);

    return result;
  }

  public async getPublisherFromID(pubID: number): Promise<Readonly<Publisher>> {
    const result = await this.pool!.one(sql.type(PublisherSchema)`SELECT * FROM publisher WHERE id = ${pubID}`);
    return result;
  }

  public getPublisherFromUUID(publisherUUID:string):Publisher {
    //slonik db retrieval
    //return constructed publisher
    return {
      "id":1,
      "name": "pubName",
      "owner": -1,
      "platform": "GHOST",
      "uuid":"some-uuid-39094s0"
    }
  }
}

export default PublisherService;
