const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class NukeCommand extends BaseCommand {
  constructor() {
    super('nuke', 'moderation', []);
  }

  async run(client, message, args) {
    // message.channel.send('nuke command works');

   // -Nuke reason

 //permission checking
 if(!message.member.hasPermission('MANAGE_CHANNELS')) return message.channel.send('You cannot use this command');
 if(!message.guild.me.hasPermission('MANAGE_CHANNELS')) return message.channel.send('I donot have manage channel permission');

//variables
let reason = args.join(" ");
const nukeChannel = message.channel;
//Input checking
if(!reason) reason = "No reason is given";
if(!nukeChannel.deletable) return message.channel.send('This channel is not deleteable')
//executing
await nukeChannel.clone().catch(err => console.log(err)) && await nukeChannel.delete(reason).catch(err => console.log(err));
  }
}