/**
 * Where all express routes will be defined (at least until this file gets too big 
 * and things need to be separated into folders by functionality or entity or concern or something)
 */

/**
 * route that serves main Vue app for bundle admin
 * get /
 */

/**
 * route that serves login page UI (not the same payload regular vue app, I guess ? not sure if that is important to distingish)
 * get /login
 */

/**
 * route that logs you out
 * get /logout
 */

/**
 * route that listens for webhook requests from publishing platforms
 * post /webhook/ghost/:userid
 *    - authenticate request (userid + secret)
 *    - handle creation of users for associated publications across all supported platforms to facilitate bundle
 */



/**
 * post /webhook/beehiiv/:userid
 *    - authenticate request (tbd on what beehiiv allows for usage to auth webhooks)
 *    - handle creation of users for associated publications across all supported platforms to facilitate bundle
 * post /webhook/more_integrations_here/:userid
 *    - authenticate request (whatever the next platform uses to auth webhooks)
 *    - handle creation of users for associated publications across all supported platforms to facilitate bundle
 */

/**
 * route that handles user input on the bundling app
 * post /api/publication/add
 * post /api/publication/edit
 * post /api/publication/delete
 * 
 * post /api/bundle/add
 * post /api/bundle/edit
 * post /api/bundle/delete
 * 
 * post /api/partner/add
 * post /api/partner/edit
 * post /api/partner/delete
 * 
 * get /api/report/bundle
 *    --takes params for each prop, schema tbd
 *    --first report should just be sent/recieved members
 */