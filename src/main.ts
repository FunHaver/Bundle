import express from "express";
import ghostWebhookRouter from "./ghost_webhook.js";
import DatabaseService from "./services/DatabaseService.js";
import { sql } from "slonik";
import * as z from "zod";
import SubscriptionService from "./services/SubscriptionService.js";
import PublisherService from "./services/PublisherService.js";
import BundleService from "./services/BundleService.js";

const app = express();

async function main() {
  /**
   * Startup
   *  - start logging()
   */
   
  //database initialization() {
  //- connect to db

  const DB_USER = "postgres";
  const DB_PASSWORD = "test";
  const DB_HOST = "localhost";
  const DB_PORT = "5432";
  const DB_NAME = "postgres";
  const pgUri = encodeURI(`postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);
  const database = DatabaseService.getDatabase(pgUri);
  const pool = await database.getPool();

  //- schema validation 
  const schemaExists = await pool.oneFirst(sql.type(z.object({"exists": z.boolean()}))`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'application')`);
  if(schemaExists) {
    //check current, data present in version file/manifest?
    let currentSchemaVersion = await pool.oneFirst(sql.type(z.object({"schema_ver": z.number()}))`SELECT schema_ver from application`);
    console.log(`Schema version ${currentSchemaVersion}`);
    //if not current then migrate
    
  } else {
    console.error("No schema found, please initialize database.");
  }

  //service initialization
  SubscriptionService.getSubscriptionService(pool);
  PublisherService.getPublisherService(pool);
  BundleService.getBundleService(pool);
  /* 
   *  - express initialization() {
   *    - define express config
   *    - middleware usage statements
   *    - routes
   *  }
   */

  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
  app.use(express.json())
  app.use('/webhook/ghost',ghostWebhookRouter)
  app.use((err: any,req: any,res: any,next: any) => {
    //switch on err
    //INVALID_CRED -> 401
    //PARSE -> 400
    //default -> 500
    res.status(500)
    res.render('error', { error: err })
  })
  app.listen(8000, () => {
    console.log("Listening on port 8000");
  })
}

main();