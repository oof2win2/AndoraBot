const { MessageEmbed } = require('discord.js');
const { modDump, guildID } = require('../../server.json');
const { defaultEmbedColor } = require('../../botconfig.json');

module.exports = {
  config: {
    name: 'kick',
    aliases: [],
    description: 'kick someone from the Discord server',
    category: 'moderator',
    usage: '<ping> [number of days of messages to delete] [reason]',
    accessibility: 'moderators',
  },
  run: async (client, message, args) => {
    if (!args[0]) {
      message.reply('Please ping someone to kick!');
    } else {
      const guild = await client.guilds.fetch(guildID);
      if (!guild) return message.reply('Error: Guild not found');
      if (!guild.available) return message.reply('Error: Guild Unavailable');
      const tokick = await guild.members.fetch(
        message.mentions.members.first().user,
      ); // gets the mentioned user as a guild member
      const reason = args.slice(1).join(' ');
      if (!tokick.kickable) return message.reply(`User ${args[0]} is not kickable!`);
      const kickedID = tokick.id;
      const kickedTag = tokick.tag;
      const res = tokick.kick(reason);
      res.catch((e) => message.reply(`Error kickning: ${e}`));
      res.then(() => {
        message.reply(`User \`${kickedTag}\` was kickned`);
      });

      const modDumpChannel = guild.channels.cache.get(modDump);
      const kickEmbed = new MessageEmbed()
        .setColor(defaultEmbedColor)
        .setTitle('KICKED')
        .setDescription(`User \`${kickedTag}\` was kicked by ${message.author}`)
        .addField('Kicked user', `\`${kickedTag}\`/\`${kickedID}\``, true)
        .addField('Kicked by', `${message.author}`, true);
      if (reason) kickEmbed.addField('Kick reason', reason);
      else kickEmbed.addField('Kick reason', 'No reason given', true);
      kickEmbed.addField('Source of kickning', `${message.url}`);
      kickEmbed.setFooter(
        `© ${message.guild.me.displayName} | Developed by oof2win2`,
        client.user.displayAvatarURL(),
      );
      kickEmbed.setTimestamp();
      return modDumpChannel.send(kickEmbed);
    }
    return null;
  },
};
