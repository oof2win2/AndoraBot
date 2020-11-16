const { modDump, guildID } = require("../../server.json");
const { defaultEmbedColor } = require("../../botconfig.json");
const MessageEmbed = require("discord.js").MessageEmbed;

module.exports = {
  config: {
    name: "ban",
    aliases: [],
    description: "Ban someone from the Discord server",
    category: "moderator",
    usage: "<ping> [number of days of messages to delete] [reason]",
    accessibility: "owners",
  },
  run: async (client, message, args) => {
    if (!args[0]) {
      message.reply("Please ping someone to ban!");
    } else {
      if (!message.mentions.members.first())
        return message.reply("No user to ban");
      let banOptions = {};
      if (args[1]) banOptions.days = args[1];
      else banOptions.days = 0;
      if (args[2]) {
        const reason = args.slice(2);
        banOptions.reason = reason.join(" ");
      }
      let guild = await client.guilds.fetch(guildID);
      if (!guild) return message.reply("Error: Guild not found");
      if (!guild.available) return message.reply("Error: Guild Unavailable");
      let toBan = message.mentions.members.first().user;
      const bannedTag = toBan.tag;
      const bannedID = toBan.id;
      // let res = guild.members.ban(toBan.id, banOptions);
      // res.catch((e) => {
      //   return message.reply(`Error banning: ${e}`);
      // });
      // res.then(() => {
      //   message.reply(`User \`${bannedTag}\` was banned`);
      // });

      const modDumpChannel = guild.channels.cache.get(modDump);
      let banEmbed = new MessageEmbed()
        .setColor(defaultEmbedColor)
        .setTitle("BANNED")
        .setDescription(
          `User \`${bannedTag}\` was banned by ${message.author} for reason `
        )
        .addField(
          "Banned user",
          `\`${bannedTag}\`/\`${bannedID}\``,
          (inline = true)
        )
        .addField("Banned by", `${message.author}`, (inline = true));
      if (banOptions.reason) banEmbed.addField("Ban reason", banOptions.reason);
      else banEmbed.addField("Ban reason", "No reason given", (inline = true));
      banEmbed.addField(
        "Cleared days of messages",
        `${banOptions.days}`,
        (inline = true)
      );
      banEmbed.addField("Source of banning", `${message.url}`);
      return modDumpChannel.send(banEmbed);
    }
  },
};
