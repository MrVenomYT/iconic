const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js');
const db = require("quick.db")
module.exports = class UnbanCommand extends BaseCommand {
  constructor() {
    super('unban', 'moderation', []);
  }

  async run(client, message, args) {
   //permission checking
   if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send('You donot have permission to ban someone');
   if(!message.guild.me.hasPermission("BAN_MEMBERS")) return message.channel.send('I donot have permission to ban someone');
  
   //variables
   const channel  = db.fetch(`modlog_${message.guild.id}`);
   let reason = args.slice(1).join(" ");
   let userID = args[0];

   //variable checking
   if(!reason) reason = "No Reason is Given";
   if(!args[0]) return message.channel.send("You Need To Mention a user to unban. \`-unban ID reason\`");
   if(isNaN(args[0])) return message.channel.send('The Id Given is not a number \`-unban ID reason\`');
   
   try{

    const mdlogEmbed = new Discord.MessageEmbed()
    .setTitle(`${message.author.tag} unbanned ${userID} from ${message.guild.name} Modlogs`)
    .setColor("#ffda1a")
    .setTimestamp()
    .setFooter(client.user.tag,client.user.displayAvatarURL());

    var sChannel = message.guild.channels.cache.get(channel)
    if (!sChannel) return;
    sChannel.send(mdlogEmbed)
  }catch(error) { console.log(error)}
     //executing
     message.guild.fetchBans().then(async bans => {
      if(bans.size == 0) return message.channel.send('This server does not banned anyone yet');
      let bUser = bans.find(b => b.user.id == userID);
      if(!bUser) return message.channel.send('The user id you stated is not banned');
        
      await message.guild.members.unban(bUser.user, reason).catch(err =>{
        console.log(err);
        return message.channel.send("Something went wrong unbanning this id");
      }).then(()=>{
        message.channel.send(`Successfully unbanned ${args[0]}`);
      });
     });
 }
}