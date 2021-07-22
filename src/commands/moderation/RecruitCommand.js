const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class RecruitCommand extends BaseCommand {
  constructor() {
    super('recruit', 'moderation', []);
  }

  async run(client, message, args) {
  
 
  //permission checking
  if(!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send('You cannot use this command');
  if(!message.guild.me.hasPermission('MANAGE_ROLES')) return message.channel.send('I require \`MANAGE_ROLES \`permission to change names');
 
 //variables
 
 const pingRole = message.guild.roles.cache.get('855733091406315530');
 const staffRole = message.guild.roles.cache.get('855740110116880404');
 const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
 const staffPrefix = "Staff | ";
 //Input checking
 
if(!pingRole) return message.channel.send('There is no ping role to give');
if(!staffRole) return message.channel.send('There is no staff role to give');
if(!args[0]) return message.channel.send("\`-recruit @member\` or \` -recruit ID\`");
if(!mentionedMember) return message.channel.send("The member you mentioned is not in the server");
 //executing
 await mentionedMember.roles.add(pingRole.id).then(message.channel.send('The Role is given to' , `${mentionedMember}`)).catch(err => message.channel.send(`I am unable to give ping role due to an error`));
 await mentionedMember.roles.add(staffRole.id).then(message.channel.send('The Role is given to' , `${mentionedMember}`)).catch(err => message.channel.send(`I am unable to give staff role due to an error`));
 await mentionedMember.setNickname(staffPrefix + mentionedMember.user.username);
}
 }