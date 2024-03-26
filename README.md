# Music Guessr

Music Guessr is a Discord bot built with JavaScript and powered by [aoi.js](https://github.com/AkaruiDevelopment/aoi.js) and [@akarui/aoi.music](https://github.com/faf4a/aoi.music). The bot plays a game where it plays a song and users have to guess the track name.

This bot was created for the NTTS Hackaton as a 'fun little project'. I didn't end up finishing within the timeframe though / didn't feel like submitting it.

> This bot is intended to run on v6.8 (github version) of aoi.js
> (And a custom fork of aoi.music.)
## Getting Started

To get started with this project, you need to have Node.js and npm installed on your machine. Clone the repository and install the dependencies using npm:

```sh
git clone https://github.com/faf4a/music-guessr.git
cd music-guessr
npm install
```

## Spotify Client

This bot requires a Spotify client to function. Follow these steps to get a Spotify client:

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications).
2. Log in with your Spotify account.
3. Click on 'Create an App'.
4. Fill in the necessary details and click 'Create'.
5. After creating the app, you will get a Client ID and a Client Secret.

Add these to the [`.env`](command:_github.copilot.openRelativePath?%5B%22.env%22%5D ".env") file in the root of the project as `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` respectively.

## Discord Bot Token

You also need a Discord bot token to run this bot:

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Click on 'New Application' and give it a name.
3. Go to the 'Bot' tab and click 'Add Bot'.
4. Under the 'Token' section, click 'Copy' to get your bot token.

Add this token to the `.env` file as `DISCORD_TOKEN`.

## Running the Bot

To run the bot, use the following command:

```sh
node index.js
```