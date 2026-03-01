const express = require("express");
const app = express();
const port = 8000;

function main() {
  /**
   * Startup
   *  - start logging()
   *  - database initialization() {
   *    - connect to db
   *    - schema validation     
   *  }
   *  - express initialization() {
   *    - define express config
   *    - middleware usage statements
   *    - routes
   *  }
   */

  //The below code is just a poc for recieving webhooks from Ghost
  app.use(express.json())
  app.post('/', (req,res) => {
    console.log(req.params)
    let foo = req.body
    console.log(foo)
  })

  app.listen(port, ()=> {
    console.log(`Listening on port ${port}`)
  })
}