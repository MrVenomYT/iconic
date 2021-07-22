const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js');

module.exports = class SayCommand extends BaseCommand {
  constructor() {
    super('say', 'fun', []);
  }

  async run(client, message, args) {
    // message.channel.send('say command works');
    const  messageToSay = args.join(" ");
    // const sayEmbed = new Discord.MessageEmbed()
    // .setTitle(`${message.author.tag} says: ${messageToSay}`)
    // .setFooter(message.author.tag ,message.author.displayAvatarURL())
    // .setColor("#ffda1a")
    // .setTimestamp();
    try{
      await message.channel.send(messageToSay);
    }catch(err){
      console.log(err);
      message.channel.send("I am not able to say that message");
    }
  }
}