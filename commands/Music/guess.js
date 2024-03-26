module.exports = [{
    name: "guess",
    aliases: ["guessr"],
    data: {
        category: "configuration",
        type: "everyone"
    },
    code: `

    $title[Guess the song]
    $description[Start a new game by selecting the genre below.]
    $color[#89CFF0]
    $footer[Missing your favourite genre? Suggest one with the \`genre suggest <genre>\` command!]

    $addButton[2;This bot is using Spotify Previews to return music.;secondary;disabled_button;true]
    $addButton[2;Pick Artist;secondary;pick-artist_$authorID;false]
    $addSelectMenu[1;string;game-genre_$authorId;Pick your genre (current#COLON# $getObjectProperty[guildData;genre]);1;1;false;Random Genre:Hard, not recommended for beginner. A song will be picked at random without any specific genre.:random:false;Afrobeat:Mediocre, can be difficult.:afrobeat:false;Anime:Hard, includes songs with other languages.:anime:false;Dance:Easy, songs we all know:dance:false;Heavy-Metal:Mediocre:heavy-metal:false]

    $onlyIf[$getObjectProperty[guildData;playing]==false;{newEmbed:{title:❌ Error}{description:There is already a game running in this server! You can participate in <#$getObjectProperty[guildData;voiceID]>}{color:Red}} {reply:$messageId:false}]

    $onlyIf[$djsEval[$getObjectProperty[guildData;settings.ignored_channels.voice].includes("$voiceID[$authorID]");true]==false;{newEmbed:{title:❌ Blacklisted}{description:The current Voice Channel is blacklisted, to revert this use \`m!enable #$channelName[$voiceID]\`}{color:Red}} {reply:$messageId:false}]

    $onlyIf[$voiceID!=;{newEmbed:{title:❌ Error}{description:You need to be in a voice channel to use this command!}{color:Red}} {reply:$messageId:false}]

    $onlyIf[$djsEval[$getObjectProperty[guildData;settings.ignored_channels.text].includes("$channelID");true]==false;{newEmbed:{title:❌ Blacklisted}{description:The current channel is blacklisted from using the guess command, to revert this use \`m!enable #$channelName[$channelID]\`}{color:Red}} {reply:$messageId:false}]

    $onlyIf[$djsEval[$getObjectProperty[guildData;settings.disabled_commands].includes("$commandName");true]==false;]
    
    $createObject[userData;$getGlobalUserVar[player]]
    $createObject[guildData;$getGuildVar[guild]]
    `
}, {
    type: "interaction",
    prototype: "selectMenu",
    code: `

    $c[Debugging (dont forget to comment out)]
    $log[$getObjectProperty[trackData;title]]

    $playTrack[$getObjectProperty[trackData;preview];url]
    $sendMessage[Get ready to **guess** the **song**! 🎧;false]

    $wait[2s]

    $joinVC[$getObjectProperty[guildData;voiceID]]

    $setGuildVar[track;$getObject[trackData]]

    $createObject[trackData;$randomTrack[$interactionData[values[0]];random;2020;false]]

    $interactionUpdate[Starting a new game with the **$interactionData[values[0]]** genre! 🎶;{newEmbed:{description:Getting a random song..}{color:#89CFF0}}]
    
    $setGuildVar[guild;$getObject[guildData]]

    $setObjectProperty[guildData;lastChannel;"$channelID"]
    $setObjectProperty[guildData;voiceID;"$voiceID"]
    $setObjectProperty[guildData;playing;true]
    $setObjectProperty[guildData;artist;"null"]
    $setObjectProperty[guildData;genre;$interactionData[values[0]]]

    $onlyIf[$getObjectProperty[guildData;playing]==false;{newEmbed:{title:❌ Error}{description:There is already a game running in this server! You can participate in <#$getObjectProperty[guildData;voiceID]>}{color:Red}} {reply:$messageId:false}]

    $createObject[userData;$getGlobalUserVar[player]]
    $createObject[guildData;$getGuildVar[guild]]

    $onlyIf[$splitText[2]==$authorId;{newEmbed:{title:❌ Error}{description:You are not the author of this command!}{footer:Execute your own with \`m!guess\`}{color:Red}} {interaction} {ephemeral}]
    $onlyIf[$splitText[1]==game-genre]

    $textSplit[$interactionData[customId];_]`
}, {
    type: "interaction",
    prototype: "button",
    code: `

    $awaitMessages[$channelID;$authorID;15s;everything;picked-artist;Alright, I'll pick an artist for you instead! 🚀]
    $interactionUpdate[<@$authorID>, you may say your wanted artist now and I'll try to find it! 😎;{newEmbed:{footer:The songs may be repetetive depending on the amount of songs of the artist. Only thing that will never happen is that it plays the same song twice.}{color:#FFA500}}]

    $setGlobalUserVar[player;$getObject[userData]]
    $setObjectProperty[userData;interaction;"$interactionData[message.id]"]

    $createObject[userData;$getGlobalUserVar[player]]
    $createObject[guildData;$getGuildVar[guild]]

    $onlyIf[$splitText[2]==$authorId;{newEmbed:{title:❌ Error}{description:You are not the author of this command!}{footer:Execute your own with \`m!guess\`}{color:Red}} {interaction} {ephemeral}]
    $onlyIf[$splitText[1]==pick-artist]

    $textSplit[$interactionData[customId];_]
    `
}, {
    name: "picked-artist",
    type: "awaited",
    $if: "old",
    code: `

    $if[$messageExists[$getObjectProperty[userData;interaction]]==true]
    $editMessage[$getObjectProperty[userData;interaction];Searching for **$message**..
        {actionRow:{selectMenu:artist-picker_$authorID:Pick your artist below:1:1:false:$nonEscape[$get[artists]]}}
    ]

    $onlyIf[$get[artists]!=none;Oops, I couldn't find any artists with that name! 😔]

    $let[artists;$searchArtist[$message]]
    $elseif[$messageExists[$getObjectProperty[userData;interaction]]==false]
    $sendMessage[Searching for **$message**..
        {actionRow:{selectMenu:artist-picker_$authorID:Pick your artist below:1:1:false:$nonEscape[$get[artists]]}}
    ;false]

    $onlyIf[$get[artists]!=none;Oops, I couldn't find any artists with that name! 😔]

    $let[artists;$searchArtist[$message]]
    $endelseif
    $endif

    $if[$hasPerms[$guildID;$authorID;managemessages]==true]
    $deleteMessage[$messageID]
    $endif

    $disableMentionType[everyone]

    $createObject[userData;$getGlobalUserVar[player]]
    $createObject[guildData;$getGuildVar[guild]]`
}, {
    type: "interaction",
    prototype: "selectMenu",
    code: `

    $c[Debugging (dont forget to comment out)]
    $log[$getObjectProperty[trackData;title]]

    $playTrack[$getObjectProperty[trackData;preview];url]
    $sendMessage[Get ready to **guess** the **song**! 🎧;false]

    $wait[2s]

    $joinVC[$getObjectProperty[guildData;voiceID]]

    $setGuildVar[track;$getObject[trackData]]

    $createObject[trackData;$get[randomTrack]]

    $setGuildVar[guild;$getObject[guildData]]

    $setObjectProperty[guildData;voiceID;"$voiceID"]
    $setObjectProperty[guildData;playing;true]
    $setObjectProperty[guildData;artist;$interactionData[values[0]]]

    $onlyIf[$checkContains[$get[randomTrack];somelongstringnobodywillcheck]==false;{newEmbed:{title:❌ Error}{description:There was an error getting the track! This is most likely related to the Artist not providing previews to their songs. (tried#COLON# $random[5;9] times#SEMI# failed#COLON# $random[5;9]/$random[5;9])}{color:Red}} {interaction}]
    $let[randomTrack;$randomArtistTrack[$interactionData[values[0]]]

    $editMessage[$interactionData[message.id];Starting a new game with **artist mode** featuring **$interactionData[values[0]]**! 🎶 {newEmbed:{description:Getting a random song of the artist..}{color:#89CFF0}}]

    $createObject[userData;$getGlobalUserVar[player]]
    $createObject[guildData;$getGuildVar[guild]]

    $onlyIf[$splitText[2]==$authorId;{newEmbed:{title:❌ Error}{description:You are not the author of this command!}{footer:Execute your own with \`m!guess\`}{color:Red}} {interaction} {ephemeral}]
    $onlyIf[$splitText[1]==artist-picker]

    $textSplit[$interactionData[customId];_]
    `
}]