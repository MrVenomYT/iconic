const BaseEvent = require("../../utils/structures/BaseEvent");
const Discord = require('discord.js');
const { users } = require("node-os-utils");
const config = require('../../../slappey.json')
const prefix = require('../../../slappey.json')
const { Client } = require("discord.js");

module.exports = {
	
	execute(client) {
		console.log(`${client.user.tag} has logged in`);
	},
};

module.exports = class ReadyEvent extends BaseEvent {
  constructor() {
    super("ready");
    
  }
  
  async run(client) {
  //  let username = Iconice;
    let serverIn = await client.guilds.cache.size;
    console.log(client.user.tag + " has logged in.");
    // Set the client user's presence
    client.user
      .setPresence({
        activity: {
          name: `${config.prefix} | ${serverIn} servers. `,
          type: "WATCHING",
        },
        status: "online",
      })

      .catch(console.error);
    // // Set username
    // client.user
    //   .setUsername(`${client.user.tag} ${client.username}`)
    //   .then(
    //     (user) => console.log(`My new username is ${user.username}`))
    //   .catch(console.error);
  //   client.user.setAvatar('./images/avatar.png')
  // .then(user => console.log(`New avatar set!`))
  // .catch(console.error);
  }
};
