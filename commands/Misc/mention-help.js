module.exports = [{
    name: "<@1210011294845894717>",
    aliases: ["<@!1210011294845894717>"],
    nonPrefixed: true,
    data: {
        category: "misc",
        type: "everyone"
    },
    code: `
    $title[Music Guessr]
    $description[Music Guessr is a music guessing game based on the Spotify. The bot will play a song and you have to guess the artist of the song.
    
    This bot was made for the [NTTS Hackathon](https://discord.gg/ntts) as a fun little project.]
    $addField[You can view my commands with the \`m!help\` commands.;** **]
    $reply[$messageID;true]
    $addTimeStamp
    $footer[Music Guessr]
    $color[#98FB98]

    $onlyIf[$djsEval[$getObjectProperty[guildData;settings.ignored_channels.text].includes("$channelID");true]==false;]
    $onlyIf[$djsEval[$getObjectProperty[guildData;settings.disabled_commands].includes("$commandName");true]==false;]
    
    $createObject[guildData;$getGuildVar[guild]]
    `
}]