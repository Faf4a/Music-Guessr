module.exports = [{
    name: "help",
    data: {
        category: "misc",
        type: "everyone"
    },
    code: `
    $title[Music Guessr]
    $description[Music Guessr is a music guessing game based on the Spotify. The bot will play a song and you have to guess the artist of the song.
    
    This bot was made for the [NTTS Hackathon](https://discord.gg/ntts) as a fun little project.]
    $addField[Commands;
        \`m!guess\` - Start a game
        \`m!stop\` - Stop the game
        \`m!help\` - Show this message
        \`m!invite\` - Invite the bot to your server
        \`m!ping\` - Check the bot's ping
        \`m!genre\` - Suggest and or view information about a genre
        \`m!enable\` - Enable commands within a channel / enable commands server-wide.
        \`m!disable\` - Disable commands within a channel / disable commands server-wide.
    ]
    $addTimeStamp
    $reply[$messageID;false]
    $footer[Music Guessr]
    $color[#98FB98]

    $onlyIf[$djsEval[$getObjectProperty[guildData;settings.ignored_channels.text].includes("$channelID");true]==false;{newEmbed:{title:❌ Blacklisted}{description:The current channel is blacklisted from using the help command, to revert this use \`m!enable #$channelName[$channelID]\`}{color:Red}} {reply:$messageId:false}]

    $onlyIf[$djsEval[$getObjectProperty[guildData;settings.disabled_commands].includes("$commandName");true]==false;]
    
    $createObject[guildData;$getGuildVar[guild]]
    `
}]