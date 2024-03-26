module.exports = [{
    name: "disable",
    data: {
        category: "configuration",
        type: "exclude"
    },
    $if: "old",
    code: `
    $if[$djsEval[Array.from(client.cmd.default.filter(x => x.data.type !== "exclude").map(x => x.name).values()).includes("$message[1]");true]==true]

    Disabled the \`$message[1]\` command server-wide.

    $disableMentionType[everyone]

    $setGuildVar[guild;$getObject[guildData]]
    $setObjectProperty[guildData;settings.disabled_commands;$djsEval[let arr = $getObjectProperty[guildData;settings.disabled_commands]; arr.push("$message[1]"); arr;true]]

    $createObject[guildData;$getGuildVar[guild]]

    $else

    Disabled the usage of commands in <#$findChannel[$message;true]>.

    $disableMentionType[everyone]

    $setGuildVar[guild;$getObject[guildData]]
    $setObjectProperty[guildData;settings.ignored_channels.$channelType[$findChannel[$message;true]];$djsEval[let arr = $getObjectProperty[guildData;settings.ignored_channels.$channelType[$findChannel[$message;true]]]; arr.push("$findChannel[$message;true]"); arr;true]]

    $createObject[guildData;$getGuildVar[guild]]

    $onlyIf[$channelType[$findChannel[$message;false]]==voice||$channelType[$findChannel[$message;false]]==text;{newEmbed:{title:❌ Error}{description:You either have to provide a channel or command to enable / disable.}{field:Usage:
- The provided channel may only be of the type **\`TextChannel\`** or **\`VoiceChannel\`**.

- \`m!disable #$channelName\` to disable commands in a specific channel.     
- \`m!disable <command>\` to disable a specific command.}{color:Red}} {reply:$messageId:false}]
        
    $onlyIf[$findChannel[$message;false]!=;{newEmbed:{title:❌ Error}{description:You either have to provide a channel or command to enable / disable.}{field:Usage:
- The provided channel may only be of the type **\`TextChannel\`** or **\`VoiceChannel\`**.

- \`m!disable #$channelName\` to disable commands in a specific channel.
- \`m!disable <command>\` to disable a specific command.}{color:Red}} {reply:$messageId:false}]

    $endif

    $onlyIf[$hasPerms[$guildID;$authorID;manageguild]==true;{newEmbed:{title:❌ Error}{description:You require **\`ManageGuild\`** permissions to manage commands.}{color:Red}} {reply:$messageId:false}]
    `
}]