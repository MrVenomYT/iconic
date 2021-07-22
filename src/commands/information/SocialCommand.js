const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require("discord.js")
module.exports = class SocialCommand extends BaseCommand {
  constructor() {
    super('social', 'information', []);
  }

  async run(client, message, args) {
    // message.channel.send('social command works');
    const youtubeEmbed = new Discord.MessageEmbed()
    .setTitle('VENOM')
    .setURL('https://www.youtube.com/channel/UCgkRkvD3IiZCtaxjyG-mwSA')
    .setThumbnail('https://pngimg.com/uploads/youtube/youtube_PNG14.png')
    .setColor("#ffda1a")
    .addField('Check out To VENOM\'s youtube channel' , 'New How To Code A Discord Bot Series!!!(CLICK THE ABOVE LINK)' )
    .setTimestamp()
    .setFooter('VENOM' , 'https://lh3.googleusercontent.com/ogw/ADea4I4BzyfO-8vYFSdjpA94qN8pihXO8Jl9e__ZWD6bSg=s192-c-mo');
    
    const discordEmbed = new Discord.MessageEmbed()
    .setTitle('VENOMOUS')
    .setURL('https://discord.gg/FTbJmrVq5t')
    .setThumbnail('https://th.bing.com/th/id/R5ff232157d19b921f7dc016519e3c577?rik=rCCmTtROzGv0Og&pid=ImgRaw')
    .setColor("#ffda1a")
    .addField('VENOMOUS EMPIRE' , 'CUSTOM BOTS' , 'GIVEAWAYS' , 'SUPPORT' , 'BOOSTED' )
    .setTimestamp()
    .setFooter('VENOMOUS' , 'https://th.bing.com/th/id/OIP.jzDqKISSbCMlwI4he9lVwwHaEK?pid=ImgDet&rs=1');

    const githubEmbed = new Discord.MessageEmbed()
    .setTitle('venom-hun5')
    .setURL('https://www.github.com/venom-hun5')
    .setThumbnail('https://pngimg.com/uploads/github/github_PNG85.png')
    .setColor("#ffda1a")
    .addField('Check out To VENOM\'s GITHUB PROFILE')
    .setTimestamp()
    .setFooter('venom-hun5' , 'https://avatars.githubusercontent.com/u/62616894?v=4');
    await message.channel.send(youtubeEmbed).catch(err => console.log(err))
    await message.channel.send(discordEmbed).catch(err => console.log(err))
    await message.channel.send(githubEmbed).catch(err => console.log(err))

  }
}