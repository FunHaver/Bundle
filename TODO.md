[x] create persistence layer w/Slonik
  [x] Begin at startup in main w/db connection and schema validation
  [x] Then do addSubscription
[] attach webhook to api and let her rip
  - implement separate node process that polls outgoing_subscription table and issues outgoing api requests
    Try child_process.fork, if that fails, just do child_process.spawn
  - add JWT auth

[] implement multitenancy
[] implement basic auth
[] implement Vue UI
[] implement beehiiv webhooks/outgoing api