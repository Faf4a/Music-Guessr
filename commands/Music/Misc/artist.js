module.exports = [{
    name: "artists",
    aliases: ["artist"],
    data: {
        category: "music",
        type: "everyone"
    },
    code: `
    $sendMessage[Searching for **$toLocaleUpperCase[$message]** across Spotify..
        {actionRow:{selectMenu:artist-info_$authorID:Pick your artist below:1:1:false:$nonEscape[$get[artists]]}}
    ;false]

    $onlyIf[$get[artists]!=none;Oops, I couldn't find any artists with that name! 😔 {reply:$messageID:true}]

    $let[artists;$searchArtist[$message]]

    $onlyIf[$message!=;🔎 I can't exactly __search for nothing__.. probably you should try providing a keyword for me to search for. {reply:$messageID:false}]

    $onlyIf[$djsEval[$getObjectProperty[guildData;settings.ignored_channels.text].includes("$channelID");true]==false;]
    $onlyIf[$djsEval[$getObjectProperty[guildData;settings.disabled_commands].includes("$commandName");true]==false;]
        
    $createObject[guildData;$getGuildVar[guild]]`
}, {
    type: "interaction",
    prototype: "selectMenu",
    code: `

    $interactionUpdate[;{newEmbed:
        {title:$getObjectProperty[artist-info;name]}
        {field:Genres:$toLocaleUpperCase[$getObjectProperty[artist-info;genres]]:true}
        {field:Followers:$numberSeparator[$getObjectProperty[artist-info;followers];,]:true}
        {field:Spotify Link:$getObjectProperty[artist-info;link]:false}
        {color:Random}
        {footer:Spotify Search}
        {thumbnail:$getObjectProperty[artist-info;image]}
    }]

    $createObject[artist-info;$getArtistInfo[$interactionData[values[0]]]]
    
    $onlyIf[$splitText[2]==$authorId;{newEmbed:{title:❌ Error}{description:You are not the author of this command!}{footer:Execute your own with \`m!artist <artist>\`}{color:Red}} {interaction} {ephemeral}]
    $onlyIf[$splitText[1]==artist-info]
    $textSplit[$interactionData[customId];_]`
}]