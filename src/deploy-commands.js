import { REST, Routes } from 'discord.js';
import { config } from './config.js';

// Import command data
import { data as setChannelData } from './commands/setchannel.js';
import { addMemeCommand, addMotivationCommand, addBookCommand } from './commands/addcontent.js';
import { data as postNowData } from './commands/postnow.js';
import { data as statusData } from './commands/status.js';
import { data as toggleData } from './commands/toggleschedule.js';
import { data as queueData } from './commands/queue.js';

export const commands = [
  setChannelData,
  addMemeCommand.data,
  addMotivationCommand.data,
  addBookCommand.data,
  postNowData,
  statusData,
  toggleData,
  queueData
].map(cmd => cmd.toJSON());

export async function deployCommands() {
  if (!config.token || !config.clientId) {
    console.error('❌ DISCORD_TOKEN and CLIENT_ID are required in .env to deploy commands.');
    console.log('👉 Please edit .env with your bot credentials from https://discord.com/developers/applications');
    return false;
  }

  const rest = new REST({ version: '10' }).setToken(config.token);

  try {
    console.log(`[Deploy] Refreshing ${commands.length} application (/) commands...`);

    if (config.guildId) {
      try {
        const data = await rest.put(
          Routes.applicationGuildCommands(config.clientId, config.guildId),
          { body: commands }
        );
        console.log(`[Deploy] ✅ Successfully registered ${data.length} commands to Guild (${config.guildId})!`);
        return true;
      } catch (guildErr) {
        if (guildErr.code === 50001) {
          console.warn(`[Deploy] ⚠️ Bot is not yet in guild ${config.guildId} (Missing Access). Deploying globally instead...`);
        } else {
          console.warn(`[Deploy] ⚠️ Guild deploy error (${guildErr.message}). Deploying globally instead...`);
        }
      }
    }

    // Global registration
    const data = await rest.put(
      Routes.applicationCommands(config.clientId),
      { body: commands }
    );
    console.log(`[Deploy] ✅ Successfully registered ${data.length} global application commands!`);
    console.log(`👉 If you have not invited the bot yet, use this invite link:`);
    console.log(`   https://discord.com/oauth2/authorize?client_id=${config.clientId}&permissions=8&scope=bot%20applications.commands\n`);
    return true;
  } catch (error) {
    console.error('[Deploy] ❌ Error deploying commands:', error);
    return false;
  }
}

// Allow standalone execution
if (process.argv[1] && process.argv[1].endsWith('deploy-commands.js')) {
  deployCommands();
}
