
/**
 * The "handling of the creation of users to facilitate bundles" happens here. Basically, use 
 * a users' API key to create paid memberships. This file will be for programmatically creating 
 * premium members on the Ghost platform users.
 * 
 * I think I should be splitting this out into a separate service that is just a queue of new member API requests.
 * 
 * The code below is a proof of concept for communicating via api to ghost.
 */
const readline = require('node:readline');
require('dotenv').config();
const baseURL = "localhost:2368";
const adminEndpoint = "ghost/api/admin";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})


/**
 * need to do this to api key to convert to token. Do it here and just pass in api key or do it outside of class?
 * 
const token:string = jwt.sign({},Buffer.from(process.env.ADMIN_SECRET!, 'hex'),
  {
    keyid: process.env.ADMIN_ID,
    algorithm: "HS256",
    expiresIn: "2m", //max 5m
    audience: "/admin/"
  });
 */
class GhostClient {
  constructor (private baseURL: string, private token: string) {}

  async listMembers() {
    const res = await fetch(`http://${this.baseURL}/ghost/api/admin/members`, {
      "headers": {
        "Accept-Version": "v6.0",
        "Authorization": `Ghost ${this.token}`
      }
    });
    const data:any = await res.json();

    if(data!.members !== undefined) {
      data.members.forEach((member:any) => {
        console.log(member.email + ": " + member.status);
      })
    }
  }

  async addMember(email:string) {
    let body ={
      members: [
          {
            "email": email
          }
        ]}
    const res = await fetch(`http://${this.baseURL}/ghost/api/admin/members`, {
      "method": "POST",
      "headers": {
        "Accept-Version": "v6.0",
        "Authorization": `Ghost ${this.token}`,
        "Content-Type": "application/json"
      },    
      "body": JSON.stringify(body)
    });
    console.log(res.status);
    res.json().then(data => {
      console.log(data)
    })
  }

  async getMemberByEmail(email:string):Promise<any> {
    const res = await fetch(`http://${this.baseURL}/ghost/api/admin/members?search=${email}`, {
      "headers": {
        "Accept-Version": "v6.0",
        "Authorization": `Ghost ${this.token}`,
        "Content-Type": "application/json"
      },    
    })
    let result:any = await res.json();
    console.log(result.members[0]);
    return result.members[0];
  }

  //This is how members are comped
  async upgradeMember(email:string) {
   /**PUT something like this:
   * {"members":[{"id":"6992970f3d2cd3305af074fd","email":"foo@example.com","tiers":[{"id":"698d571e8aff06d0de0020af","expiry_at":"2026-03-18T00:00:00.000Z"}]}]}
   */
    let member = await this.getMemberByEmail(email);
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
    const res = await fetch(`http://${baseURL}/ghost/api/admin/members/${member.id}/?include=tier`, {
      "method": "PUT",
      "headers": {
        "Accept-Version": "v6.18",
        "Authorization": `Ghost ${this.token}`,
        "Content-Type": "application/json"
      },
      "body": JSON.stringify(body)
    })
    res.json().then((data:any) => {
      console.log(data);
    })
  }
}

module.exports = {GhostClient}