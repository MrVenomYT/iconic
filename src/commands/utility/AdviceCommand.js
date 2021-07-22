const BaseCommand = require('../../utils/structures/BaseCommand');
const api = require("srod-v2");
const Discord = require("discord.js");
module.exports = class AdviceCommand extends BaseCommand {
  constructor() {
    super('advice', 'utility', []);
  }

 async run(client, message, args) {
    
    const Data = await api.GetAdvice({ Color: "YELLOW" });
    return message.channel.send(Data);
  }
};