/*
---

You require a spotify client to use this bot, otherwise everything will be broken.

To get a spotify client, go to https://developer.spotify.com/dashboard/applications and create a new app.

After creating the app, you will get a client id and a client secret. Add these to the .env file as SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET respectively.

---
*/

require("dotenv").config();
const fs = require("node:fs");

const { AoiClient, LoadCommands } = require("aoi.js");
const { AoiVoice, PluginName, Cacher, Filter, PlayerEvents } = require("@akarui/aoi.music");

const client = new AoiClient({
  token: process.env.DISCORD_TOKEN, // edit the .env file to add your bot token
  prefix: "m!",
  intents: ["Guilds", "GuildMessages", "MessageContent", "GuildVoiceStates"],
  events: ["onMessage", "onInteractionCreate", "onVoiceStateUpdate"],
  suppressAllErrors: true,
  database: {
    type: "aoi.db",
    db: require("@akarui/aoi.db"),
    dbType: "KeyValue",
    tables: ["main"],
    securityKey: "this-is-a-32-character-long-strng",
  },
});

//create voice client
const voice = new AoiVoice(client, {
  searchOptions: {
    youtubeAuth: "./auth.json",
    youtubegl: "US",
    spotifyAuth: {
      clientId: process.env.SPOTIFY_CLIENT_ID, // edit the .env file to add your spotify client id
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET, // edit the .env file to add your spotify client secret
    },
  },
  requestOptions: {
    offsetTimeout: 125,
  },
});

voice.addPlugin(PluginName.Cacher, new Cacher("disk"));
voice.addPlugin(
  PluginName.Filter,
  new Filter({
    filterFromStart: false,
  })
);

voice.addEvent(PlayerEvents.TrackEnd);
voice.bindExecutor(client.functionManager.interpreter);

// load commands and voice events
const loader = new LoadCommands(client);
loader.load(voice.cmds, "./voice");
loader.load(client.cmd, "./commands");

// var system
client.variables({
  player: {
    played: 0,
    guessed: 0,
    skipped: 0,
    interaction: "null"
  },
  guild: {
    settings: {
      ignored_channels: {
        voice: [],
        text: [],
      },
      disabled_commands: [],
      manager_roles: [],
    },
    playing: false,
    guessed: false,
    artist: "null",
    genre: "random",
    voiceID: "null"
  },
  track: {}
})

// create custom functions
const customFunctions = fs.readdirSync("./functions");
customFunctions.forEach((file) => {
  require(`./functions/${file}`)(client);
});
