module.exports = (client) => {
  client.functionManager.createFunction({
    name: "$searchArtist",
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

      function sanitize(value) {
        if (typeof value === "string") {
          return value.replace(/[:]/g, " ").replace(/[;]/g, " ");
        }
        return value;
      }

      const artistData = await artistResponse.json();

      const artists =
        artistData.artists?.items
          .reduce((unique, artist) => {
            if (!unique.find((obj) => obj.name === artist.name)) {
              unique.push(artist);
            }
            return unique;
          }, [])
          .slice(0, 10)
          .map((artist) => {
            return `{stringInput:${sanitize(artist.name)}:${sanitize(
              artist.name
            )}:${sanitize(artist.genres?.join(", "))}}`;
          }) ?? "none";

      data.result = artists;

      return {
        code: d.util.setCode(data),
      };
    },
  });
};
