module.exports = (client) => {
  client.functionManager.createFunction({
    name: "$c",
    type: "djs",
    code: async (d) => {
      const data = d.util.aoiFunc(d);

      const [ comment ] = data.inside.splits;

      return {
        code: d.util.setCode(data),
      };
    },
  });
};
