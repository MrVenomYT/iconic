const BaseCommand = require('../../utils/structures/BaseCommand');
const discord = require("discord.js");
const imdb = require("imdb-api");

module.exports = class ImdbCommand extends BaseCommand {
  constructor() {
    super('imdb', 'fun', []);
  }

  async run(client, message, args)  {
    
    if(!args.length) {
      return message.channel.send("Please give the name of movie or series")
    }
    
    const imob = new imdb.Client({apiKey: "5e36f0db"}) //You need to paste you imdb api
    
    let movie = await imob.get({'name': args.join(" ")})
    
    let embed = new discord.MessageEmbed()
    .setTitle(movie.title)
    .setColor("RANDOM")
    .setThumbnail(movie.poster)
    .setDescription(movie.plot)
    .setFooter(`Ratings: ${movie.rating}`)
    .addField("Country", movie.country, true)
    .addField("Languages", movie.languages, true)
    .addField("Type", movie.type, true);
    
    
    await message.channel.send(embed)
    
    
    
  }

}