const readline = require('node:readline');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const baseURL = "localhost:2368";
const adminEndpoint = "ghost/api/admin";


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

async function listMembers(token:string) {
  const res = await fetch(`http://${baseURL}/${adminEndpoint}/members`, {
    "headers": {
      "Accept-Version": "v6.0",
      "Authorization": `Ghost ${token}`
    }
  });
  const data:any = await res.json();

  if(data!.members !== undefined) {
    data.members.forEach((member:any) => {
      console.log(member.email + ": " + member.status);
    })
  }
}

async function addMember(token:string, email:string) {

  let body ={
    members: [
        {
          "email": email
        }
      ]}
  const res = await fetch(`http://${baseURL}/${adminEndpoint}/members`, {
    "method": "POST",
    "headers": {
      "Accept-Version": "v6.0",
      "Authorization": `Ghost ${token}`,
      "Content-Type": "application/json"
    },    
    "body": JSON.stringify(body)
  });
  console.log(res.status);
  res.json().then(data => {
    console.log(data)
  })
}

function main(){
  const token:string = jwt.sign({},Buffer.from(process.env.ADMIN_SECRET!, 'hex'),
  {
    keyid: process.env.ADMIN_ID,
    algorithm: "HS256",
    expiresIn: "2m", //max 5m
    audience: "/admin/"
  });
  rl.question(
    "What would you like to do? (options: getmembers, addmember, quit): ",
    (command: string) => {
      if (command === "getmembers") {
        listMembers(token);
      } else if (command === "addmember") {
          rl.question("Please enter the new member's email: ", (email: string) => {
            addMember(token, email);
        })
      } else if (command === "quit") {
        console.log("Good Bye!");
        process.exit(0);
      } else {
        console.log("Idk that command.");
        process.exit(1);
      }
    },
  );
}

main();