module.exports = (client) => {
  client.functionManager.createFunction({
    name: "$randomArtistTrack",
    type: "djs",
    code: async (d) => {
      const data = d.util.aoiFunc(d);

      const [artist, prev = "null"] = data.inside.splits;

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
      const artistId = artistData.artists.items[0].id;

      const albumsResponse = await fetch(
        `https://api.spotify.com/v1/artists/${artistId}/albums?limit=10`,
        {
          method: "GET",
          headers: {
            Authorization:
              "Bearer " +
              client.voiceManager.spotifyApi._credentials.accessToken,
          },
        }
      );

      const albumsData = await albumsResponse.json();

      let tracks = [];
      for (let i = 0; i < albumsData.items.length; i += 5) {
        const batch = albumsData.items.slice(i, i + 5);
        const promises = batch.map((album) =>
          fetch(`https://api.spotify.com/v1/albums/${album.id}/tracks`, {
            method: "GET",
            headers: {
              Authorization:
                "Bearer " +
                client.voiceManager.spotifyApi._credentials.accessToken,
            },
          }).then((response) => response.json())
        );
        const results = await Promise.all(promises);
        tracks = tracks.concat(...results.map((result) => result.items));
      }

      tracks = tracks.filter((track) => track.name !== prev);

      let randomTrack;
      let counter = 0;
      do {
        randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
        counter++;
        if (counter > 5) {
          data.result = "somelongstringnobodywillcheck";
          return {
            code: d.util.setCode(data),
          };
        }
      } while (randomTrack.preview_url === null);

      function sanitize(value) {
        if (typeof value === "string") {
          return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
        }
        return value;
      }

      data.result = JSON.stringify(
        {
          preview: sanitize(randomTrack.preview_url),
          title: sanitize(randomTrack.name.split(/[-\/\[\(]/)[0].trim()),
          link: sanitize(randomTrack.external_urls?.spotify),
          image: sanitize(randomTrack.album?.images[0].url),
          duration: sanitize(randomTrack.duration_ms),
          explicit: sanitize(randomTrack.explicit),
          artist: sanitize(
            randomTrack.artists.map((artist) => artist.name).join(", ")
          ),
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
