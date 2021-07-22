const { Collection } = require('discord.js');
const fs = require('fs');

module.exports = {
    djsEvents: async (eventFiles, path, client) => {
        for (const file of eventFiles) {
            const event = require(`../../${path}/${file}`);
            console.log(`Discord.JS Event: ${event.name} | Loaded Successfully.`);
            if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
            else client.on(event.name, (...args) => event.execute(...args, client));
        };
    },

    mongoEvents: async (eventFiles, path, client, mongoose) => {
        for (const file of eventFiles) {
            const event = require(`../../${path}/${file}`);
            console.log(`Mongoose Connection Event: ${event.name} | Loaded Successfully.`);
            if (event.once) mongoose.connection.once(event.name, (...args) => event.execute(...args, client));
            else mongoose.connection.on(event.name, (...args) => event.execute(...args, client));
        }
    },

    commands: async (commandFolders, path, client) => {
        client.commands = new Collection();
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`../../${path}/${folder}/${file}`);
                client.commands.set(command.name, command);
                console.log(`Command: ${command.name} | Loaded Successfully.`);
            }
        }
    }
};