module.exports = (client) => {
    client.functionManager.createFunction({
        name: "$getArtistInfo",
        type: "djs",
        code: async (d) => {
            const data = d.util.aoiFunc(d);

            const [artist] = data.inside.splits;

            const artistResponse = await fetch(
                `https://api.spotify.com/v1/search?q=${artist}&type=artist`,
                {
                    method: "GET",
                    headers: {
                        Authorization:
                            "Bearer " +
                            client.voiceManager.spotifyApi._credentials.accessToken,
                    },
                }
            );

            const artistData = await artistResponse.json();
            const artistInfo = artistData.artists.items[0];

            function sanitize(value) {
                if (typeof value === "string") {
                    return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
                }
                return value;
            }

            data.result = JSON.stringify(
                {
                    name: sanitize(artistInfo.name),
                    link: sanitize(artistInfo.external_urls?.spotify),
                    image: sanitize(artistInfo.images[0]?.url) ?? "https://cdn.discordapp.com/embed/avatars/1.png",
                    followers: sanitize(artistInfo.followers?.total),
                    genres: sanitize(artistInfo.genres?.join(", ")) ?? "none",
                    popularity: sanitize(artistInfo.popularity),
                },
                null,
                2
            );

            return {
                code: d.util.setCode(data),
            };
        },
    });
};