const db = require('quick.db');
const Discord = require('discord.js');
const { Client } = require('discord.js');
const client = new Discord.Client();
const mongoose = require('./database/mongoose');
const { registerCommands, registerEvents } = require('./utils/registry');
const config = require('../slappey.json');

//require("dotenv").config();
const fs = require('fs');
const { init } = require('./database/mongoose');
// const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));


(async () => {
  client.commands = new Map();
  client.events = new Map();
  client.prefix = config.prefix;
  mongoose.init();
  await registerCommands(client, '../commands');
  await registerEvents(client, '../events');
  await client.login(config.token);
  // require("dotenv").config();
})();

const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}