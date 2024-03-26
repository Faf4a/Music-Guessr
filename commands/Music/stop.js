module.exports = [{
    name: "stop",
    aliases: ["leave"],
    data: {
        category: "music",
        type: "everyone"
    },
    code: `

    $sendMessage[Alright folks, I'm taking my leave. {newEmbed:{description:Ended the game and left the Voice Channel.}{color:#89CFF0}};true]
    $setGuildVar[guild;$getObject[guildData]]

    $leaveVC[$guildID]

    $setObjectProperty[guildData;voiceID;"$voiceID"]
    $setObjectProperty[guildData;playing;false]
    $setObjectProperty[guildData;guessed;false]
    $setObjectProperty[guildData;artist;"null"]
    
    $onlyIf[$hasPlayer==true;]
    $onlyIf[$getObjectProperty[guildData;playing]==true;{newEmbed:{title:❌ Error}{description:There is no game going on currently. Instead you can start one using \`m!guess\`!}{color:Red}} {reply:$messageId:false}]

    $onlyIf[$djsEval[$getObjectProperty[guildData;settings.ignored_channels.text].includes("$channelID");true]==false;]
    $onlyIf[$djsEval[$getObjectProperty[guildData;settings.disabled_commands].includes("$commandName");true]==false;]
        
    $createObject[guildData;$getGuildVar[guild]]`
}]