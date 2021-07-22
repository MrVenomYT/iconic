const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class NickCommand extends BaseCommand {
  constructor() {
    super('nick', 'moderation', []);
  }

  
  async run(client, message, args) {
   

   // -nick @user nickanme

 //permission checking
 if(!message.member.hasPermission('CHANGE_NICKNAME')) return message.channel.send('You cannot use this command');
 if(!message.guild.me.hasPermission('MANAGE_NICKNAMES')) return message.channel.send('I require \`MANAGE_NICKNAMES \`permission to change names');

//variables
const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
const nickName = args.slice(1).join(" ");
//Input checking
if(!args[0]) return message.channel.send('you must stated a person to change name');
if(!mentionedMember) return message.channel.send("The person you mentioned is not in the server");
if(!nickName) return message.channel.send('You must stated a nickname to change');
if(!mentionedMember.kickable) return message.channel.send('I can not change that person`s as their role is higher')
//executing
await mentionedMember.setNickname(nickName).catch(err => console.log(err) && message.channel.send('I cannot change that name due to an error')) 
  }
}