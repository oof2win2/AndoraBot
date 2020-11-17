/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const fs = require('fs');

module.exports = (client) => {
  const load = (dir) => {
    const events = fs
      .readdirSync(`./events/${dir}/`)
      .filter((e) => e.endsWith('.js'));
    events.forEach((file) => {
      const evt = require(`../events/${dir}/${file}`);
      const eName = file.split('.')[0];
      client.on(eName, evt.bind(null, client));
    });
  };
  ['client', 'guild'].forEach((e) => load(e));
};
