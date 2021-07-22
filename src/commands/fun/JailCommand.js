const BaseCommand = require('../../utils/structures/BaseCommand');
const DIG = require("discord-image-generation");
const Discord = require('discord.js')
module.exports = class JailCommand extends BaseCommand {
  constructor() {
    super('jail', 'fun', []);
  }

  async run(client, message, args) {

    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

    if(!user)
    return message.reply(` Provide a valid user !!`)

    const avatar = user.user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 });

    const img = await new DIG.Jail().getImage(avatar);

    const attach = new Discord.MessageAttachment(img, "jail.png");

   await message.channel.send(attach)
}
}