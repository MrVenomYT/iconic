const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class MessageEvent extends BaseEvent {
  constructor() {
    super('message');
  }
  
  async run(client, message) {
    if (!message || message.author?.bot) return;

    let content = message.content.trim();
    let prefixUsed = null;

    const allowedPrefixes = ['/', '!', '+', client.prefix || '!'];
    const mentionPrefix = `<@!${client.user?.id}>`;
    const mentionPrefix2 = `<@${client.user?.id}>`;

    if (content.startsWith(mentionPrefix)) {
      prefixUsed = mentionPrefix;
    } else if (content.startsWith(mentionPrefix2)) {
      prefixUsed = mentionPrefix2;
    } else {
      for (const p of allowedPrefixes) {
        if (p && content.startsWith(p)) {
          prefixUsed = p;
          break;
        }
      }
    }

    if (!prefixUsed) return;

    const withoutPrefix = content.slice(prefixUsed.length).trim();
    if (!withoutPrefix) return;

    const [cmdNameRaw, ...cmdArgs] = withoutPrefix.split(/\s+/);
    if (!cmdNameRaw) return;

    const cmdName = cmdNameRaw.toLowerCase();
    const command = client.commands.get(cmdName);

    if (command) {
      try {
        await command.run(client, message, cmdArgs);
      } catch (err) {
        console.error(`Error running command "${cmdName}":`, err);
        message.channel.send(`Command execution notice: ${err.message}`).catch(() => {});
      }
    }
  }
};
