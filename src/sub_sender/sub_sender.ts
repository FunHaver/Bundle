import { sql } from "slonik";
import DatabaseService from "../services/DatabaseService.js"
import { OutgoingSubscriptionRowSchema, type OutgoingSubscriptionRow } from "../types/subscription.js";
import PublisherService from "../services/PublisherService.js";
import GhostApi from "./ghost_api.js"
import SubscriptionService from "../services/SubscriptionService.js";

async function getPendingSubs():Promise<Readonly<Array<OutgoingSubscriptionRow>>> {
  const pool = await DatabaseService.getDatabase().getPool();
  const outgoingSubRows = await pool.any(sql.type(OutgoingSubscriptionRowSchema)
    `SELECT * FROM outgoing_subscription WHERE subscription_completed = FALSE AND retry_count < 3`);

  return outgoingSubRows;
}

async function processRow(row:OutgoingSubscriptionRow):Promise<Boolean>{
  const publisherService = PublisherService.getPublisherService();
  const subscriptionService = SubscriptionService.getSubscriptionService();
  const ghostApi = new GhostApi("get_uri_from_conf","get_token_from_conf");
  const publisher = await publisherService.getPublisherFromID(row.outgoing_publisher_id);
  const subscriber = await subscriptionService.getSubscriberByID(row.subscriber_id);

  let success = false;
  try {
    if(publisher.platform === "GHOST"){
      success = await ghostApi.sendSub(subscriber);
    }
  //  else if(platform === beehiiv)
  //    success = await.beehiivApi.sendSub()
    return success;
  } catch (err) {
    console.error(`Failed to process row ${row.id}`, err);
    return false;
  }
}

async function markCompleted(rowId: number) {
  //update outgoing_subscription set subscription_completed = true where id = ${rowId}
}

async function incrementRetryCount(rowId: number) {
  //update outgoing_subscription set retry_count = retry_count + 1
}

async function pollOutgoingSubs() {
  try {
    const rows = await getPendingSubs();
    for (const row of rows) {
      const success = await processRow(row);
      if (success) {
        await markCompleted(row.id);
      } else {
        await incrementRetryCount(row.id);
      }
    }
  } catch(err) {
    console.error("Poll failed:", err);
  } finally {
    setTimeout(pollOutgoingSubs, 5000); //TODO - make configurable
  }
}

//child_process.fork executes this
async function main() {
  //connect to db
  const DB_USER = "postgres";
  const DB_PASSWORD = "test";
  const DB_HOST = "localhost";
  const DB_PORT = "5432";
  const DB_NAME = "postgres";
  const pgUri = encodeURI(`postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);
  const pool = await DatabaseService.getDatabase(pgUri).getPool();
  PublisherService.getPublisherService(pool);
  SubscriptionService.getSubscriptionService(pool);
  //begin polling outgoing_subscription table
  await pollOutgoingSubs();
}

main()