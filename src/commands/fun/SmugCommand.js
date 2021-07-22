const BaseCommand = require('../../utils/structures/BaseCommand');
const { MessageEmbed } = require("discord.js");

const nekos = require("nekos.life");
const {
  sfw: { smug },
} = new nekos();

module.exports = class SmugCommand extends BaseCommand {
  constructor() {
    super('smug', 'fun', []);
  }

 async run(client, message, args) {
  const { url } = await smug().catch(() => {});

  if (!url) return message.channel.send(`Could not connect to nekos.life`);

  message.channel.send(
    new MessageEmbed()
      .setColor("YELLOW")
      .setImage(url)
      .setDescription(`${message.member} smugs.`)
  );
  }
}