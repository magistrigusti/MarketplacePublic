### 1) Search page

-   A) search a single word with results (portals) -- make sure data shows and charts show up
    -   B) click into a message and view the drill down
    -   C) toggle off the chart and on again
    -   D) click "next" and "scroll to top"
-   E) search a multiple word with results (sol nft)

### 2) Today's mints page

-   1. Execute a GET request to http://localhost:5001/nft-discord-relay/us-central1/api/getTodaysMints?doScrape=true
-   2. Since scraping mints for a whole month takes a lot of time, a month is divided intro three 10-day intervals and each of those intervals get scraped. We separate this with a parameter called whichSection which can hold the values 'first', 'second' or 'third'.
       Example: http://localhost:5001/nft-discord-relay/us-central1/api/thirtyMints?whichSection=first. Execute this endpoint for all sections, usually takes 5-10 minutes per section. Make sure you have the FUNCTIONS_EMULATOR_TIMEOUT_SECONDS variable set in .env to 300 and up to 600.
-   3. Load up todays mints and make sure it only shows things that are actually minting today. make sure data filled out in most columns
-   4. Load up the calendar and ensure there are no duplicates. Make sure there is 30+ days of data. Ensure you can click into a date and get the calendar details. Ensure you can click into a date and all the fields are filled in
-   5. Go to Vehn's Dojo - daily mints -- make sure it is filled out and looks good, according to the specifications.

### 3) Testing Fox Token page:

-   A) Make sure filled out
-   B) make sure search works
-   C) test 'add custom token name' (make sure discord alert sent)
-   D) test 'track multiple wallets'
-   E) expand a chart, make sure both charts fill out
-   F) make sure links to FF, Solscan, Twitter and Discord work

### 4) Testing Fox token - doing more advanced testing with wallets (tiny bit optional)

-   A) be logged out of wallet and "view my tokens"
-   B) be logged out of wallet, and add a custom wallet, then test "view my tokens"
-   C) log in wallet, test "view my tokens"
-   D) log in wallet, add 1-2 custom wallets , test "view my tokens"

### 5) Mint stats

-   A) Make sure filled out
-   B) Make sure preview icons are showing (if appliccable)
-   C) Make sure ME and Mint URLs are correct and work

### 6) Stacked line search

-   A) search "portals suites" - make sure filled out

## Testing Discord bots

-   NOTE: all below should be with `TEST_VEHN_DOJO=true` enabled
-   NOTE: make sure any Discord bot you tested above has `* DISCORD BOT` in a multi line comment explaining it

### 7) Discord bots - user entry

-   A) test all the bots listed in discord-bots deploy-commands.js

### 8) Discord bots - automated - some of them

-   A) enter a new Fox custom name, make sure shows up in Discord (talked more about in 4.B.)
-   B) run the daily schedule URL, make sure shows up in Discord

### 9) Discord bots - automated - discord-parser-receiver and our python code (which parses links from discord chat)

(1) if wanting to use the Test RDS, make sure it is running, then update .runtimeconfig.json (search for mydb_test here for creds) (change back after done...)
(2) switch the firebase.json's (to get firestore running locally if needed) (change back after done...)
(3) then run `NODE_ENV=debug TEST_VEHN_DOJO=true npm start (in discord-bots project)`,
(4) go to python directory and run `python3 run_vehn.py debug=True`, this reads from 'vehn dojo - regular-chat-test' (you will need the discord token for this)
(5) type a link in that channel, that you now has a mint on it
(6) see the output in terminal, and see the chat message go to discord-combined-test, and to "me-nft-alerts-and-raw-mint-feed-test" if a mint was found
(7) see firebase output on http://localhost:4001/firestore/data
(8) If want to mess with different sources (to get the @ alerts working), go to run_vehn.py and change the source for Test (change back after done...), or change it within Firebase
(8b) Then see the output in mint-alerts-automated-test

### 10) TEST THE VARIOUS URLs (especially those attached to cronjobs) on the bottom of readme.md

(in the section `## URLs we use ie. URLs to test with` - mostly just test the ones with \*\*\*\* in them)

Special notes:

-   when testing foxTokenAnalysis?doScrape=true, make sure the "official token added" was sent to Discord

### 11) Testing on a phone

https://developer.chrome.com/docs/devtools/remote-debugging/

https://prowe214.medium.com/tip-how-to-view-localhost-web-apps-on-your-phone-ad6b2c883a7c#:~:text=On%20your%20mobile%20device's%20browser,don't%20leave%20it%20off.

-   https://www.whatismyip.com
-   http://24.88.49.<ip>:3000/

### 11) Testing 30 days insertion of data, tomorrow mints

(1) First coming to tomorrow mints if you want to test tomorrow mints, you can use the route http://localhost:5001/nft-discord-relay/us-central1/api/todayRefactor?testWebhook=1&doScrape=1&tomorrow=1
(2) To Test it out these are the query params that we are giving in order to recieve a live response, if we don't provide doScrape we'll just get todays_mints from redis and that wont be the tomorrow mints.
(3) Hit the api and see at discord if you're recieving everything, some fields could be missing or broken will be updating them shortly through the database.
(4) To test out the thirty days data insertion if its working fine we can use the route http://localhost:5001/nft-discord-relay/us-central1/api/testThirty
(5) What this route does it basically fetches everything from todays date ie (18 May - 18 June) of mints and stores all of the data in the db
(6) You can hit the api a couple of times to see if data is the same and it should be since the date has not changed
(7) If you want to check if the date is working fine then you need to change the current date maybe give it of 5 days ahead and see if you get any new mints from changing the date (can be done through backend code or if you know of other possible ways to change your date).
(8) This need more refactors and needs to be integrated with todays mint after approval and final testing oncee its integrated with todays mints things like discord online members, twitter followers, tweet interactions will be inserted accurately.

### 13) Assign Admin if you have no enough nft to enable bot configure packages

(1) First you login and then go to https://soldecoder.app/manageserver page
(2) You see available server that you create in discord
(3) Now select server that you want and click add button
(4) Now you redirect to https://soldecoder.app/servermodule configure bot package page
(5) If you don't have enough NFT and no Roll then you see a 'Add Admin For Your Server' Button on top
(6) Then you can show list of Admin that available
(7) You can assign admin through assign button
(8) Then Admin that you assign is access your bot module but they have 3nf or 4nft otherwise they can't access your bot module packages

### 14) View Live messages

(1) Search any word in header global search
(2) And you can show the list of messages
(3) You can click on message and open a popup in popup you show list of comment of particular messages
(4) In popup top you can see button 'View Live Messages'
(5) If you have 3NFT then you can get live messages from socket
(6) Every 5 second Socket will send data if data is changes from previous data then you can show on top of list new messages
(7) When you click close messages socket will disconnect

### 15) Connect Wallet issue

(1) I am try to connect and disconnect wallet in fox token page
(2) I try with uncomment walletMultiButton.tsx line 145 function and check
(3) I also change local_host_str = 'localhost' to 'test'
(4) then connect wallet with phantom connect and disconnect
(5) then also connect with multi wallet and also disconnect and complete working

### 16) Token name alerts

(1) Token name alerts should be sent to all of the guilds in the database. If there is a failure for a single guild then the token should not be marked as alerted (property nameAlerted=1) in the database.
(2) The name alerts can be tested by calling the endpoint GET http://localhost:5001/nft-discord-relay/us-central1/api/receiver/alertTokenNames. In the database the tokens which have nameAlerted=0 and have a name will be alerted in the analytics channel (for vehn's dojo that is analytics-etc-test0000).


### 17) Seamless

- Go to https://soldecoder.app/manageserver

- Invite the bot to your server by looking at the top section, and using the 3rd link

- Drag the role (SOL Decoder) HIGHER than your whitelist role

- In the Roles page, Right click on your whitelist role - copy the ID. If you don't see a "Copy ID", then Settings -> Advanced -> Enable Dev mode

- Click Add on your server

- In the URL - add ?devMode=true and then press enter

- On the bottom click Initiate Whitelist

- Select server -> SOL Decoder

- Max users - 100

- Description - Shark Lounge Whitelist! Please join <link to your Discord>

- Expiration date - June 28th

- WL role - the ID you copied above

- Required role (this is the role you are requiring SOL Decoder to have, which is our 1 NFT role) - 966704866640662548

- Enter twitter / image of your NFT

- Click save

### 18) Bot-less NFT-less Seamless
1) link MR for above error.response
2) pull integration
3) setup localhost / your discord to where you have 0 nfts (so you cant enable modules) ... and the server doesn't have the bots in it
4) setup a new 'seamless profile for your dao' -- where you list what your required role ID is (need new field in frontend - if not already there)
5) give WL spots to that dao -- make sure the form has the 'required role' be a integer / text field (not drop down)
6) obtain WL and have it work (should see it pulls your acess token from redis, to get your role in your server)
7) write all above into testing.md

## Admin & Seamless

### /manageserver
-   Guilds where you're owner are being displayed properly
-   Registering a guild as an admin works fine
-   Fetching roles and other info for initiating whitelists is working properly
-   Initiating whitelists is working properly
-   `/whitelistmarketplace` page is displaying wls properly

## Having NFTs or not, and bot modules

New owner OR admin comes on ... they have no NFTs ... they register the guild .. .nothing works to enable modules because they dont have 3 NFTs

so they tell an admin to come on ... he clicks add .... he sees the NEW button ... he clicks it, now its all enabled
-- New button = guilds.js - POST /guilds/:id/nftCheckUserDiscordId
-- An endpoint to update nftCheckUserDiscordId of a guild in the database. This updates nftCheckUserDiscordId to the ID of currently logged in user.

now the owner can come back on - they can refresh the page - and he can now enable



-----
-----

## Assassin Bot

### What's New?
- Endpoints for configuring assassin module
- Message url whitelist detection
- Logs for actions that bot takes
- some more stuff, for more info: https://gitlab.com/nft-relay-group/discord-bots/-/issues/28

### What to test/How to test?
#### Endpoints
Refer to `docs/URLS.md` file for how to test the endpoints

- `POST /guilds/:guildId/setTimeoutDuration`
- `POST /guilds/:guildId/updateWhitelistedDomains`
- `POST /guilds/:guildId/updateWhitelistCheckChannels`
- `POST /guilds/:guildId/updateSecurityMode`
- `POST /guilds/:guildId/updateWhitelistViolentModeRole`
- `POST /guilds/:guildId/logs`
- `POST /guilds/:guildId/updateSimulationMode`

#### Message Parser
> Before you test this, make sure to enable simulation mode using `POST /guilds/:guildId/updateSimulationMode`

Create a list of whitelisted domains (`POST /guilds/:guildId/updateWhitelistedDomains`) and configure channels to scan (`POST /guilds/:guildId/updateWhitelistCheckChannels`).

Now send a message containing a url that's not whitelisted in one of the channels you added. Check `guild_logs` model to see if the action was logged - if yes; then message parser events are working fine.

You can try different modes by switching between `mild`/`violent` mode using `POST /guilds/:guildId/updateSecurityMode`; If you switch to `violent` mode, make sure to set `POST /guilds/:guildId/updateWhitelistViolentModeRole`.

--

### What's New?
- Logs
- Kicking users with suspicious names/nicknames

### What to test/How to test?

> Before testing, make sure you have tested and are running https://gitlab.com/nft-relay-group/functions/-/merge_requests/269

To test, make sure you don't have perms to delete messages (as any user with that perm is exempt from the name checks for being a staff member).

Now change your nickname/name to either `bot` (or any variation of that like `b0t`, `bOt`, etc) and try changing your name to seem similar to that of staff members (like `professor-decoder`, `professor decoder bot`, etc)

Check `guild_logs` to see if a new log was created - if so, then the bot part of assassin module is working fine.


#### Message Parser
> Before you test this, make sure to enable simulation mode using `POST /guilds/:guildId/updateSimulationMode`

Create a list of whitelisted domains (`POST /guilds/:guildId/updateWhitelistedDomains`) and configure channels to scan (`POST /guilds/:guildId/updateWhitelistCheckChannels`).

Now send a message containing a url that's not whitelisted in one of the channels you added. Check `guild_logs` model to see if the action was logged - if yes; then message parser events are working fine.

You can try different modes by switching between `mild`/`violent` mode using `POST /guilds/:guildId/updateSecurityMode`; If you switch to `violent` mode, make sure to set `POST /guilds/:guildId/updateWhitelistViolentModeRole`.

Feel free to mention me if you have any queries regarding any of the above stuff.


#### Testing the whale wallet bot

- If not set already, do /watch_wallet ...
- If not set already, go to the UI - Add DAO bots - Add - enable ME module - choose a wallet channel
- Run the discord-bots repo
- Make sure it says the "... checking whale wallets"
- List something on ME (or buy https://magiceden.io/marketplace/ousamadao)
- Make sure shows up in the channel, in under 2 minutes


---

# Testing Status

This file will be used for keeping track of all the stuff that's tested/untested.

### Tokens

-   `/token` Command ([Link](https://cdn.discordapp.com/attachments/951655764643168306/978365935813541889/chart.png))

    ![Screenshot for the command](https://cdn.discordapp.com/attachments/975811003554086933/978366148066312192/unknown.png)

    `/token` command is currently fully working and tested.

-   `/token_name` Command ([Link](https://cdn.discordapp.com/attachments/951655764643168306/978367103381934090/chart.png))

    ![Screenshot for the command](https://cdn.discordapp.com/attachments/975811003554086933/978367172185321502/unknown.png)

    `/token_name` command is currently fully working and tested.

### Fox Tokens

-   `GET /api/receiver/foxTokenAnalysis?doScrape=true` API Endpoint

    HTTP Client returns 200

    ![Screenshot of Thunder HTTP Client](https://cdn.discordapp.com/attachments/975811003554086933/978372132088217720/unknown.png)

    but logs show timeout.

    ![Screenshot of logs](https://cdn.discordapp.com/attachments/975811003554086933/978372210664300584/unknown.png)

    Timeout was set to 300s prior to testing that endpoint - yet that time is insufficient for the endpoint.
    `$env:FUNCTIONS_EMULATOR_TIMEOUT_SECONDS="300s"` (Windows Terminal)

-   `GET /api/receiver/alertTokenNames` API Endpoint

    HTTP Client returns 200
    ![Screenshot of Thunder HTTP Client](https://cdn.discordapp.com/attachments/975811003554086933/978373997991440464/unknown.png)

    Alerts were sent to discord:
    [Link to messages](https://discord.com/channels/739978662023135264/951666652691464202/978373015089856593)

    > A bug was encountered, `TypeError: Cannot read properties of undefined (reading 'token')`; and fixed.

### Token Alerts
Token alerts were tested on:

-   Test Vehn Dojo
-   Test Server

Test went without any issues on Test Vehn Dojo; Token alerts were only alerted once.

Tests on Server didn't post any alerts. This could be due to the fact that all tokens at the time of testing were already alerted. (And yes; the condition of `!process.env.TEST_VEHN_DOJO` was temporarily disabled while testing on test server)

> Further testing is recommended at a later point on a test server.

### Webhook
Token related webhooks are now properly displaying the charts
![Screenshot of webhook message](https://cdn.discordapp.com/attachments/975811003554086933/979483567652479036/unknown.png)

This was tested in Test Vehn Dojo
[Link to message](https://discord.com/channels/739978662023135264/951666652691464202/979482863433027594)



### 18) Seamless -if no bot in server functionality
case 1 :
- please select server which have no bot in the server when you are in /manageserver page
- now after you select one of that server you will be redirect to next screen where you can see Seamless - profile form.
- & at this page you will see one warning message that is " you can see limited form because no bot added in server "
- after fill all form fields and click on SUBMIT DAO PROFILE system will send one web hook message that you can see on your channel
 e.g : https://discord.com/channels/973441323250110465/973441323250110468

case 2:
- please select server which have  bot in the server when you are in /manageserver page
-  now after you select one of that server you will be redirect to next screen where you can see above things also works fine but with initiate seamless button under section "Seamless - new mint"
- when you click on INITIATE SEAMLESS you will be redirect to list of servers where you can select one or multiple servers.
- but for this test case you must select server which have no bot.
- after that you will be redirect to whitelist partnership form
- now in that form you can see there is field named "required role" in that you will textbox you must enter ID of role because there is no bot in the server if we choose server which has bot then you will see dropdown there.
- when you fill all the required details and submit system will send one web hook message that you can see on your channel
 e.g : https://discord.com/channels/973441323250110465/973441323250110468

### 18) Seamless - If no bot on the server - written another way
1) create a NEW Discord server
2) create a new role (admin) - give it admin perms (on very bottom) - give yourself this role
3) invite your ALT discord account to it
4) give your alt OWNERSHIP of it (go to member list)
5) go to seamless on your ALT (most of site should be locked down) - immediately click add - fill out your profile (include both required role things)
6) now log back on your main ... log on website ... you should see your old server (that you originally set seamless up with ) .. and your new server you just made -- click add on OLD server
7) click intiaite seamless
8) click on the NEW server (you can search for it)
9) make sure both required role fields filled out
10) fill out rest of the form
11) submit
12) claim whitelist

TODO: write up where the bot is in the target server, so you have a dropdown for required role
TODO: write up where the bos is NOT in the target server, so you have a input box and dropdown for required role

### Seamless - Approve option for Mod on initiated Seamless created by newly added server
- set your server's "initateApproved" value to "0"(fale) in guilds table.
This lets the app know your server hasn't initiated any Seamless yet.
- set other's role to "modRole" in constants
- go to /manageserver and add that server of yours, and then initiate a Seamless
- You can't see the created Seamless on /seamless page because it's not approved yet
- set your role to "modRole" in constants
- You can see now the created Seamless since you are Mod. Click on "Approve". It approves Seamless.
- If you logs in with other users, you can see that Seamless.

### Seamless - Initiate raffle-type Seamless
- go to /dao and add one of your servers
- go to "initiate seamless" and choose "raffle" for giveaway type. Submit it, then Enter the raffle
- now login with other users that have required roles in target server
- you can see the created Seamless and click on "enter raffle"
- Do this for several more users so that "users entered" can exceed "winning spots".
This can be tested by manually adding rows in whitelistClaims table directly.
ex. INSERT INTO whitelistClaims(id, createdAt, updatedAt, whitelist_id, user_id, state) VALUES('2b2e2668-ea75-4512-ad1e-8b83ec57d3d4', '2022-07-08 10:29:32', '2022-07-08 10:29:32', 'd501a370-3a55-4b8d-8673-ce3f76750083', '15dc1f47-05b5-4744-b679-1e23140ea139', 'REQUESTED')

- Modify "expiration date" value in whitelistPartnerships table to an already past date. This needs to be done because raffling can only occur after it is expired.
- Run "http://localhost:5001/nft-discord-relay/us-central1/api/raffleWhitelists" on your browser to simulate cron job
- Now for winners, roles are added to the discord. For failed users, they are removed from the claims table
- When you go to /seamless page, you can see notification and confetti in case you've won in the raffle.

### Seamless - Login with Twitter
- go to /seamless
- if you haven't logged in with Twitter yet, you can see "Twitter Login" button
- When you click on it, you will be redirected to Twitter login page
- After you authorize, you are redirected to /seamless page again. Now you can't see "Twitter Login" button anymore.
- If you check users table in DB, you will be able to see that relevant twitterId is added for you

### Seamless - Grouping cards that have same source server
- go to /manageserver
- create several seamless for same mint server with various expiration dates, twitter urls, images, etc.
- go to /seamless
- check if these created seamlesses are grouped into one card. Latest expiring seamless info is shown on this grouping card. On upper part, there is a label button that shows how many seamlesses are grouped into this card.
- at bottom area, there is an "Expand" button, which shows popup of grouped seamless cards. In case you've already claimed whitelist in this mint server, the button gets grayed out, but still clickable.

### Configure bot packages

 - when you enable or disable on module in server module page under the section configure bot packages at that time only once system will send one web hook message.

### testing of multiple server select for whitelist partnership form
- when you click on INITIATE WHITELIST you will be redirect to server list page where you can select one or multiple server
- if you want to select multiple right corner you will see select multiple click on that button
- you will see in all the server checkbox is appears you can select by enabling checkbox
- right corder you will see submit button then you will be redirect to whitelist partnership form
- for particular server max users and required roles must be entered and fill rest of the form
- after filled form you can click on submit button and boom multiple entries are saved successfully. you will be redirect to dao page.
- if one of the server has something wrong and doesn't save then you will be on same page with server that are not saved yet.
- If user role is "no Role" then user can submit only single white list if user try multiple at that time user redirect to home page
- if user already have required roll at then auto fill field required role and show a drop down to select role
- if user have no required role then its show a text input for required role id and required role name
- user initiate new whitelist then autofill form with past data that user previously added
- user now add with bot server then required role have drop down to select required role
- fixed bug edit whitelist when in path you can check server id as sourceId


### Magic eden package

 - When click on Add bots/ Seamless menu item it will navigate to BASE_URL/dao.
 - Click 'ADD' on your server below to fill out your profile.
 - There you can see new Magic eden package.
 - Test enbaling and disabling the Magic eden package.
 - Select the wallet watch channel after selecting channel it should send message to that channel and you can able to see the success popup.
 [Image_url](https://screenrec.com/share/CYXQ4i5g9m)
- TODO: above needs major revisions. Doesn't explain how to do things with the wallet watch (which Prof Decoder already wrote elsewhere). This is SUPPOSED To explain how to test the tomorrows-mints.


### Auto join a discord when user claim the whitelist with the source server in which he/she not joined.
- Create a new whitelist with the source server in which user who going to claim that whitelist is not joined.
- Make sure we are creating whitelist with proper data that we required to claim that whitelist i.e: required role, etc.
- Then Approve that source server from DB in guilds table to display that whitelist for claim.
- Then login with the user who going to claim that whitelist.
	- Here make sure user is not joined to the source server that he/she going to claim.
	- If he/she already joined that server then need to leave that server.
- Now Claim that whitelist and see that you are joined to that source server.

Note: Here make sure the user data we are getting from res.locale is for the user who try to cliam that whitelist then only our join server API works.
