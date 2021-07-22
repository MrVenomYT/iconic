const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js');
const superagent = require('superagent');
module.exports = class PatCommand extends BaseCommand {
  constructor() {
    super('pat', 'fun', []);
  }

  async run(client, message, args) {
    let victim = message.mentions.users.first() || (args.length > 0 ? message.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first(): message.author) || message.author;
    const { body } = await superagent
      .get("https://nekos.life/api/v2/img/pat");
          const embed = new Discord.MessageEmbed()
         .setColor("YELLOW")
          .setTitle("Here's your Pat, 👀")
      .setDescription(`${victim} Pats ${message.author}`)
      .setImage(body.url)
       .setTimestamp()

  
          await message.channel.send(embed);
}
}