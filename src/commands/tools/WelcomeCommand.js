const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class WelcomeCommand extends BaseCommand {
  constructor() {
    super('welcome', 'tools', []);
  }

  run(client, message, args) {
    message.channel.send('welcome command works');
  }
}