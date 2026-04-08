import DatabaseService from "../services/DatabaseService.js"

async function pollOutgoingSubs() {
  //if lastPollCompleted global var?
  //select from outgoing_subscription where subscription_completed = false
  //for sub in outgoingSubs
  //  get publisher platform
  //  let success = false;
  //  if(platform === ghost)
  //    success = await ghostApi.sendSub()
  //  else if(platform === beehiiv)
  //    success = await.beehiivApi.sendSub()
  
  //  if(success)
  //    update outgoing_subscription where id = ${sub.id}
  //  else
  //    I guess try again next go around. Can see the issue here though... need a max number of retries or something.
  //    That also means that I need to track expired senders
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

  //setInterval(pollingFn, period)
}

main()