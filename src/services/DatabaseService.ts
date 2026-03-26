import { createPool, type DatabasePool } from "slonik";
import { createPgDriverFactory } from "@slonik/pg-driver";
//for development: docker run some-postgres with
//db password, port, user, dbname args
//https://hub.docker.com/_/postgres

class DatabaseService {
  private static serviceInstance: DatabaseService;
  private dbUri: string;
  private pool: DatabasePool | null;

  private constructor(dbUri:string) {
    this.dbUri = dbUri;
    this.pool = null;
  }



  public static getDatabase(dbUri?: string): DatabaseService{
    if(!DatabaseService.serviceInstance) {
      if(typeof dbUri !== "string") {
        throw new Error("ERROR: DB IS NULL, MUST PROVIDE DATABASE URI");
      } else {
        DatabaseService.serviceInstance = new DatabaseService(dbUri);
        
      }
    }
    return DatabaseService.serviceInstance;
  }

  public async getPool():Promise<DatabasePool> {
    if(this.pool === null){
      this.pool = await createPool(this.dbUri, {
        driverFactory: createPgDriverFactory()
      })
    }
    return this.pool;
  }

  
}

export default DatabaseService;