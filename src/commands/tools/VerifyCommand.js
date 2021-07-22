const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js')
module.exports = class VerifyCommand extends BaseCommand {
  constructor() {
    super('verify', 'tools', []);
  }

  async run(client, message, args) {
    //permission checking
    if(!message.guild.me.hasPermission('MANAGE_ROLES')) return message.channel.send('I require \`MANAGE_ROLES \`permission to change names');

//variables
const role = message.guild.roles.cache.get('855821764533682207');

//executing
await message.member.roles.add(role.id).catch(err => console.log(err)).then(message.channel.send("You Have Given The Verified Role"))

  }
}