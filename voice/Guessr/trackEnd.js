module.exports = [{
    name: "trackEnd",
    type: "trackEnd",
    channel: "$channelId",
    code: `
    $ifAwaited[$getObjectProperty[guildData;artist]!=null;{execute:guess-artist};{execute:guess-genre}]
    $ifAwaited[$hasPlayer==false;{execute:join-vc};{execute:skip-track}]
    $ifAwaited[$voiceID[$clientID]==;{execute:join-vc};{execute:skip-track}]

    $setGuildVar[guild;$getObject[guildData]]
    
    $c[Returning next message]
    $title[Nobody guessed it..]
    $description[The song was **$getObjectProperty[trackData;title]** by **$getObjectProperty[trackData;artist]**!]
    $addField[$getObjectProperty[trackData;link];** **]
    $footer[Next song is upcoming.. to stop the game use \`m!stop\` or \`m!leave\`!]
    $color[#98FB98]

    $setObjectProperty[guildData;lastChannel;"$channelID"]
    $setObjectProperty[guildData;guessed;false]
    
    $onlyIf[$getObjectProperty[guildData;guessed]==false;]
    $createObject[guildData;$getGuildVar[guild]]
    $createObject[trackData;$getGuildVar[track]]
    $createObject[userData;$getGlobalUserVar[player]]

    $onlyIf[$hasPlayer==true]
    $onlyIf[$voiceID[$clientID]!=;]
    `
}]