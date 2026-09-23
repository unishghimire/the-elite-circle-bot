import { Client, GatewayIntentBits, Collection, ActivityType } from 'discord.js';
import { config } from './config.js';
import { db } from './database/db.js';
import { seedDatabase } from './database/seeds.js';
import { scheduler } from './services/scheduler.js';

// Import command handlers
import * as setChannelCommand from './commands/setchannel.js';
import { addMemeCommand, addMotivationCommand, addBookCommand } from './commands/addcontent.js';
import * as postNowCommand from './commands/postnow.js';
import * as statusCommand from './commands/status.js';
import * as toggleCommand from './commands/toggleschedule.js';
import * as queueCommand from './commands/queue.js';

// 1. Initialize Database & Seed Library
console.log('----------------------------------------------------');
console.log('⚡ Starting The Elite Circle Automated Posting Bot ⚡');
console.log('----------------------------------------------------');
db.init();
seedDatabase();

// 2. Validate Credentials
if (!config.token) {
  console.warn('\n⚠️ WARNING: DISCORD_TOKEN is not set in .env!');
  console.warn('👉 To connect this bot to your Discord server:');
  console.warn('   1. Open .env in this folder');
  console.warn('   2. Set DISCORD_TOKEN and CLIENT_ID from https://discord.com/developers/applications');
  console.warn('   3. Run "npm run deploy-commands" to register slash commands');
  console.warn('   4. Run "npm start" to launch the bot\n');
}

// 3. Initialize Discord Client
export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

// Setup Commands Collection
client.commands = new Collection();
client.commands.set('setchannel', setChannelCommand);
client.commands.set('addmeme', addMemeCommand);
client.commands.set('addmotivation', addMotivationCommand);
client.commands.set('addbook', addBookCommand);
client.commands.set('postnow', postNowCommand);
client.commands.set('status', statusCommand);
client.commands.set('toggleschedule', toggleCommand);
client.commands.set('queue', queueCommand);

// 4. Handle Bot Ready Event
client.once('ready', () => {
  console.log(`\n👑 [Discord] Logged in as ${client.user.tag} (ID: ${client.user.id})`);
  console.log(`📡 [Discord] Serving in ${client.guilds.cache.size} servers.`);

  // Set rich status activity
  client.user.setPresence({
    activities: [
      {
        name: 'The Elite Circle • /status',
        type: ActivityType.Watching
      }
    ],
    status: 'online'
  });

  // Start cron schedulers
  scheduler.init(client);
  console.log('🚀 [Ready] Automated posting engine is now LIVE!\n');
});

// 5. Handle Slash Commands Interactions
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    console.warn(`[Command] Unknown command: ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`[Command Error] Error executing /${interaction.commandName}:`, error);
    const replyPayload = {
      content: '❌ There was an error while executing this command. Check server logs.',
      ephemeral: true
    };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(replyPayload).catch(() => null);
    } else {
      await interaction.reply(replyPayload).catch(() => null);
    }
  }
});

// 6. Graceful Shutdown
process.on('SIGINT', () => {
  console.log('\n[Shutdown] Stopping schedulers and disconnecting client...');
  scheduler.stopAll();
  client.destroy();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n[Shutdown] Terminating process...');
  scheduler.stopAll();
  client.destroy();
  process.exit(0);
});

// Start Client if token exists
if (config.token) {
  client.login(config.token).catch((err) => {
    console.error('[Discord Login Error]:', err.message);
  });
}
