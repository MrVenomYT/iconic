const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class ServeripCommand extends BaseCommand {
  constructor() {
    super('Serverip', 'information', []);
  }

  run(client, message, args) {
    message.channel.send('Serverip command works');
  }
}