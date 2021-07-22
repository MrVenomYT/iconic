const BaseCommand = require('../../utils/structures/BaseCommand');
const discord = require("discord.js");
module.exports = class MembercountCommand extends BaseCommand {
  constructor() {
    super('membercount', 'tools', []);
  }

  async run(client, message, args) {
    let embed = new discord.MessageEmbed()
    .setAuthor(
    `Members`)
    .setDescription(`${message.guild.memberCount}`)
    .setColor("RANDOM")
    .setTimestamp(message.timestamp = Date.now())
    
    message.channel.send(embed)
  }
}