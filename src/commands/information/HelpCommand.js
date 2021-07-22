const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js')
module.exports = class HelpCommand extends BaseCommand {
  constructor() {
    super('help', 'information', []);
  }

 async run(client, message, args) {
const size = args[1];
  const sectionEmbed = new Discord.MessageEmbed()
  .setAuthor(`${message.guild.me.displayName} Help`, message.guild.iconURL())
  .setThumbnail(client.user.displayAvatarURL())
  .setTitle('**Bot Help Section ⛑**') 
  .setDescription('use -help sectionname to open other section')
  .addField('**Fun 🃏**' , "`Anime` , `Cowsay` , `Fliptext`,`Imdb` , `jail` ,`Kiss`,`Love` ,`Meme` ,`Minecraft`,`Pat`,`Slap`,`Smug`,`Tickle`,`Say` ,`Poke`,`Rip`,`Toilet`,`Triggered`,`Vaportext`,`Wasted`,`Whatsapp`")
  .addField('**Information 📜**' , "``Docs` , `List`, `Serverinfo` , `Social` , `Stats` , `Uptime` , `Wiki` ")
  .addField('**Moderation 💣**', "`Lock` , `Unlock`,`Ban`,`Delete`,`Nuke`,`Mute`,`TempBan`,`Nick`,`Recruit`,`Role`,`Unban`,`Kick`,`Warn`,`Purge`,`Hackban`")
  .addField('**Tools 🔧**' , "`Ascii`, `Av2` , `Avatar` ,`Binary` ,`Blur`,`Calculator`,`Captcha`,`Covid19`,`Decode`,`Enlarge`,`Linkshortner`,`Membercount`,`Stealemoji`,`Verify`,`Welcome`,`Wideavatar`,`Ytsearch`")
  .addField('**Utility 🔩**' ,"`Advice`,`Channelinfo`,`Github`,`Imageannounce`,`Logchannel`,`Playstore`,`Slowmode`,`Weather`,`Whois`")
   .setFooter(client.user.tag,client.user.displayAvatarURL());
  
  if(!args[0]) return message.author.send(sectionEmbed)
  
  }
}