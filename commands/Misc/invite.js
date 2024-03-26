module.exports = [{
    name: "invite",
    data: {
        category: "misc",
        type: "everyone"
    },
    code: `
    $title[Invite Me]
    $description[Feeling silly, huh? You can invite me via the link below.]
    $addField[https://discord.com/api/oauth2/authorize?client_id=1210011294845894717&scope=bot;** **]
    $reply[$messageID;false]
    $footer[Music Guessr]
    $color[#98FB98]

    $onlyIf[$djsEval[$getObjectProperty[guildData;settings.ignored_channels.text].includes("$channelID");true]==false;]
    $onlyIf[$djsEval[$getObjectProperty[guildData;settings.disabled_commands].includes("$commandName");true]==false;]
    
    $createObject[guildData;$getGuildVar[guild]]
    `
}]