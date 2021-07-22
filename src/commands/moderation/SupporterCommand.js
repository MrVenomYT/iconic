const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js')
module.exports = class supportCommand extends BaseCommand {
  constructor() {
    super('support', 'moderation', []);
  }

  async run(client, message, args) {
    //permission checking
  if(!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send('You cannot use this command');
  if(!message.guild.me.hasPermission('MANAGE_ROLES')) return message.channel.send('I require \`MANAGE_ROLES \`permission to change names');
 
 //variables
 
 const joinerRole = message.guild.roles.cache.get('867249531992539136');
 const supportRole = message.guild.roles.cache.get('865214165508947978');
 const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
 const supportPrefix = "supportor | ";
 //Input checking
 
if(!joinerRole) return message.channel.send('There is no joiner role to give');
if(!supportRole) return message.channel.send('There is no support role to give');
if(!args[0]) return message.channel.send("\`-support @member\` or \` -support ID\`");
if(!mentionedMember) return message.channel.send("The member you mentioned is not in the server");
 //executing
 await mentionedMember.roles.add(joinerRole.id).then(message.channel.send('The Role is given to' , `${mentionedMember}`)).catch(err => message.channel.send(`I am unable to give joiner role due to an error`));
 await mentionedMember.roles.add(supportRole.id).then(message.channel.send('The Role is given to' , `${mentionedMember}`)).catch(err => message.channel.send(`I am unable to give support role due to an error`));
 await mentionedMember.setNickname(supportPrefix + mentionedMember.user.username);
}
 }