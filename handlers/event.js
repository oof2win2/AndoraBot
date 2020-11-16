const fs = require("fs");

module.exports = (client) => {
  const load = (dir) => {
    const events = fs
      .readdirSync(`./events/${dir}/`)
      .filter((e) => e.endsWith(".js"));
    for (let file of events) {
      const evt = require(`../events/${dir}/${file}`);
      let eName = file.split(".")[0];
      client.on(eName, evt.bind(null, client));
    }
  };
  ["client", "guild"].forEach((e) => load(e));
};
