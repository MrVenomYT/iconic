const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class DeleteCommand extends BaseCommand {
  constructor() {
    super('delete', 'moderation', []);
  }

 
  async run(client, message, args) {
    // message.channel.send('nuke command works');

   // -Nuke reason

 //permission checking
 if(!message.member.hasPermission('MANAGE_CHANNELS')) return message.channel.send('You cannot use this command');
 if(!message.guild.me.hasPermission('MANAGE_CHANNELS')) return message.channel.send('I donot have manage channel permission');

//variables
let reason = args.join(" ");
const deleteChannel = message.channel;
//Input checking
if(!reason) reason = "No reason is given";
if(!deleteChannel.deletable) return message.channel.send('This channel is not deleteable')
//executing
await deleteChannel.delete().catch(err => console.log(err));

  }
}