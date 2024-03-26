module.exports = [{
    name: "$alwaysExecute",
    data: {
        category: "guessr",
        type: "exclude"
    },
    code: `
    $setGuildVar[guild;$getObject[guildData]]
    $setObjectProperty[guildData;guessed;false]

    $ifAwaited[$getObjectProperty[guildData;artist]!=null;{execute:guess-artist};{execute:guess-genre}]
    $ifAwaited[$hasPlayer==false;{execute:join-vc};{execute:skip-track}]
    $ifAwaited[$voiceID[$clientID]==;{execute:join-vc};{execute:skip-track}]

    $setGlobalUserVar[player;$getObject[userData]]
    $setObjectProperty[userData;guessed;$sum[$getObjectProperty[userData;guessed];1]]

    $c[making sure the event doesnt execute]
    $setGuildVar[guild;$getObject[guildData]]
    $setObjectProperty[guildData;guessed;true]

    $c[Returning win message]
    $reply
    $title[Guess the song]
    $description[The song was **$getObjectProperty[trackData;title]** by **$getObjectProperty[trackData;artist]**!]
    $addField[$getObjectProperty[trackData;link];** **]
    $footer[Next song is upcoming.. to stop the game use \`m!stop\` or \`m!leave\`!]
    $color[#98FB98]
    $addCmdReactions[✅]

    $c[Checking if the message matches the song title (allows small typos and capitalization)]
    $onlyIf[$djsEval[
        const stringSimilarity = require("string-similarity");

        try {
        (async () => {
            const songTitle = "$getObjectProperty[trackData;title]".replace(/[^a-z0-9]/gi, "").toLowerCase();
            const userMessage = "$message".replace(/[^a-z0-9]/gi, "").toLowerCase();
        
            const similarity = stringSimilarity.compareTwoStrings(songTitle, userMessage);
                        
            return similarity > 0.85;
        })();
        } catch (e) {};
    ;true]==true;]

    $c[Checking if user is in the same Voice Channel as the Bot]
    $onlyIf[$voiceID[$clientID]==$voiceID[$authorID];]

    $c[Checking if bot is in Voice Channel]
    $onlyIf[$voiceID[$clientID]!=;]

    $c[Checking if a game is going on]
    $onlyIf[$getObjectProperty[guildData;playing]==true;]

    $c[Creating objects]
    $createObject[trackData;$getGuildVar[track]]
    $createObject[userData;$getGlobalUserVar[player]]
    $createObject[guildData;$getGuildVar[guild]]
    `
}, {
    name: "guess-artist",
    type: "awaited",
    data: {
        category: "guessr",
        type: "exclude"
    },
    code: `
    $c[Debugging (dont forget to comment out)]
    $log[$getObjectProperty[trackDataNew;title]]

    $setGuildVar[track;$getObject[trackDataNew]]

    $playTrack[$getObjectProperty[trackDataNew;preview];url]

    $createObject[trackDataNew;$randomArtistTrack[$getObjectProperty[guildData;artist];$getObjectProperty[trackData;title]]]
`
}, {
    name: "guess-genre",
    type: "awaited",
    data: {
        category: "guessr",
        type: "exclude"
    },
    code: `
    $c[Debugging (dont forget to comment out)]
    $log[$getObjectProperty[trackDataNew;title]]

    $setGuildVar[track;$getObject[trackDataNew]]

    $playTrack[$getObjectProperty[trackDataNew;preview];url]

    $createObject[trackDataNew;$randomTrack[$getObjectProperty[guildData;genre]]]
`
}, {
    name: "join-vc",
    type: "awaited",
    data: {
        category: "guessr",
        type: "exclude"
    },
    code: `
    $c[Joining VC]
    $joinVC[$getObjectProperty[guildData;voiceID]]
    $wait[2s]
    `
}, {
    name: "skip-track",
    type: "awaited",
    data: {
        category: "guessr",
        type: "exclude"
    },
    code: `
    $c[Skipping track]
    $skipTrack
    `
}]

