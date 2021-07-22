const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require("discord.js");
const figlet = require("figlet");
module.exports = class AsciiCommand extends BaseCommand {
  constructor() {
    super('ascii', 'tools', []);
  }

  async run(client, message, args) {
    let p = args.join(" ")
    figlet(p, function(err, data) {
        if (err) {
            message.channel.send('Something went wrong...');
            console.dir(err);
            return;
        }
        message.channel.send(`\`\`\`${data}\`\`\``)
    });
  }
}