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

async function getMemberByEmail(token:string, email:string):Promise<any> {
  const res = await fetch(`http://${baseURL}/${adminEndpoint}/members?search=${email}`, {
    "headers": {
      "Accept-Version": "v6.0",
      "Authorization": `Ghost ${token}`,
      "Content-Type": "application/json"
    },    
  })
  let result:any = await res.json()
  console.log(result.members[0])
  return result.members[0]
  
}

//This is how members are comped:
async function upgradeMember(token:string, email:string) {
/**PUT something like this:
 * {"members":[{"id":"6992970f3d2cd3305af074fd","email":"foo@example.com","tiers":[{"id":"698d571e8aff06d0de0020af","expiry_at":"2026-03-18T00:00:00.000Z"}]}]}
 */
  let member = await getMemberByEmail(token, email);
  let body = {
    "members": [{id:member.id, email: member.email,
    "tiers": [
      {
        "id": "698d571e8aff06d0de0020af", //hardcoded tier derived from test ghost instance
        "expiry_at": new Date('2026-12-31').toISOString()
      }
    ]}]
  }

  //I think member.id is required in the URL even though we're passing in an array of members
  const res = await fetch(`http://${baseURL}/${adminEndpoint}/members/${member.id}/?include=tier`, {
    "method": "PUT",
    "headers": {
      "Accept-Version": "v6.18",
      "Authorization": `Ghost ${token}`,
      "Content-Type": "application/json"
    },
    "body": JSON.stringify(body)
  })
  res.json().then((data:any) => {
    console.log(data);
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
    "What would you like to do? (options: getmembers, getmember, addmember, addpaid, quit): ",
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
      }
      else if (command === "addpaid"){
        rl.question("Please enter the lucky member's email: ", (email: string) => {
          upgradeMember(token,email)
        })
      } else if (command === "getmember"){
        rl.question("Please enter the member's email: ", (email: string) => {
          getMemberByEmail(token, email);
        })
      } else {
        console.log("Idk that command.");
        process.exit(1);
      }
    },
  );
}

main();