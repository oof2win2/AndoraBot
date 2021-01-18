const { MessageEmbed } = require('discord.js');
const { defaultEmbedColor } = require('../../botconfig.json');
const sharp = require("sharp");
const Str = require('@supercharge/strings')
const fs = require("fs")
const https = require("https")

module.exports = {
    config: {
        name: 'watermark',
        aliases: [],
        description: 'Add a watermark to an image',
        category: 'fun',
        usage: '',
        accessibility: 'members',
    },
    run: async (client, message, args) => {
        if (!message.attachments.first())
            return message.reply('Please upload a file to process!');
        const regex = new RegExp(/(?:\.([^.]+))?$/);
        const extension = regex.exec(message.attachments.first().name)[1]
        if (!['jpg', 'png'].includes(extension))
            return message.reply("Please supply image with accepted extension (png, jpg)!");
        if (!args[0])
            return message.reply('Please, give an option!')
        let file = message.attachments.first();
        const filename = Str.random()
        var outFile = fs.createWriteStream(`temp/${filename}.${extension}`); // filename should be from point where you run `node .`
        https.get(file.url, function (response) {
            response.pipe(outFile);
            outFile.on('finish', function () {
                outFile.close();
            });
        });
        //TODO: somehow manage to get the image to fit the correct parameters aka be small enough and patch to the bottom right too
        setTimeout(async () => {
            console.log(`./temp/${filename}.${extension}`)
            await sharp(`temp/${filename}.${extension}`)
                .composite([{ input: `data/images/${args[0]}.png`, gravity: "southeast" }])
                .toFile(`temp/Out.png`)
        }, 1000)

    },
};
