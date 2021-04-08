const fs = require("fs");
var CronJob = require('cron').CronJob;
const express = require('express');

const app = express();

//read the config and assign the port and endpoint
const config = JSON.parse(fs.readFileSync('./config.json'));
const port = config.port;
const endpoint = config.endpoint;

//assign the modules that we need for authentication and to get the data
const Stream = require("./modules/getStreams.js");
const Auth = require("./modules/auth.js");
const Channel = require("./modules/channelData.js");

//define the api endpoint
app.get(endpoint, (req, res) => {
    const cachedData = fs.readFileSync('./cache.json');
    if (!cachedData) return;
    res.end(cachedData);
});

//listen on the defined port
app.listen(port, () => {
    UpdateAuthConfig();
    console.log(`app listening at http://localhost:${port}${endpoint}`);
});

//This is the function that will loop trough every streamer and push their data to the cache.json file
var Check = new CronJob(config.cron, async function () {
    const tempData = JSON.parse(fs.readFileSync('./config.json'));

    var cache = await Promise.all(tempData.channels.map(async function (chan, i) {
        let StreamData = await Stream.getData(chan, tempData.twitch_clientID, tempData.authToken);
        let Channeldata = await Channel.getData(chan, tempData.twitch_clientID, tempData.authToken);
        let returnData;

        StreamData = StreamData.data[0]

        //return error when the assigned streamer does not exist
        if (!Channeldata) return {
            "streamerName": chan,
            "title": false,
            "game": false,
            "viewers": false,
            "is_live": false,
            "startedAt": false,
            "language": false,
            "tags": [],
            "errors": [{ "error": "This user does not exist" }]
        };

        //is the user is live return the livestream data
        if (StreamData) {
            returnData = {
                "streamerName": StreamData.user_name,
                "title": StreamData.title,
                "game": StreamData.game_name,
                "viewers": StreamData.viewer_count,
                "is_live": Channeldata.is_live,
                "startedAt": StreamData.started_at,
                "language": StreamData.language,
                "tags": StreamData.tag_ids,
                "errors": []
            };
        } else {
            //else we return the normal channel data
            returnData = {
                "streamerName": Channeldata.display_name,
                "title": Channeldata.title,
                "game": false,
                "viewers": false,
                "is_live": Channeldata.is_live,
                "startedAt": Channeldata.started_at,
                "language": Channeldata.broadcaster_language,
                "tags": Channeldata.tag_ids,
                "errors": []
            };
        };

        //push the object to the cache array
        return returnData;
    }))

    //replace the old cache with the new data
    fs.writeFileSync('./cache.json', JSON.stringify(cache));
});

//update the authorization key every hour
var updateAuth = new CronJob('0 * * * *', async function () {
    UpdateAuthConfig();
});

//get a new authorization key and update the config
async function UpdateAuthConfig() {
    let tempData = JSON.parse(fs.readFileSync('./config.json'));

    //get the auth key
    const authKey = await Auth.getKey(tempData.twitch_clientID, tempData.twitch_secret);
    if (!authKey) return;

    //write the new auth key
    var tempConfig = JSON.parse(fs.readFileSync('./config.json'));
    tempConfig.authToken = authKey;
    fs.writeFileSync('./config.json', JSON.stringify(tempConfig));
}

//start the timers
updateAuth.start();
Check.start();