module.exports = {
  config: {
    name: 'uptime',
    aliases: ['ut'],
    description: "Get the bot's uptime",
    category: 'general',
    usage: '',
    accessibility: 'members',
  },
  run: async (client, message) => {
    function formatTime(ms) {
      // ms is divided to get the time desired and then remaindered to get the leftover
      const s = Math.floor((ms / 1000) % 60).toString();
      const m = Math.floor((ms / (1000 * 60)) % 60).toString();
      const h = Math.floor((ms / (1000 * 60 * 60)) % 24).toString();
      const d = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString();
      // string.padStart(length, filler)
      // pads the string with the $filler for the desired $length
      // if the length of the string is not equal to $length
      return `\`${d.padStart(2, '0')}:${h.padStart(2, '0')}:${m.padStart(
        2,
        '0',
      )}:${s.padStart(2, '0')}\``;
    }
    message.channel.send(`My uptime: \`${formatTime(client.uptime)}\``);
  },
};
