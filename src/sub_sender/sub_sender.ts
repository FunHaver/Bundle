import DatabaseService from "../services/DatabaseService.js"
import type { OutgoingSubscriptionRow } from "../types/subscription.js";


async function getPendingSubs():Promise<Array<OutgoingSubscriptionRow>> {
  //select from outgoing_subscription where subscription_completed = false and retry_count < 3
}

async function processRow(row:OutgoingSubscriptionRow):Promise<Boolean>{
  //  get publisher platform
  //  let success = false;
  try {
  //  if(platform === ghost)
  //    success = await ghostApi.sendSub()
  //  else if(platform === beehiiv)
  //    success = await.beehiivApi.sendSub()
    return true;
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
  DatabaseService.getDatabase(pgUri);

  //begin polling outgoing_subscription table
  await pollOutgoingSubs();
}

main()