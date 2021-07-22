const BaseCommand = require('../../utils/structures/BaseCommand');
const config = require('../../../slappey.json');
const Discord = require('discord.js');
module.exports = class PrefixCommand extends BaseCommand {
  constructor() {
    super('prefix', 'settings', []);
  }

  async run(client, message, args) {
    // message.channel.send(`**My Prefix is ${config.prefix}**`);
    const size = args[1];
    const prefixEmbed = new Discord.MessageEmbed()
    .setAuthor(`${message.guild.me.displayName}`, message.guild.iconURL())
    .setTitle(`${message.author.tag}`)
    .setDescription(`My Prefix is ${config.prefix}`)
      .setColor("#ffda1a")
      .setTimestamp()
      .setFooter(client.user.tag,client.user.displayAvatarURL());
      if(!args[0]) return message.channel.send(prefixEmbed)
   }
}