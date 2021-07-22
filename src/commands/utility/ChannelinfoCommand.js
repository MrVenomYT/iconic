const BaseCommand = require('../../utils/structures/BaseCommand');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
module.exports = class ChannelinfoCommand extends BaseCommand {
  constructor() {
    super('channelinfo', 'utility', []);
  }

  async run(client, message, args) {
    let channel = message.mentions.channels.first() || client.guilds.cache.get(message.guild.id).channels.cache.get(args[0]) || message.guild.channels.cache.find(r => r.name.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.channel;
        if (!channel) return message.channel.send("**Channel Not Found!**");

        let channelembed = new MessageEmbed()
            .setTitle(`Channel Information for ${channel.name}`)
            .setThumbnail(message.guild.iconURL())
            .addField("**Channel Name**", channel.name)
            .addField("**NSFW**", channel.nsfw)
            .addField("**Channel ID**", channel.id)
            .addField("**Channel Type**", channel.type)
            .addField("**Channel Description**", `${channel.topic || "No Description"}`)
            .addField("**Channel Created At**", channel.createdAt)
            .setColor("#dcf104")
        message.channel.send(channelembed);
    }

}