const { MessageEmbed } = require('discord.js');
const { guildID } = require('../../server.json');
const { defaultEmbedColor } = require('../../botconfig.json');

module.exports = {
  config: {
    name: 'userinfo',
    aliases: ['useri'],
    description: 'Get info about a user',
    category: 'general',
    usage: '',
    accessibility: 'members',
  },
  run: async (client, message, args) => {
    if (!args[0]) {
      return message.reply('Please ping a user to get info on!');
    }
    if (!message.mentions.members.first()) return message.reply('Please ping a user to get info on');
    const guild = await client.guilds.fetch(guildID);
    if (!guild) return message.reply('Error: Guild not found');
    if (!guild.available) return message.reply('Error: Guild Unavailable');
    const user = await guild.members.fetch(
      message.mentions.members.first().user,
    ); // gets the mentioned user as a guild member
    const infoEmbed = new MessageEmbed()
      .setColor(defaultEmbedColor)
      .setAuthor(`${message.guild.me.displayName}`, message.guild.iconURL)
      .setFooter(
        `© ${message.guild.me.displayName} | Developed by oof2win2`,
        client.user.displayAvatarURL(),
      )
      .setTitle('User Info')
      .setDescription(`Info about user ${args[0]}`);
    infoEmbed.addField('Joined server on', user.joinedAt);
    infoEmbed.addField('Nitro Supporter status', user.premiumSince ? 'Supporting' : 'Not supporting', true);
    const roles = [];
    user.roles.cache.forEach((role) => {
      if (role.name !== '@everyone') roles.push(`${role}`);
    });
    infoEmbed.addField('User roles', roles.join(', '), true);
    infoEmbed.addField('Highest role', `${user.roles.highest}`, true);
    infoEmbed.addField('Bannable', user.bannable ? 'Yes' : 'No', true);
    infoEmbed.addField('Kickable', user.kickable ? 'Yes' : 'No', true);
    infoEmbed.addField('Nickname', `\`${user.displayName}\``, true);
    return message.channel.send(infoEmbed);
  },
};
