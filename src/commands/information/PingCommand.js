const BaseCommand = require('../../utils/structures/BaseCommand');
const { client, Message, MessageEmbed } = require('discord.js');
const config = require('../../../slappey.json');
module.exports = class CreditCommand extends BaseCommand {
  constructor() {
    super('ping', 'information', []);
  }

  async run(client, message, args) {
    message.channel.send(
      new MessageEmbed()
          .setColor(config.colors.yes)
          .setFooter("Made By Discord Portal")
          .setTitle(`${'🎈'} Pinging....`)
  ).then(msg => {
      msg.edit(
          new MessageEmbed()
          .setColor(config.colors.yes)
          .setFooter("Made By Discord Portal")
          .setThumbnail(client.user.displayAvatarURL())
          .setTitle(`${"🎈"} Ping: \`${Math.round(Date.now() - message.createdTimestamp)}ms\`\n\n${"🎈"} Api Latency: \`${Math.round(client.ws.ping)}ms\``)
      )
  })
}
}