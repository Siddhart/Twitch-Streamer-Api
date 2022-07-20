# Twitch Streamer Api
This is a Twitch data api which will automatically update and cache the streamer data. Check out a live demo on [live.ratexindex.com](https://live.ratexindex.com).

# How does it work?
The api uses the official Twitch api to get the streamer data. You will have to create a new application in the [Twitch developer console](https://dev.twitch.tv/console).

# Installation
First you will have to clone the project.
```console
$ git clone https://github.com/Siddhart/Twitch-Streamer-Api
```

After that open the config.json file
```console
{
    "twitch_clientID": "TWITCH_CLIENT_ID",
    "twitch_secret": "TWITCH_SECRET",
    "cron": "*/10 * * * *",
    "port": 8088,
    "endpoint": "/StreamerData",
    "authToken": "",
    "channels": []
}
```
## Edit Config.json
- twitch_clientID - Enter the Twitch application client ID here ([Twitch Developer Console](https://dev.twitch.tv/console/apps)).
- twitch_secret - Generate a api token on the Twitch application page.
- cron - Enter your Update/check interval here ([Cron Guru](https://crontab.guru/)) (this is also the data cache interval).
- port - Enter the port you want the api to be hosted on.
- endpoint - Enter the endpoint for the api.

NOTE: Do NOT change the authToken field. This value will automatically update.

## Add streamers
In the config.json there is a channels array. If you want to add streamers you just add new strings to the array.
```console
"channels": ["streamer1", "streamer2", "streamer3"]
```

## Dependencies
In order for the bot to work properly you will have to install express, cron and request. Use the following command to install the dependencies.
```console
$ npm install cron request express
```

## Run the script
After you updated the config.json and installed the dependencies you can run the final command.
Use the command in the same directory as the index.js file.
```console
$ node index.js
```

Congratulations! You have successfully setup the Twitch Streamer Data Api.
If there are any errors please send me a dm on Discord
Siddhartt#2194
