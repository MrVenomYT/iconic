const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js')
const db = require("quick.db")
module.exports = class KickCommand extends BaseCommand {
  constructor() {
    super('kick', 'moderation', []);
  }

async  run(client, message, args) {
  if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("You cannot Use this command")
  const channel  = db.fetch(`modlog_${message.guild.id}`);

    // /hkick @user dm ads
    // message.channel.send('kick command works');
    const mentionedMemeber = message.mentions.members.first();
    let reason = args.slice(1).join(" ");
    if(!reason) reason = "No Reason is Given"
    const kickEmbed = new Discord.MessageEmbed()
    .setTitle(`You have kicked from ${message.guild.name}`)
    .setDescription(`Reason: ${reason}`)
    .setColor("#ffda1a")
    .setTimestamp()
    .setFooter(client.user.tag,client.user.displayAvatarURL());
    
    // -kick @user dm ads

    if(!args[0]) return message.channel.send("You Need To Mention a user to kick. \`-kick @user reason\`");
    if(!mentionedMemeber) return message.channel.send("The Member You have mention is not in the **Server**");
    if(!mentionedMemeber.kickable) return message.channel.send('I can not kick this person')
    try{

      const mdlogEmbed = new Discord.MessageEmbed()
      .setTitle(`${message.author.tag} kicked ${mentionedMemeber} from ${message.guild.name} Modlogs`)
      .setDescription(`Reason: ${reason}`)
      .setColor("#ffda1a")
      .setTimestamp()
      .setFooter(client.user.tag,client.user.displayAvatarURL());

      var sChannel = message.guild.channels.cache.get(channel)
      if (!sChannel) return;
      sChannel.send(mdlogEmbed)
    }catch(error) { console.log(error)}
    try{
    
      await mentionedMemeber.send(kickEmbed);

    } catch(err){
      console.log('I am unable to send message to the member');
    }
    try{

      mentionedMemeber.kick(reason)
     
    }catch(err){

      console.log(err);
      return message.channel.send("I was unable To Kick The Mentioned Member");
    }
  }
}