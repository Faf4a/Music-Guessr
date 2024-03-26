module.exports = (client) => {
  client.functionManager.createFunction({
    name: "$randomTrack",
    type: "djs",
    code: async (d) => {
      const data = d.util.aoiFunc(d);

      const [
        genre = "none",
        market = "random",
        decade = "2020",
        excludeExplicit = "false",
        english = "true",
      ] = data.inside.splits;

      let result;
      do {
        const response = await fetch(
          `https://europe-west1-randommusicgenerator-34646.cloudfunctions.net/app/getRandomTrack?genre=${genre}&market=${market}&decade=${decade}&tag_new=false&exclude_singles=false`
        );
        result = await response.json();
      } while (
        result.tracks[0].preview_url === null ||
        (excludeExplicit && result.tracks[0].explicit) ||
        ["piano", "lofi", "lo-fi", "beats"].some((g) =>
          result.genres.some((rg) => rg.includes(g))
        ) ||
        (english &&
          /[^a-z0-9\s()\[\]~`"':&$%§,.!?-]/i.test(result.tracks[0].name))
      );

      function sanitize(value) {
        if (typeof value === "string") {
          return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
        }
        return value;
      }

      data.result = JSON.stringify(
        {
          preview: sanitize(result.tracks[0].preview_url),
          title: sanitize(result.name.split(/[-\/\[\(]/)[0].trim()),
          link: sanitize(result.link),
          image: sanitize(result.image),
          duration: sanitize(result.duration_ms),
          explicit: sanitize(result.explicit),
          artist: sanitize(
            result.artists.map((artist) => artist.name).join(", ")
          ),
          data: {
            genre: sanitize(genre),
            market: sanitize(market),
            decade: sanitize(decade),
          },
        },
        null,
        2
      );

      return {
        code: d.util.setCode(data),
        result: result,
      };
    },
  });
};
