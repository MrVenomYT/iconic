const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js');
module.exports = class UptimeCommand extends BaseCommand {
  constructor() {
    super('uptime', 'information', []);
  }

  async run(client, message, args) {
    let Days = Math.floor(client.uptime / 86400000);
    let Hours = Math.floor(client.uptime / 3600000) % 24;
    let Minutes = Math.floor(client.uptime / 60000) % 60;
    let Seconds = Math.floor(client.uptime / 1000) % 60;    
    const RemoveUseless = (Duration) => {
  return Duration.replace("0 Day\n", "").replace("0 Hour\n", "").replace("0 Minute\n", "");
};
let Uptime = await RemoveUseless(`\`${Days}\` ${Days > 1 ? "Days" : "Day"} \`${Hours}\` ${Hours > 1 ? "Hours" : "Hour"} \`${Minutes}\` ${Minutes > 1 ? "Minutes" : "Minute"} \`${Seconds}\` ${Seconds > 1 ? "Seconds" : "Second"}`);

const embed = new Discord.MessageEmbed() 
.setTitle( `${client.user.tag}` ,`My Uptime`)
.setThumbnail(client.user.displayAvatarURL())
.setDescription(`${Uptime}`)
.setTimestamp();

await message.channel.send(embed)
  }
}