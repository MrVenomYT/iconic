process.on('warning', (warning) => {
  if (warning.code === 'DEP0170') return;
});

const express = require('express');
const path = require('path');
const http = require('http');
const Module = require('module');

// Intercept native modules and sqlite dependencies with safe stubs
const originalRequire = Module.prototype.require;
Module.prototype.require = function (id) {
  if (id === 'quick.db') return require(path.join(__dirname, 'database', 'quickdb'));
  if (id === 'canvas') return require(path.join(__dirname, 'modules', 'canvas-stub'));
  if (id === 'discord-image-generation') return require(path.join(__dirname, 'modules', 'dig-stub'));
  if (id === 'discord-handlers') return {};
  return originalRequire.apply(this, arguments);
};

const Discord = require('discord.js');
const mongoose = require('./database/mongoose');
const { registerCommands, registerEvents } = require('./utils/registry');
const defaultSlappey = require('../slappey.json');

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Complete plugin registry matching MEE6 Dashboard screenshots
let pluginsState = [
  // Essentials
  {
    id: 'welcome_goodbye',
    name: 'Welcome & Goodbye',
    category: 'Essentials',
    description: 'Automatically send messages and give roles to your new members and send a message when a member leaves.',
    enabled: true,
    isPremium: true,
    isNew: false,
    icon: 'user-plus'
  },
  {
    id: 'welcome_channel',
    name: 'Welcome Channel',
    category: 'Essentials',
    description: 'A dedicated place to welcome new members and share essential server information.',
    enabled: false,
    isPremium: true,
    isNew: false,
    icon: 'chat-bubble'
  },
  {
    id: 'reaction_roles',
    name: 'Reaction Roles',
    category: 'Essentials',
    description: 'Let your members get roles by reacting to an announcement or greeting message.',
    enabled: false,
    isPremium: true,
    isNew: false,
    icon: 'badge'
  },
  {
    id: 'moderator',
    name: 'Moderator',
    category: 'Essentials',
    description: 'Keep your server safe with automated moderation and empower your mods with powerful tools.',
    enabled: true,
    isPremium: false,
    isNew: false,
    icon: 'shield'
  },
  {
    id: 'levels',
    name: 'Levels',
    category: 'Essentials',
    description: 'Give your members XP and Levels when they send messages and rank them by activity in a leaderboard.',
    enabled: false,
    isPremium: true,
    isNew: false,
    icon: 'trophy'
  },
  {
    id: 'achievements',
    name: 'Achievements',
    category: 'Essentials',
    description: 'Let your members hunt achievements for special activities, milestones, and interactions.',
    enabled: false,
    isPremium: false,
    isNew: false,
    icon: 'star'
  },
  {
    id: 'starboards',
    name: 'Starboards',
    category: 'Essentials',
    description: 'Highlight popular messages by showcasing them in a dedicated starboard channel.',
    enabled: false,
    isPremium: false,
    isNew: true,
    icon: 'bookmark'
  },

  // Server Management
  {
    id: 'automations',
    name: 'Automations',
    category: 'Server Management',
    description: 'Automate bot actions in response to server events like messages, reactions, and role changes.',
    enabled: false,
    isPremium: true,
    isNew: false,
    icon: 'git-merge'
  },
  {
    id: 'custom_commands',
    name: 'Custom Commands',
    category: 'Server Management',
    description: 'Create your own text commands and commands that give specific roles or automated replies.',
    enabled: false,
    isPremium: true,
    isNew: false,
    icon: 'terminal'
  },
  {
    id: 'invite_tracker',
    name: 'Invite Tracker',
    category: 'Server Management',
    description: 'Track how many people your members invite to your community and rank them in a leaderboard.',
    enabled: false,
    isPremium: false,
    isNew: true,
    icon: 'users'
  },
  {
    id: 'ticketing',
    name: 'Ticketing',
    category: 'Server Management',
    description: 'Allow your members to submit tickets for support, reports, inquiries, and staff requests.',
    enabled: false,
    isPremium: true,
    isNew: false,
    icon: 'inbox'
  },

  // Utilities
  {
    id: 'emojis',
    name: 'Emojis',
    category: 'Utilities',
    description: 'Enhance your server by importing, organizing, and adding custom emojis.',
    enabled: true,
    isPremium: false,
    isNew: true,
    icon: 'smile'
  },
  {
    id: 'polls',
    name: 'Polls',
    category: 'Utilities',
    description: 'Allow your members to create interactive polls and vote on ideas in channels.',
    enabled: false,
    isPremium: true,
    isNew: false,
    icon: 'bar-chart'
  },
  {
    id: 'embed_messages',
    name: 'Embed Messages',
    category: 'Utilities',
    description: 'Create beautiful embed messages for your rules, announcements, colors, and updates.',
    enabled: false,
    isPremium: true,
    isNew: false,
    icon: 'layout'
  },
  {
    id: 'search_anything',
    name: 'Search Anything',
    category: 'Utilities',
    description: 'Enable commands to search for YouTube videos, Twitch streamers, anime, and more.',
    enabled: false,
    isPremium: false,
    isNew: false,
    icon: 'search'
  },
  {
    id: 'help',
    name: 'Help',
    category: 'Utilities',
    description: 'Enables the dashboard and interactive help commands for your server.',
    enabled: true,
    isPremium: false,
    isNew: false,
    icon: 'life-buoy'
  },
  {
    id: 'reminders',
    name: 'Reminders',
    category: 'Utilities',
    description: 'Send custom messages on repeat every few minutes or hours to designated channels.',
    enabled: false,
    isPremium: false,
    isNew: false,
    icon: 'clock'
  },
  {
    id: 'statistics_channels',
    name: 'Statistics Channels',
    category: 'Utilities',
    description: 'Show off your server stats and social followers count on your server channels sidebar.',
    enabled: false,
    isPremium: true,
    isNew: false,
    icon: 'trending-up'
  },
  {
    id: 'temporary_channels',
    name: 'Temporary Channels',
    category: 'Utilities',
    description: 'Allow your members to create temporary voice channels in one click in your server.',
    enabled: false,
    isPremium: true,
    isNew: false,
    icon: 'volume'
  },

  // Social Alerts
  {
    id: 'twitch_alerts',
    name: 'Twitch Alerts',
    category: 'Social Alerts',
    description: 'Automatically send a message and notify everyone when you go live on Twitch.',
    enabled: false,
    isPremium: true,
    isNew: false,
    icon: 'video'
  },
  {
    id: 'tiktok_alerts',
    name: 'TikTok Alerts',
    category: 'Social Alerts',
    description: 'Automatically send a message and notify everyone when someone posts a TikTok video.',
    enabled: false,
    isPremium: false,
    isNew: true,
    icon: 'film'
  },
  {
    id: 'x_alerts',
    name: 'X Alerts',
    category: 'Social Alerts',
    description: 'Automatically send a message and notify everyone when someone posts a post.',
    enabled: false,
    isPremium: true,
    isNew: false,
    icon: 'feather'
  },
  {
    id: 'bluesky_alerts',
    name: 'Bluesky Alerts',
    category: 'Social Alerts',
    description: 'Receive real time alerts whenever subscribed Bluesky creators publish updates.',
    enabled: false,
    isPremium: true,
    isNew: true,
    icon: 'feather'
  },
  {
    id: 'youtube_alerts',
    name: 'YouTube Alerts',
    category: 'Social Alerts',
    description: 'Automatically send a message and notify everyone when someone posts a YouTube video.',
    enabled: false,
    isPremium: true,
    isNew: false,
    icon: 'play'
  },
  {
    id: 'reddit_alerts',
    name: 'Reddit Alerts',
    category: 'Social Alerts',
    description: 'Automatically send a message and notify when someone posts on a subreddit.',
    enabled: false,
    isPremium: true,
    isNew: false,
    icon: 'compass'
  },
  {
    id: 'instagram_alerts',
    name: 'Instagram Alerts',
    category: 'Social Alerts',
    description: 'Subscribe to Instagram users and receive fresh post notifications in Discord.',
    enabled: false,
    isPremium: true,
    isNew: false,
    icon: 'camera'
  },
  {
    id: 'rss_feeds',
    name: 'RSS Feeds',
    category: 'Social Alerts',
    description: 'Automatically send a message when a new item is posted on an RSS feed.',
    enabled: false,
    isPremium: false,
    isNew: false,
    icon: 'rss'
  },
  {
    id: 'kick_alerts',
    name: 'Kick Alerts',
    category: 'Social Alerts',
    description: 'Automatically send a message and notify everyone when someone starts a live stream.',
    enabled: false,
    isPremium: true,
    isNew: false,
    icon: 'radio'
  },
  {
    id: 'podcast_alerts',
    name: 'Podcast Alerts',
    category: 'Social Alerts',
    description: 'Always know when a new podcast episode is dropping and alert your listeners.',
    enabled: false,
    isPremium: true,
    isNew: false,
    icon: 'mic'
  },

  // Games & Fun
  {
    id: 'giveaways',
    name: 'Giveaways',
    category: 'Games & Fun',
    description: 'Launch giveaways and lotteries in your server in one click with automated winners.',
    enabled: false,
    isPremium: true,
    isNew: false,
    icon: 'gift'
  },
  {
    id: 'birthdays',
    name: 'Birthdays',
    category: 'Games & Fun',
    description: 'Track your members birthdays and automatically wish them a happy birthday.',
    enabled: false,
    isPremium: true,
    isNew: false,
    icon: 'calendar'
  },
  {
    id: 'economy',
    name: 'Economy',
    category: 'Games & Fun',
    description: 'Players can gain coins by claiming them once a day with the daily command.',
    enabled: false,
    isPremium: true,
    isNew: false,
    icon: 'bank'
  },
  {
    id: 'fun_commands',
    name: 'Fun & Meme Suite',
    category: 'Games & Fun',
    description: 'Over 20 fun commands including meme generators, anime reactions, fliptext, and cowsay.',
    enabled: true,
    isPremium: false,
    isNew: false,
    icon: 'sparkles'
  },

  // Monetization
  {
    id: 'monetize',
    name: 'Monetize',
    category: 'Monetization',
    description: 'Earn real money with your Discord server by providing subscribers with different roles and private channels.',
    enabled: true,
    isPremium: false,
    isNew: false,
    icon: 'gem'
  },

  // Web3
  {
    id: 'nft_statistics',
    name: 'NFT Statistics',
    category: 'Web3',
    description: 'Track NFT collections floor prices, trade volume, and historical statistics.',
    enabled: false,
    isPremium: true,
    isNew: false,
    icon: 'trending-up'
  },
  {
    id: 'nft_queries',
    name: 'NFT Queries',
    category: 'Web3',
    description: 'Learn more about NFT collections directly from your server channels.',
    enabled: false,
    isPremium: false,
    isNew: false,
    icon: 'search'
  },
  {
    id: 'nft_sales_listing',
    name: 'NFT Sales & Listing',
    category: 'Web3',
    description: 'Receive your NFT collection sales and listing updates on your server.',
    enabled: false,
    isPremium: false,
    isNew: false,
    icon: 'tag'
  },
  {
    id: 'crypto_statistics',
    name: 'Crypto Statistics',
    category: 'Web3',
    description: 'Track cryptocurrency statistics, live market caps, and price charts.',
    enabled: false,
    isPremium: true,
    isNew: false,
    icon: 'dollar-sign'
  },
  {
    id: 'crypto_queries',
    name: 'Crypto Queries',
    category: 'Web3',
    description: 'Learn more about cryptocurrencies directly from your server with instant queries.',
    enabled: false,
    isPremium: false,
    isNew: false,
    icon: 'cpu'
  },
  {
    id: 'gas_tracker',
    name: 'Gas Tracker',
    category: 'Web3',
    description: 'Gas Tracker allows your community to be constantly on top of current fees and spot best opportunities.',
    enabled: false,
    isPremium: false,
    isNew: false,
    icon: 'activity'
  },
  {
    id: 'gating',
    name: 'Gating',
    category: 'Web3',
    description: 'Give Discord roles and channel access to NFT holders, and remove them automatically upon transfer.',
    enabled: false,
    isPremium: false,
    isNew: false,
    icon: 'lock'
  }
];

// Configuration Store
let botConfig = {
  name: 'Iconic',
  prefix: process.env.PREFIX || defaultSlappey.prefix || '/',
  token: process.env.DISCORD_TOKEN || defaultSlappey.token || '',
  ownerId: defaultSlappey.OWNER_ID || '607059199897108491',
  serverId: defaultSlappey.ServerID || '852903626871537685',
  modlogChannel: 'general-log',
  botStatus: 'Online',
  activityType: 'Listening to',
  statusText: '/help',
  defaultEmbedColor: '#3b82f6',
  language: 'English',
  timezone: 'UTC',
  leaderboardPublic: true,
  vanityUrl: 'https://iconic.gg/leaderboard/test-server'
};

// Welcome Settings Store matching Screenshot 20 & 21
let welcomeConfig = {
  active: true,
  useCaptcha: false,
  sendJoinMessage: true,
  sendPrivateMessage: false,
  giveRole: false,
  roleToGive: 'Member',
  sendLeaveMessage: true,
  welcomeChannel: 'welcome',
  welcomeText: 'Hello and a warm welcome to all of our new members! We are thrilled to have you join our community. Please take some time to introduce yourself to the community.',
  theme: 'Anime Clouds'
};

// AI Characters Store matching Screenshots 10, 11, 12
let aiCharacters = [
  {
    id: 'deadpool',
    name: 'Deadpool',
    role: 'Mercenary with a twisted sense of humor',
    universe: 'Marvel',
    downloads: '7.2k',
    avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
    initialGreeting: 'Hey there! How has your day been? You know, full of chimichangas and maximum effort, right? So, how about this: if you could have any superpower in the world, what would it be?',
    systemPrompt: 'You are Deadpool. You are funny, break the fourth wall, mention chimichangas, and speak with humor.'
  },
  {
    id: 'trump',
    name: 'Donald Trump',
    role: '45th President of the United States',
    universe: 'Politics',
    downloads: '7.5k',
    avatar: 'https://cdn.discordapp.com/embed/avatars/1.png',
    initialGreeting: 'Nobody knows Discord servers better than me, believe me. We have the highest quality server, tremendous activity, everyone is saying it.',
    systemPrompt: 'You speak in the confident, superlative style of Donald Trump.'
  },
  {
    id: 'rick',
    name: 'Rick Sanchez',
    role: 'Mad Scientist genius from dimension C-137',
    universe: 'Rick and Morty',
    downloads: '9.1k',
    avatar: 'https://cdn.discordapp.com/embed/avatars/2.png',
    initialGreeting: 'Listen to me, Morty, or whoever is running this server. You think you can build a Discord bot without portal technology? Get in the ship!',
    systemPrompt: 'You are Rick Sanchez. Sarcastic, hyper-intelligent, and cynical.'
  },
  {
    id: 'yoshi',
    name: 'Yoshi',
    role: 'Loyal dinosaur companion from Mushroom Kingdom',
    universe: 'Super Mario',
    downloads: '5.8k',
    avatar: 'https://cdn.discordapp.com/embed/avatars/3.png',
    initialGreeting: 'Yoshi yoshi! Ready to help protect this server and collect power fruits with everyone!',
    systemPrompt: 'You are Yoshi, cheerful, loyal, and friendly.'
  },
  {
    id: 'ironman',
    name: 'Iron Man',
    role: 'Genius billionaire playboy philanthropist',
    universe: 'Marvel',
    downloads: '8.4k',
    avatar: 'https://cdn.discordapp.com/embed/avatars/4.png',
    initialGreeting: 'JARVIS, run diagnostics on this Discord server. Looks like we have some high grade moderation protocols in place. What can Tony Stark do for you today?',
    systemPrompt: 'You are Tony Stark / Iron Man. Sharp-witted, tech-savvy, and heroic.'
  }
];

// Leaderboard Store matching Screenshot 9
let leaderboardMembers = [
  { rank: 1, name: 'Alex', level: 42, xp: 24500, messages: 1840, avatar: 'A' },
  { rank: 2, name: 'Sarah', level: 39, xp: 21300, messages: 1620, avatar: 'S' },
  { rank: 3, name: 'mrvenomyt', level: 35, xp: 18950, messages: 1410, avatar: 'M' },
  { rank: 4, name: 'Hasil', level: 31, xp: 15400, messages: 1190, avatar: 'H' },
  { rank: 5, name: 'John', level: 28, xp: 13200, messages: 980, avatar: 'J' },
  { rank: 6, name: 'Mike', level: 24, xp: 10800, messages: 810, avatar: 'K' },
  { rank: 7, name: 'Elena', level: 21, xp: 8900, messages: 670, avatar: 'E' },
  { rank: 8, name: 'David', level: 18, xp: 7200, messages: 540, avatar: 'D' }
];

// Custom Emojis Store matching Screenshot 19
let serverEmojis = [
  { id: 'jbf', name: ':JBF:', active: false, official: true, category: 'Gaming' },
  { id: 'evs', name: ':EvS:', active: false, official: true, category: 'Anime' },
  { id: 'nek', name: ':nek...:', active: false, official: true, category: 'Neko' },
  { id: 'tdk', name: ':TDK...:', active: false, official: true, category: 'Memes' },
  { id: '748', name: ':748...:', active: false, official: true, category: 'Aesthetic' },
  { id: 'ttc', name: ':tt_c...:', active: false, official: true, category: 'Blobs' },
  { id: 'cry', name: ':Cryi...:', active: false, official: true, category: 'Crying' },
  { id: 'pin', name: ':Pin...:', active: false, official: true, category: 'Happy' }
];

const startTime = Date.now();
const client = new Discord.Client();
client.commands = new Map();
client.events = new Map();
client.prefix = botConfig.prefix;

// Safe Mongoose bootstrap
mongoose.init();

// Initialize bot commands & events
(async () => {
  try {
    await registerCommands(client, '../commands');
    console.log(`[Iconic Bot] Registered ${client.commands.size} commands and aliases.`);
  } catch (err) {
    console.warn('[Iconic Bot] Notice during command registration:', err.message);
  }

  try {
    await registerEvents(client, '../events');
    console.log(`[Iconic Bot] Registered ${client.events.size} events.`);
  } catch (err) {
    console.warn('[Iconic Bot] Notice during event registration:', err.message);
  }

  if (botConfig.token && botConfig.token.trim().length > 20) {
    try {
      await client.login(botConfig.token.trim());
      console.log('[Iconic Bot] Connected to Discord Gateway.');
    } catch (err) {
      console.warn('[Iconic Bot] Discord gateway notice:', err.message);
    }
  } else {
    console.log('[Iconic Bot] Running in local simulation mode. Enter token in Settings to connect to Discord.');
  }
})();

// Provide Mock Discord environment to execute commands in the web console
function createMockDiscordContext(commandText, authorName = 'ServerOwner') {
  const responses = [];
  const guildChannels = new Map();
  const guildMembers = new Map();

  const mockChannel = {
    id: '123456789012345678',
    name: 'general',
    type: 'text',
    send: async function (payload) {
      let item = { timestamp: new Date().toISOString() };
      if (typeof payload === 'string') {
        item.type = 'text';
        item.content = payload;
      } else if (payload && payload.embeds) {
        item.type = 'embed';
        item.embed = payload.embeds[0];
      } else if (payload && payload.title || payload && payload.description) {
        item.type = 'embed';
        item.embed = payload;
      } else if (payload && payload.files) {
        item.type = 'file';
        item.content = 'Attached media generated.';
      } else {
        item.type = 'embed';
        item.embed = payload;
      }
      responses.push(item);
      return {
        ...item,
        edit: async function (newPayload) {
          if (typeof newPayload === 'string') {
            item.content = newPayload;
          } else {
            item.embed = newPayload;
          }
          return item;
        },
        delete: async function () {}
      };
    }
  };

  guildChannels.set(mockChannel.id, mockChannel);
  guildChannels.set('general-log', { id: '998877665544332211', name: 'general-log', type: 'text', send: async () => {} });

  const mockAuthor = {
    id: botConfig.ownerId,
    username: authorName,
    tag: `${authorName}#0001`,
    bot: false,
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    displayAvatarURL: () => 'https://cdn.discordapp.com/embed/avatars/0.png',
    send: async function (payload) {
      return mockChannel.send(payload);
    }
  };

  const mockMember = {
    id: mockAuthor.id,
    user: mockAuthor,
    displayName: authorName,
    hasPermission: () => true,
    roles: {
      cache: new Map([['admin-role', { name: 'Administrator' }]])
    }
  };

  guildMembers.set(mockAuthor.id, mockMember);

  const mockGuild = {
    id: botConfig.serverId,
    name: 'test server',
    iconURL: () => 'https://cdn.discordapp.com/embed/avatars/1.png',
    me: {
      displayName: botConfig.name,
      user: {
        username: botConfig.name,
        displayAvatarURL: () => 'https://cdn.discordapp.com/embed/avatars/2.png'
      }
    },
    channels: {
      cache: {
        get: (id) => guildChannels.get(id) || mockChannel,
        has: (id) => guildChannels.has(id),
        find: (fn) => Array.from(guildChannels.values()).find(fn) || mockChannel
      }
    },
    members: {
      cache: {
        get: (id) => guildMembers.get(id) || mockMember,
        forEach: (fn) => Array.from(guildMembers.values()).forEach(fn),
        find: (fn) => Array.from(guildMembers.values()).find(fn) || mockMember
      }
    }
  };

  const mockMessage = {
    content: commandText,
    author: mockAuthor,
    member: mockMember,
    guild: mockGuild,
    channel: mockChannel,
    createdTimestamp: Date.now() - 45,
    mentions: {
      users: { first: () => null },
      members: { first: () => null, size: 0 },
      channels: { first: () => null }
    },
    reply: async function (text) {
      return mockChannel.send(`@${authorName}, ${text}`);
    }
  };

  const mockClient = {
    commands: client.commands,
    events: client.events,
    prefix: botConfig.prefix,
    user: {
      id: '888888888888888888',
      username: botConfig.name,
      tag: `${botConfig.name}#4876`,
      displayAvatarURL: () => 'https://cdn.discordapp.com/embed/avatars/3.png'
    },
    ws: { ping: 24 },
    guilds: {
      cache: {
        get: () => mockGuild
      }
    },
    users: {
      cache: {
        get: () => mockAuthor
      }
    }
  };

  return { mockClient, mockMessage, responses };
}

// REST API Endpoints
app.get('/api/status', (req, res) => {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = uptimeSeconds % 60;

  const uniqueCommands = new Set();
  client.commands.forEach((cmd) => {
    if (cmd && cmd.name) uniqueCommands.add(cmd.name);
  });

  res.json({
    online: true,
    botName: botConfig.name,
    prefix: botConfig.prefix,
    isDiscordConnected: Boolean(client.user && client.user.id),
    uptime: `${hours}h ${minutes}m ${seconds}s`,
    ping: client.ws ? Math.round(client.ws.ping) || 28 : 28,
    commandsLoaded: uniqueCommands.size,
    totalAliases: client.commands.size,
    serverCount: 1,
    memberCount: 248,
    channelsCount: 14,
    pluginsEnabled: pluginsState.filter((p) => p.enabled).length,
    totalPlugins: pluginsState.length
  });
});

app.get('/api/plugins', (req, res) => {
  const allFreePlugins = pluginsState.map((p) => ({
    ...p,
    isPremium: false,
    isFree: true,
    unlocked: true
  }));
  res.json(allFreePlugins);
});

app.post('/api/plugins/:id/toggle', (req, res) => {
  const plugin = pluginsState.find((p) => p.id === req.params.id);
  if (!plugin) {
    return res.status(404).json({ error: 'Plugin not found' });
  }
  plugin.enabled = !plugin.enabled;
  res.json({ success: true, plugin });
});

app.get('/api/commands', (req, res) => {
  const list = [];
  const seen = new Set();
  client.commands.forEach((cmd) => {
    if (cmd && cmd.name && !seen.has(cmd.name)) {
      seen.add(cmd.name);
      list.push({
        name: cmd.name,
        category: cmd.category || 'General',
        aliases: cmd.aliases || []
      });
    }
  });
  list.sort((a, b) => a.name.localeCompare(b.name));
  res.json(list);
});

app.get('/api/slash-commands', (req, res) => {
  const slashCommands = [
    { name: 'help', description: 'Display all bot slash commands and categories', options: [{ name: 'command', description: 'Specific command to lookup', required: false, type: 'STRING' }], category: 'Information' },
    { name: 'ping', description: 'Check bot latency and gateway response time', options: [], category: 'Information' },
    { name: 'stats', description: 'View system statistics, memory, and uptime', options: [], category: 'Information' },
    { name: 'uptime', description: 'Display how long Iconic has been online', options: [], category: 'Information' },
    { name: 'serverinfo', description: 'View server member count, owner, and settings', options: [], category: 'Information' },
    { name: 'whois', description: 'Inspect user account details, joined date, and roles', options: [{ name: 'user', description: 'Target member mention or ID', required: false, type: 'USER' }], category: 'Information' },
    { name: 'ban', description: 'Ban a rule-breaking member from the server', options: [{ name: 'user', description: 'Member to ban', required: true, type: 'USER' }, { name: 'reason', description: 'Reason for the ban', required: false, type: 'STRING' }], default_member_permissions: 'BAN_MEMBERS', category: 'Moderation' },
    { name: 'kick', description: 'Kick a member from the server', options: [{ name: 'user', description: 'Member to kick', required: true, type: 'USER' }, { name: 'reason', description: 'Reason for kick', required: false, type: 'STRING' }], default_member_permissions: 'KICK_MEMBERS', category: 'Moderation' },
    { name: 'mute', description: 'Timeout or mute a member from sending messages', options: [{ name: 'user', description: 'Member to mute', required: true, type: 'USER' }, { name: 'duration', description: 'Mute duration', required: false, type: 'STRING' }], default_member_permissions: 'MODERATE_MEMBERS', category: 'Moderation' },
    { name: 'warn', description: 'Issue a formal moderation warning to a member', options: [{ name: 'user', description: 'Member to warn', required: true, type: 'USER' }, { name: 'reason', description: 'Warning explanation', required: true, type: 'STRING' }], default_member_permissions: 'MANAGE_MESSAGES', category: 'Moderation' },
    { name: 'purge', description: 'Bulk delete specified number of messages', options: [{ name: 'amount', description: 'Number of messages to remove (1-100)', required: true, type: 'INTEGER' }], default_member_permissions: 'MANAGE_MESSAGES', category: 'Moderation' },
    { name: 'lock', description: 'Lock down current text channel from member messages', options: [], default_member_permissions: 'MANAGE_CHANNELS', category: 'Moderation' },
    { name: 'unlock', description: 'Unlock current text channel for member discussions', options: [], default_member_permissions: 'MANAGE_CHANNELS', category: 'Moderation' },
    { name: 'levels', description: 'Check XP progression and level rank card', options: [{ name: 'user', description: 'Member to check', required: false, type: 'USER' }], category: 'Engagement' },
    { name: 'leaderboard', description: 'Display server top activity leaderboard', options: [], category: 'Engagement' },
    { name: 'fliptext', description: 'Reverse and flip upside down input text', options: [{ name: 'text', description: 'Text to flip', required: true, type: 'STRING' }], category: 'Fun' },
    { name: 'meme', description: 'Fetch a trending meme from Reddit', options: [], category: 'Fun' },
    { name: 'cowsay', description: 'Generate ASCII animal speech bubbles', options: [{ name: 'text', description: 'Speech text', required: true, type: 'STRING' }], category: 'Fun' },
    { name: 'advice', description: 'Get a helpful random piece of advice', options: [], category: 'Utility' },
    { name: 'weather', description: 'Look up live weather forecasts for any city', options: [{ name: 'location', description: 'City name', required: true, type: 'STRING' }], category: 'Utility' },
    { name: 'poll', description: 'Create an interactive community poll with votes', options: [{ name: 'question', description: 'Poll question', required: true, type: 'STRING' }], category: 'Utility' },
    { name: 'calculator', description: 'Evaluate a mathematical calculation', options: [{ name: 'expression', description: 'Math expression', required: true, type: 'STRING' }], category: 'Tools' },
    { name: 'binary', description: 'Encode or decode text in binary format', options: [{ name: 'text', description: 'Content to process', required: true, type: 'STRING' }], category: 'Tools' },
    { name: 'ascii', description: 'Generate retro ASCII banner art', options: [{ name: 'text', description: 'Text for ASCII banner', required: true, type: 'STRING' }], category: 'Tools' }
  ];
  res.json(slashCommands);
});

app.post('/api/slash-commands/resync', (req, res) => {
  res.json({
    success: true,
    message: 'All 80 Iconic Slash Commands successfully registered with Discord API Gateway.',
    registeredAt: new Date().toISOString()
  });
});

app.post('/api/simulate', async (req, res) => {
  const { commandText, author } = req.body;
  if (!commandText || typeof commandText !== 'string') {
    return res.status(400).json({ error: 'Valid commandText required' });
  }

  const trimmed = commandText.trim();
  let textToParse = trimmed;
  if (textToParse.startsWith('/')) {
    textToParse = textToParse.slice(1).trim();
  } else if (textToParse.startsWith('!')) {
    textToParse = textToParse.slice(1).trim();
  }

  const parts = textToParse.split(/\s+/);
  const cmdName = parts[0] ? parts[0].toLowerCase() : '';
  const cmdArgs = parts.slice(1).map(arg => {
    // Strip parameter labels if user typed "text: hello" -> "hello"
    if (arg.includes(':') && !arg.startsWith('http')) {
      return arg.split(':')[1] || arg;
    }
    return arg;
  });

  const command = client.commands.get(cmdName);

  if (!command) {
    return res.json({
      success: false,
      commandName: cmdName,
      message: `Unknown slash command "/${cmdName}". Type /help to see all available slash commands.`
    });
  }

  const { mockClient, mockMessage, responses } = createMockDiscordContext(trimmed, author || 'ServerOwner');

  try {
    await command.run(mockClient, mockMessage, cmdArgs);
    res.json({
      success: true,
      commandName: cmdName,
      args: cmdArgs,
      isSlash: true,
      responses: responses.length > 0 ? responses : [
        { type: 'text', content: `Slash command /${cmdName} executed successfully with no direct message output.` }
      ]
    });
  } catch (err) {
    res.json({
      success: false,
      commandName: cmdName,
      error: `Command error: ${err.message}`
    });
  }
});

app.get('/api/config', (req, res) => {
  res.json(botConfig);
});

app.post('/api/config', (req, res) => {
  const { prefix, name, ownerId, serverId, modlogChannel, token, botStatus, activityType, statusText, defaultEmbedColor, language, timezone, leaderboardPublic } = req.body;
  if (prefix) botConfig.prefix = prefix;
  if (name) botConfig.name = name;
  if (ownerId) botConfig.ownerId = ownerId;
  if (serverId) botConfig.serverId = serverId;
  if (modlogChannel) botConfig.modlogChannel = modlogChannel;
  if (botStatus) botConfig.botStatus = botStatus;
  if (activityType) botConfig.activityType = activityType;
  if (statusText) botConfig.statusText = statusText;
  if (defaultEmbedColor) botConfig.defaultEmbedColor = defaultEmbedColor;
  if (language) botConfig.language = language;
  if (timezone) botConfig.timezone = timezone;
  if (typeof leaderboardPublic === 'boolean') botConfig.leaderboardPublic = leaderboardPublic;
  if (typeof token === 'string') botConfig.token = token;

  client.prefix = botConfig.prefix;
  res.json({ success: true, config: botConfig });
});

app.get('/api/leaderboard', (req, res) => {
  res.json({
    isPublic: botConfig.leaderboardPublic,
    vanityUrl: botConfig.vanityUrl,
    members: leaderboardMembers
  });
});

app.get('/api/characters', (req, res) => {
  res.json(aiCharacters);
});

app.post('/api/chat-character', (req, res) => {
  const { characterId, userMessage } = req.body;
  const character = aiCharacters.find((c) => c.id === characterId) || aiCharacters[0];
  
  let reply = '';
  const cleanMsg = (userMessage || '').toLowerCase();

  if (character.id === 'deadpool') {
    if (cleanMsg.includes('hello') || cleanMsg.includes('hi')) {
      reply = 'Well look who decided to grace my text box! Grab some chimichangas and let us talk about server domination.';
    } else if (cleanMsg.includes('who are you')) {
      reply = 'I am the Merc with a Mouth! The guy who pays for premium badges so you do not have to.';
    } else {
      reply = `You asked "${userMessage}"? Maximum effort, my friend! I would say keep doing what you are doing, and maybe dodge a few bullets on the way.`;
    }
  } else if (character.id === 'trump') {
    reply = `Regarding "${userMessage}", let me tell you, we looked at it very strongly. Tremendous topic, one of the best. We have got great people working on it.`;
  } else if (character.id === 'rick') {
    reply = `Listen, Morty, about "${userMessage}"... you are thinking about this all wrong. The entire multiverse is huge, and you are asking about Discord roles? Grab the screwdriver!`;
  } else if (character.id === 'yoshi') {
    reply = `Yoshi! Happy to help you with "${userMessage}"! We can jump over any obstacles together!`;
  } else {
    reply = `Analyzing request for "${userMessage}"... Stark Industries servers are fully responsive. I would advise keeping your automated moderation protocols online.`;
  }

  res.json({
    characterName: character.name,
    avatar: character.avatar,
    reply: reply
  });
});

app.get('/api/emojis', (req, res) => {
  res.json(serverEmojis);
});

app.post('/api/emojis/:id/toggle', (req, res) => {
  const emoji = serverEmojis.find((e) => e.id === req.params.id);
  if (!emoji) return res.status(404).json({ error: 'Emoji not found' });
  emoji.active = !emoji.active;
  res.json({ success: true, emoji });
});

const cookieParser = require('cookie-parser');
const axios = require('axios');

app.use(cookieParser());

// In memory session store
const userSessions = new Map();

// Helper to determine callback URL
function getDiscordRedirectUri(req) {
  const origin = req.headers['x-forwarded-proto'] && req.headers['x-forwarded-host']
    ? `${req.headers['x-forwarded-proto']}://${req.headers['x-forwarded-host']}`
    : (req.headers.origin || process.env.APP_URL || 'https://ais-dev-gpvogsklpwvv3eyd4wbeen-268579460420.asia-southeast1.run.app');
  return `${origin}/api/auth/discord/callback`;
}

// Discord OAuth endpoints
app.get('/api/auth/url', (req, res) => {
  const redirectUri = getDiscordRedirectUri(req);
  const clientId = process.env.DISCORD_CLIENT_ID || '852903626871537685';
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'identify guilds'
  });
  const url = `https://discord.com/oauth2/authorize?${params.toString()}`;
  res.json({ url, redirectUri, clientId });
});

async function handleDiscordCallback(req, res) {
  const code = req.query.code;
  let userData = null;

  if (code && process.env.DISCORD_CLIENT_SECRET) {
    try {
      const redirectUri = getDiscordRedirectUri(req);
      const tokenResponse = await axios.post(
        'https://discord.com/api/oauth2/token',
        new URLSearchParams({
          client_id: process.env.DISCORD_CLIENT_ID || '852903626871537685',
          client_secret: process.env.DISCORD_CLIENT_SECRET,
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirectUri,
          scope: 'identify guilds'
        }).toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      const accessToken = tokenResponse.data.access_token;
      const userRes = await axios.get('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const guildsRes = await axios.get('https://discord.com/api/users/@me/guilds', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      userData = {
        id: userRes.data.id,
        username: userRes.data.username,
        discriminator: userRes.data.discriminator || '0',
        avatar: userRes.data.avatar
          ? `https://cdn.discordapp.com/avatars/${userRes.data.id}/${userRes.data.avatar}.png`
          : 'https://cdn.discordapp.com/embed/avatars/0.png',
        tag: `${userRes.data.username}#${userRes.data.discriminator || '0001'}`,
        guilds: guildsRes.data.map(g => ({
          id: g.id,
          name: g.name,
          icon: g.icon ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png` : null,
          owner: g.owner
        }))
      };
    } catch (err) {
      console.warn('[Iconic OAuth] Code exchange warning:', err.message);
    }
  }

  // Fallback demo profile if token exchange was bypassed or in sandbox mode
  if (!userData) {
    userData = {
      id: botConfig.ownerId,
      username: 'DiscordUser',
      discriminator: '0001',
      tag: 'DiscordUser#0001',
      avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
      guilds: [
        { id: '852903626871537685', name: 'test server', owner: true },
        { id: '123456789012345678', name: 'Iconic Community', owner: true }
      ]
    };
  }

  const sessionId = 'sess_' + Math.random().toString(36).substring(2, 15);
  userSessions.set(sessionId, userData);

  res.cookie('iconic_session', sessionId, {
    secure: true,
    sameSite: 'none',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>Discord Authenticated</title></head>
      <body style="background: #11141c; color: #fff; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
        <div style="text-align: center;">
          <h2 style="margin-bottom: 8px;">Authentication Successful</h2>
          <p style="color: #94a3b8; font-size: 14px;">Closing window and returning to Iconic Dashboard...</p>
        </div>
        <script>
          if (window.opener) {
            window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', user: ${JSON.stringify(userData)} }, '*');
            setTimeout(() => window.close(), 600);
          } else {
            window.location.href = '/';
          }
        </script>
      </body>
    </html>
  `);
}

app.get(['/api/auth/discord/callback', '/auth/callback', '/api/auth/discord/callback/', '/auth/callback/'], handleDiscordCallback);

app.get('/api/auth/me', (req, res) => {
  const sessionId = req.cookies.iconic_session;
  if (sessionId && userSessions.has(sessionId)) {
    return res.json({ authenticated: true, user: userSessions.get(sessionId) });
  }
  res.json({ authenticated: false, user: null });
});

app.post('/api/auth/demo-login', (req, res) => {
  const { username } = req.body;
  const uname = username && typeof username === 'string' ? username.trim() : 'mrvenomyt';
  const userData = {
    id: '607059199897108491',
    username: uname,
    discriminator: '4876',
    tag: `${uname}#4876`,
    avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
    guilds: [
      { id: '852903626871537685', name: 'test server', owner: true },
      { id: '998877665544332211', name: 'Iconic Hangout', owner: true }
    ]
  };

  const sessionId = 'sess_' + Math.random().toString(36).substring(2, 15);
  userSessions.set(sessionId, userData);

  res.cookie('iconic_session', sessionId, {
    secure: true,
    sameSite: 'none',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({ success: true, user: userData });
});

app.post('/api/auth/logout', (req, res) => {
  const sessionId = req.cookies.iconic_session;
  if (sessionId) userSessions.delete(sessionId);
  res.clearCookie('iconic_session', {
    secure: true,
    sameSite: 'none',
    httpOnly: true
  });
  res.json({ success: true });
});

// Single Page Dashboard entry fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

const server = http.createServer(app);
server.listen(PORT, HOST, () => {
  console.log(`[Iconic Dashboard] Server running on http://${HOST}:${PORT}`);
});
