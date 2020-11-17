const { MessageEmbed } = require('discord.js');
const { modDump, guildID } = require('../../server.json');
const { defaultEmbedColor } = require('../../botconfig.json');

module.exports = {
  config: {
    name: 'unban',
    aliases: [],
    description: 'Unban someone from the Discord server',
    category: 'moderator',
    usage: '<their discord ID>',
    accessibility: 'moderators',
  },
  run: async (client, message, args) => {
    if (!args[0]) {
      message.reply("Please give a user's ID to unban!");
    } else {
      const guild = await client.guilds.fetch(guildID);
      if (!guild) return message.reply('Error: Guild not found');
      if (!guild.available) return message.reply('Error: Guild Unavailable');
      const toUnban = await client.users.fetch(args[0]);
      const reason = args.slice(1).join(' ');
      const res = guild.members.unban(toUnban, reason);
      res.catch((e) => message.reply(`Error unbanning: ${e}`));
      res.then(() => {
        message.reply(`User \`${toUnban.id}\` was unbanned`);
      });

      const modDumpChannel = guild.channels.cache.get(modDump);
      const unbanEmbed = new MessageEmbed()
        .setColor(defaultEmbedColor)
        .setTitle('BANNED')
        .setDescription(
          `User \`${toUnban.tag}\` was unbanned by ${message.author}`,
        )
        .addField(
          'Unanned user',
          `\`${toUnban.tag}\`/\`${toUnban.id}\``,
          true,
        )
        .addField('Banned by', `${message.author}`, true);
      if (reason) unbanEmbed.addField('Ban reason', reason);
      else unbanEmbed.addField('Unban reason', 'No reason given', true);
      unbanEmbed.addField('Source of unbanning', `${message.url}`);
      unbanEmbed.setFooter(
        `© ${message.guild.me.displayName} | Developed by oof2win2`,
        client.user.displayAvatarURL(),
      );
      unbanEmbed.setTimestamp();
      return modDumpChannel.send(unbanEmbed);
    }
    return null;
  },
};
