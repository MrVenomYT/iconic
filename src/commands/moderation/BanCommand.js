const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js');
const db = require("quick.db")
module.exports = class BanCommand extends BaseCommand {
  constructor() {
    super('ban', 'moderation', []);
  }

 async run(client, message, args) {
   //permission checking
    if(!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send('You donot have permission to ban someone');
    if(!message.guild.me.hasPermission('BAN_MEMBERS')) return message.channel.send('I donot have permission to ban someone');
    const channel  = db.fetch(`modlog_${message.guild.id}`);
    //variables
    let reason = args.slice(1).join(" ");
    const mentionedMember = message.mentions.members.first();

    //variable checking
    if(!reason) reason = "No Reason is Given";
    if(!args[0]) return message.channel.send("You Need To Mention a user to ban. \`-ban @user reason\`");
    if(!mentionedMember) return message.channel.send("The Member You have mention is not in the **Server**");
    if(!mentionedMember.bannable) return message.channel.send('I can not ban this person');
    try{

      const mdlogEmbed = new Discord.MessageEmbed()
      .setTitle(`${message.author.tag} Banned ${mentionedMember} from ${message.guild.name} Modlogs`)
      .setDescription(`Reason: ${reason}`)
      .setColor("#ffda1a")
      .setTimestamp()
      .setFooter(client.user.tag,client.user.displayAvatarURL());

      var sChannel = message.guild.channels.cache.get(channel)
      if (!sChannel) return;
      sChannel.send(mdlogEmbed)
    }catch(error) { console.log(error)}
    //executing
    const banEmbed = new Discord.MessageEmbed()
    .setTitle(`You have Banned from ${message.guild.name}`)
    .setDescription(`Reason of Banned: ${reason}`)
    .setColor("#ffda1a")
    .setTimestamp();

    await mentionedMember.send(banEmbed).catch(err => console.log(err))
    await mentionedMember.ban({
      days:7,
      reason: reason

    }).catch(err => console.log(err)).then(() => message.channel.send('successfully banned' + mentionedMember.user.tag , `Modlogs`))
  
    

  }
}
