const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js');
const ms = require('ms');
module.exports = class TempbanCommand extends BaseCommand {
  constructor() {
    super('tempban', 'moderation', []);
  }

 async run(client, message, args) {
    //permission checking
    if(!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send('You donot have permission to ban someone');
    if(!message.guild.me.hasPermission('BAN_MEMBERS')) return message.channel.send('I donot have permission to ban someone');
   
    //variables
    let time = args[1]
    let reason = args.slice(2).join(" ");
    const mentionedMember = message.mentions.members.first();

    //variable checking
    if(!reason) reason = "No Reason is Given";
    if(!args[0]) return message.channel.send("You Need To Mention a user to tempban. \`-tempban @user time reason\`");
    if(!mentionedMember) return message.channel.send("The Member You have mention is not in the **Server**");
    if(!mentionedMember.bannable) return message.channel.send('I can not temban this person');
    if(!time)return message.channel.send("You must stated a specific time to tempban a member \`-tempban @user time reason\`");
    //executing
    const tempbanEmbed = new Discord.MessageEmbed()
    .setTitle(`You have tempbanned from ${message.guild.name}`)
    .setDescription(`Duration ${time}` ,`Reason of Banned: ${reason}`)
    .setColor("#ffda1a")
    .setTimestamp();

    await mentionedMember.send(tempbanEmbed).catch(err => console.log(err))
    await mentionedMember.ban({
      days:7,
      reason: reason

    }).catch(err => console.log(err)).then(() => message.channel.send('successfully temporary banned' + mentionedMember.user.tag))
  }
}