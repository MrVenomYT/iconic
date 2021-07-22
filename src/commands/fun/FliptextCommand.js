const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = module.require("discord.js");
const flip = require("flip-text");

module.exports = class FliptextCommand extends BaseCommand {
  constructor() {
    super('fliptext', 'fun', []);
  }

 async run(client, message, args) {
  if (args.length < 1) {
    return message.channel.send("Please enter some text to flip")
  }
args.reverse();
var flipped = [];

args.forEach((arg) => {
  flipped.push(flip(arg));
});

await message.channel.send(flipped.join(" "));
  }
}