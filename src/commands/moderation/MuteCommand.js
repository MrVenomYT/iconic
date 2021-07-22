const { ReactionCollector } = require('discord.js');
const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js');
module.exports = class MuteCommand extends BaseCommand {
  constructor() {
    super('mute', 'moderation', []);
  }

  async run(client, message, args) {
    if(!message.member.hasPermission("MUTE_MEMBERS")) return message.channel.send("You cannot Use this command")
    if(!message.guild.me.hasPermission('MANAGE_ROLES')) return message.channel.send('I require \`MANAGE_ROLES \`permission to change names');
   
    
    
    const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    
     let reason = args.slice(1).join(" ");
     const muteRole = message.guild.roles.cache.get('856631153373216828');
     const memberRole = message.guild.roles.cache.get('856631108959862875');
    const muteEmbed = new Discord.MessageEmbed()
    .setTitle(`You have Muted from ${message.guild.name}`)
    .setDescription(`Reason of Muted: ${reason}`)
    .setColor("#ffda1a")
    .setTimestamp()
    .setFooter(client.user.tag,client.user.displayAvatarURL());

    if(!args[0]) return message.channel.send("`\-mute @member reason\`")
    if(!mentionedMember) return message.channel.send("The member you mentioned is not in the server");
    
    if(mentionedMember.user.id == message.author.id) return message.channel.send("You cannot mute yourself");
    if(mentionedMember.user.id == client.user.id) return message.channel.send("You cannot mute my with my own command");
    if(!reason) reason = 'No reason is given'
    if(mentionedMember.roles.cache.has(muteRole.id)) return message.channel.send('This member is already muted');
    if(message.member.roles.highest.position <= mentionedMember.roles.highest.position) return message.channel.send('You cannot mute someone who has higher rank then you');
    
    await mentionedMember.send(muteEmbed).catch(err => console.log(err))
    await mentionedMember.roles.add(muteRole.id).catch(err => console.log(err).then(message.channel.send('There was an error in giving mute role')));
    await mentionedMember.roles.remove(memberRole.id).catch(err => console.log(err).then(message.channel.send('There was an error in removing member role role')));
  }
}