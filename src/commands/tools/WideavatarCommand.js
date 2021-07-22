const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = module.require("discord.js");
module.exports = class WideavatarCommand extends BaseCommand {
  constructor() {
    super('wideavatar', 'tools', []);
  }

async run(client, message, args) {
  const mention = message.mentions.members.first() || message.member;
  const avatar = mention.user.displayAvatarURL({dynamic: true, size: 2048, format: "png"});

      message.channel.send({ files: [{ attachment: `https://vacefron.nl/api/wide?image=${avatar}`, name: "wideavatar.png"}]});
  }
}