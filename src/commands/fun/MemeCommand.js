const BaseCommand = require('../../utils/structures/BaseCommand');
const { MessageEmbed } = require("discord.js");
const randomPuppy = require("random-puppy");

module.exports = class MemeCommand extends BaseCommand {
  constructor() {
    super('meme', 'fun', []);
  }

  async run(client, message, args) {

    const subReddits = ["dankmeme", "meme", "me_irl"];
    const random = subReddits[Math.floor(Math.random() * subReddits.length)];

    const img = await randomPuppy(random);
    const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setImage(img)
        .setURL(`https://reddit.com/r/${random}`);

    message.channel.send(embed);
}
}