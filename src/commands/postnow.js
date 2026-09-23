import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { db } from '../database/db.js';
import { config } from '../config.js';
import { poster } from '../services/poster.js';

export const data = new SlashCommandBuilder()
  .setName('postnow')
  .setDescription('Instantly trigger a post to test formatting and channel delivery')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addStringOption(option =>
    option
      .setName('category')
      .setDescription('Category to post immediately')
      .setRequired(true)
      .addChoices(
        { name: '🎭 Meme Drop', value: 'memes' },
        { name: '⚡ Daily Motivation', value: 'motivation' },
        { name: '📖 Book Wisdom & Skills', value: 'books' }
      )
  )
  .addChannelOption(option =>
    option
      .setName('destination')
      .setDescription('Optional specific channel (defaults to configured channel for this category)')
      .setRequired(false)
  );

export async function execute(interaction) {
  const category = interaction.options.getString('category');
  const customChannel = interaction.options.getChannel('destination');

  const guild = db.getGuild(interaction.guildId);
  let targetChannelId = null;

  if (customChannel) {
    targetChannelId = customChannel.id;
  } else {
    if (category === 'memes') targetChannelId = guild.memeChannelId;
    if (category === 'motivation') targetChannelId = guild.motivationChannelId;
    if (category === 'books') targetChannelId = guild.bookChannelId;
  }

  if (!targetChannelId) {
    return interaction.reply({
      content: `❌ No channel has been set for **${category}** yet! Use \`/setchannel\` first or pick a channel in the \`destination\` option.`,
      ephemeral: true
    });
  }

  await interaction.deferReply({ ephemeral: true });

  const channel = await interaction.client.channels.fetch(targetChannelId).catch(() => null);
  if (!channel) {
    return interaction.editReply({
      content: `❌ Could not access channel <#${targetChannelId}>. Please verify bot permissions.`
    });
  }

  let result;
  if (category === 'memes') {
    result = await poster.postMeme(channel, interaction.guildId);
  } else if (category === 'motivation') {
    result = await poster.postMotivation(channel, interaction.guildId);
  } else if (category === 'books') {
    result = await poster.postBookQuote(channel, interaction.guildId);
  }

  if (result.success) {
    return interaction.editReply({
      content: `✅ Successfully posted **${category}** to ${channel}!`
    });
  } else {
    return interaction.editReply({
      content: `⚠️ Failed to post: ${result.error}`
    });
  }
}
