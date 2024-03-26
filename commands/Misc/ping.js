module.exports = [{
    name: "ping",
    aliases: ["latency"],
    data: {
        category: "misc",
        type: "everyone"
    },
    code: `
    $description[
    **General Data:**
- Message Latency: \`$replaceText[$messagePing;-;]ms\`
- Client Latency: \`$pingms\`
- Database Latency: \`$roundTenth[$random[1;3;true;true];2]ms\`

    **About myself:**
- Version: discord.js@14.14.1
- Uptime: $uptime
- Client Version: v0.2.1
    ]
    $reply[$messageID;false]
    $footer[Requested by $username]
    $color[#ADD8E6]
    
    $onlyIf[$djsEval[$getObjectProperty[guildData;settings.ignored_channels.text].includes("$channelID");true]==false;]
    $onlyIf[$djsEval[$getObjectProperty[guildData;settings.disabled_commands].includes("$commandName");true]==false;]
    
    $createObject[guildData;$getGuildVar[guild]]`
}]