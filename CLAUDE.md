This repository is for a Postgresql + Vue + Node + express application. The purpose of this application is to facilitate the 
bundling of subscriptions across different newsletter publishing platforms (think Ghost, Beehiiv).

The basic idea is this:
A publisher signs up, adds this application's webhook endpoint to their publishing site and an API key to this application.
The publisher creates or joins a bundle (enters a bundle mutually) with another publisher or publishers that have signed up.
A visitor to that publisher's site (now referred to as the originator) signs up for a premium subscription defined by the publisher and associated with the bundle.
The webhook on the publishing platform is triggered.
On the application, the other publication(s) associated with this bundle have the new premium subscriber from the originator site added to their publication as premium users as well.

There will be configurations like how long do these premium accounts last, if/when does this bundle expire

Additionally there will be reporting so publishers can see who sent who where and decide amongst themselves how to coordinate administration/compensation with each other.