require('dotenv').config();
const jwt = require('jsonwebtoken');
const baseURL = "localhost:2368";
const adminEndpoint = "ghost/api/admin";



async function main(){
  const token = jwt.sign({},Buffer.from(process.env.ADMIN_SECRET!, 'hex'),
    {
      keyid: process.env.ADMIN_ID,
      algorithm: "HS256",
      expiresIn: "5m",
      audience: "/admin/"
    });

  const res = await fetch(`http://${baseURL}/${adminEndpoint}/members`, {
    "headers": {
      "Accept-Version": "v6.0",
      "Authorization": `Ghost ${token}`
    }
  });
  const data = await res.json();
  console.log("Returned status: " + res.status);
  console.log(data);
}

console.log("Starting...");
main();