# Bundle
A deployable bundling platform for independant publishers.

## Usage
From an end user's perspective, they would need to do the following:
 * Sign up
 * Generate an API key on their supported platform
 * Paste their API key on Bundle (enables incoming subscriptions)
 * Create a webhook connection on their platform using the bundle-generated URL.
 * Associate other publishers on the bundle platform with themselves
 * Ideally a publisher would also associate a tier or other sub-category of user with the bundle.
 * The experience would be a new subscriber signing up on their platform, and Bundle facilitating a new sign-up on the associated publishers' platforms automatically.

## Renumeration
Ideally I would not need to handle payment at all. The platform would provide a way to track incoming and outgoing subscribers and provide the publishers with data they can then use to work out any renumeration or credit structure they would like, outside of the platform.


## Tech Stack

* Node.js/Express (typescript)
* Postgresql w/ Slonik
* Vue frontend

Probably reverse proxied behind nginx
Run it on a debian vm?

## Subscription Flow: 

```
Ghost platform
    |
    | POST /webhook/ghost/:publisherUUID/member
    v
ghost_webhook.ts

    |-- /:publisherUUID/member
        |-- Authenticate request
        |-- Parse
        |-- Validate
        |-- SubscriptionService.addNewSubscription()
              |-- Dedup check
              |-- INSERT INTO subscriber_request
              |-- BundleService.addOutgoingSubscription()
                    |-- Look up bundle partners for the originating publisher
                    |-- INSERT one row into outgoing_subscription per partner
                         (subscription_completed = false)

--- request handled, response sent ---

Outgoing Subscription Worker
    |
    |-- SELECT rows WHERE subscription_completed = false
    |-- For each row:
    |     Call partner platform API (Ghost, Beehiiv, etc.)
    |     to provision the subscriber as a premium member
    |     |-- On success: UPDATE outgoing_subscription SET subscription_completed = true
    |     |-- On failure: log / retry 
    |
    |-- subscriber now has access
```
