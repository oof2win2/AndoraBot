const { MessageEmbed } = require('discord.js');
const { readdirSync } = require('fs');
const { stripIndents } = require('common-tags');
const { prefix, defaultEmbedColor } = require('../../botconfig.json');

module.exports = {
  config: {
    name: 'help',
    aliases: ['h', 'halp', 'commands'],
    usage: '(command)',
    category: 'basic',
    description: 'Displays all available commands',
    accessibility: 'members',
  },
  run: async (client, message, args) => {
    const embed = new MessageEmbed()
      .setColor(defaultEmbedColor)
      .setAuthor(`${message.guild.me.displayName} Help`, message.guild.iconURL)
      .setThumbnail(client.user.displayAvatarURL());

    if (!args[0]) {
      // no specific command to help asked for
      const categories = readdirSync('./commands/');

      embed.setDescription(
        `These are the avaliable commands for ${message.guild.me.displayName}\nThe bot prefix is: **${prefix}**`,
      );
      embed.setFooter(
        `© ${message.guild.me.displayName} | Developed by oof2win2 | Total Commands: ${client.commands.size}`,
        client.user.displayAvatarURL(),
      );

      categories.forEach((category) => {
        const dir = client.commands.filter(
          (c) => c.config.category === category,
        );
        const capitalise = category.slice(0, 1).toUpperCase() + category.slice(1);
        embed.addField(
          `${capitalise} [${dir.size}]:`,
          dir.map((c) => `\`${c.config.name}\``).join(' '),
        );
      });

      return message.channel.send(embed);
    }
    // a specific command to help with asked for
    let command = client.commands.get(
      client.aliases.get(args[0].toLowerCase()) || args[0].toLowerCase(),
    );
    if (!command) {
      return message.channel.send(
        embed
          .setTitle('Invalid Command.')
          .setDescription(
            `Do \`${prefix}help\` for the list of the commands.`,
          ),
      );
    }
    command = command.config;

    embed.setDescription(stripIndents`The bot's prefix is: \`${prefix}\`\n
            **Command:** ${
  command.name.slice(0, 1).toUpperCase() + command.name.slice(1)
}
            **Description:** ${
  command.description || 'No Description provided.'
}
            **Usage:** ${
  command.usage
    ? `\`${prefix}${command.name} ${command.usage}\``
    : `\`${prefix}${command.name}\``
}
            **Accessible by:** ${command.accessableby || 'Members'}
            **Aliases:** ${
  command.aliases ? `\`${command.aliases.join(', ')}\`` : 'None'
}`);
    embed.setFooter(
      `© ${message.guild.me.displayName} | Developed by oof2win2`,
      client.user.displayAvatarURL(),
    );

    return message.channel.send(embed);
  },
};
