const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js')

const axios = require('axios')

module.exports = class BinaryCommand extends BaseCommand {
  constructor() {
    super('binary', 'tools', []);
  }

  async run(client, message, args) {
        
    const url = `http://some-random-api.ml/binary?text=${args}`;

let response, data;
try {
response = await axios.get(url);
data = response.data;
} catch (e) {
return message.channel.send(`An error occured, please try again!`);
}

const embed = new MessageEmbed()
.setTitle("Text to Binary")
.setThumbnail(
  "https://png.pngtree.com/png-clipart/20200225/original/pngtree-binary-code-and-magnifying-glass-isometric-icon-png-image_5252004.jpg"
)

.setDescription("**Binary Code** - `" + data.binary + "`")
.setTimestamp()
.setFooter(client.user.tag,client.user.displayAvatarURL())
.setColor("#ffda1a")
.setTimestamp();
await message.channel.send(embed);

}
}
