const { prefix } = require('../../botconfig.json');

module.exports = async (client, message) => {
    if (message.author.bot) return; // ignore bot messages for safety

    let args = message.content.slice(prefix.length).trim().split(' '); //args are just the message split into spaces
    let cmd = args.shift().toLowerCase(); // commands are lowercase

    const slap = client.emojis.cache.find(emoji => emoji.name === "slap");
    if (message.content.includes('slap')) {
        if (message.mentions.users.first())
            message.channel.send(`${message.mentions.members.first()} ${slap}`) //ping user and send slap emoji
        else
            message.channel.send(`${message.content.slice(message.content.indexOf('slap') + 5)} ${slap}`);
        return message.delete();
    }

    //handling bot commands, don't do anything after this
    if (!message.content.startsWith(prefix)) return;
    let commandfile = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
    if (commandfile) commandfile.run(client, message, args);
}