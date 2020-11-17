const { prefix } = require('../../botconfig.json');
const roles = require('../../roles.json');

module.exports = async (client, message) => {
  if (message.author.bot) return; // ignore bot messages for safety

  const args = message.content.slice(prefix.length).trim().split(' '); // args are just the message split into spaces
  const cmd = args.shift().toLowerCase(); // commands are lowercase

  const slap = client.emojis.cache.find((emoji) => emoji.name === 'slap');
  if (message.content.includes('slap')) {
    if (message.mentions.users.first()) message.channel.send(`${message.mentions.members.first()} ${slap}`);
    // ping user and send slap emoji
    else {
      message.channel.send(
        `${message.content.slice(message.content.indexOf('slap') + 5)} ${slap}`,
      );
    }
    message.delete();
  }

  // handling bot commands, don't do anything after this
  if (!message.content.startsWith(prefix)) return;
  const commandfile = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
  if (commandfile) {
    const { accessibility } = commandfile.config;
    const authRoles = message.member.roles.cache;
    if (roles[accessibility] !== '') {
      if (authRoles.some((r) => r.id === roles[accessibility])) {
        commandfile.run(client, message, args);
      } else {
        message.reply(
          'You do not have the sufficient roles to perform this command!',
        );
      }
    } else {
      // the accessibility role has not been set, therefore it is available to everyone
      commandfile.run(client, message, args);
    }
  } else {
    message.reply(`Invalid command. Check \`${prefix}help\``);
  }
};
