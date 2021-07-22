const BaseCommand = require('../../utils/structures/BaseCommand');
const { OWNER_ID } = require("../../../slappey.json");
module.exports = class DmCommand extends BaseCommand {
  constructor() {
    super('dm', 'information', []);
  }

  async run(client, message, args) {
        
    if(!message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES") && !OWNER_ID.includes(message.author.id)) return;


  let user =
    message.mentions.members.first() ||
    message.guild.members.cache.get(args[0]);
  if (!user)
    return message.channel.send(
      `You did not mention a user, or you gave an invalid id`
    );
  if (!args.slice(1).join(" "))
    return message.channel.send("You did not specify your message");
  user.user
    .send(args.slice(1).join(" "))
    .catch(() => message.channel.send("That user could not be DMed!"))
    .then(() => message.channel.send(`Sent a message to ${user.user.tag}`));
}
};