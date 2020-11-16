/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const Discord = require('discord.js');
const { token, prefix } = require('./botconfig.json');

const client = new Discord.Client();

client.prefix = prefix; // custom property, allows it to be used elsewhere

// eslint-disable-next-line no-return-assign
['commands', 'aliases'].forEach((x) => client[x] = new Discord.Collection());
['command', 'event'].forEach((x) => require(`./handlers/${x}`)(client)); // handlers

client.login(token);
