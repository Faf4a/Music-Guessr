module.exports = [{
    name: "disconnect",
    type: "voiceStateUpdate",
    data: {
        category: "guessr",
        type: "exclude"
    },
    channel: "$channelID",
    code: `
    $channelSendMessage[$getObjectProperty[guildData;lastChannel];{newEmbed:{title:🔇 Disconnected}{description:I just somehow disconnected! I automatically reconnected, if you wish me to leave use the \`m!stop\` or \`m!leave\` command!}{footer:I notified my developer about this for debugging purposes, if you manually disconnected me then my Developer won't be notified.}{color:#FFA500}}]

    $onlyIf[$getObjectProperty[guildData;playing]==true]
    $onlyIf[$newState[channelId]==]
    $onlyIf[$oldState[id]==$authorID]
    $onlyIf[$hasPlayer==true;]

    $onlyIf[$getTextSplitLength!=1;]
    $textSplit[$usersInChannel[$oldState[channelId];id;,];,]

    $createObject[guildData;$getGuildVar[guild]]`
},{
    type: "voiceStateUpdate",
    data: {
        category: "guessr",
        type: "exclude"
    },
    channel: "$channelID",
    code: `
    $channelSendMessage[$getObjectProperty[guildData;lastChannel];{newEmbed:{title:🔇 Disconnected}{description:I left the Voice Channel due to every user of this channel leaving. You can start a new game with \`m!guess\`, happy guessing!}{color:#FF6347}}]

    $setGuildVar[guild;$getObject[guildData]]

    $leaveVC[$oldState[guildId]]

    $setObjectProperty[guildData;voiceID;"$voiceID"]
    $setObjectProperty[guildData;playing;false]
    $setObjectProperty[guildData;guessed;false]
    $setObjectProperty[guildData;artist;"null"]

    $onlyIf[$getTextSplitLength==1;]
    $textSplit[$usersInChannel[$oldState[channelId];id;,];,]

    $onlyIf[$oldState[channelId]!=;]
    $onlyIf[$getObjectProperty[guildData;playing]==true]
    $onlyIf[$hasPlayer==true;]
    
    $createObject[guildData;$getGuildVar[guild]]`
}]