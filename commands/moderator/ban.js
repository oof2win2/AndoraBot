const { MessageEmbed } = require('discord.js');
const { modDump, guildID } = require('../../server.json');
const { defaultEmbedColor } = require('../../botconfig.json');

module.exports = {
  config: {
    name: 'ban',
    aliases: [],
    description: 'Ban someone from the Discord server',
    category: 'moderator',
    usage: '<ping> [number of days of messages to delete] [reason]',
    accessibility: 'moderators',
  },
  run: async (client, message, args) => {
    if (!args[0]) {
      message.reply('Please ping someone to ban!');
    } else {
      if (!message.mentions.members.first()) return message.reply('No user to ban');
      const banOptions = {};
      // eslint-disable-next-line prefer-destructuring
      if (args[1]) banOptions.days = args[1];
      else banOptions.days = 0;
      if (args[2]) {
        const reason = args.slice(2);
        banOptions.reason = reason.join(' ');
      }
      const guild = await client.guilds.fetch(guildID);
      if (!guild) return message.reply('Error: Guild not found');
      if (!guild.available) return message.reply('Error: Guild Unavailable');
      const toBan = await guild.members.fetch(
        message.mentions.members.first().user,
      ); // gets the mentioned user as a guild member
      if (!toBan.bannable) return message.reply(`User ${args[0]} is not bannable!`);
      const bannedID = toBan.user.id;
      const bannedTag = toBan.user.tag;
      const res = toBan.ban(banOptions);
      res.catch((e) => message.reply(`Error banning: ${e}`));
      res.then(() => {
        message.reply(`User \`${bannedTag}\` was banned`);
      });

      const modDumpChannel = guild.channels.cache.get(modDump);
      const banEmbed = new MessageEmbed()
        .setColor(defaultEmbedColor)
        .setTitle('BANNED')
        .setDescription(
          `User \`${bannedTag}\` was banned by ${message.author} for reason `,
        )
        .addField('Banned user', `\`${bannedTag}\`/\`${bannedID}\``, true)
        .addField('Banned by', `${message.author}`, true);
      if (banOptions.reason) banEmbed.addField('Ban reason', banOptions.reason);
      else banEmbed.addField('Ban reason', 'No reason given', true);
      banEmbed.addField('Cleared days of messages', `${banOptions.days}`, true);
      banEmbed.addField('Source of banning', `${message.url}`);
      banEmbed.setFooter(
        `© ${message.guild.me.displayName} | Developed by oof2win2`,
        client.user.displayAvatarURL(),
      );
      banEmbed.setTimestamp();
      return modDumpChannel.send(banEmbed);
    }
    return null;
  },
};
