import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { db } from '../database/db.js';
import { config } from '../config.js';

export const data = new SlashCommandBuilder()
  .setName('toggleschedule')
  .setDescription('Pause or resume automated posting for a specific category')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addStringOption(option =>
    option
      .setName('category')
      .setDescription('Content category')
      .setRequired(true)
      .addChoices(
        { name: '🎭 Memes (Every 15m)', value: 'memes' },
        { name: '⚡ Daily Motivation (1x/day)', value: 'motivation' },
        { name: '📖 Book Wisdom & Skills (2x/day)', value: 'books' }
      )
  )
  .addBooleanOption(option =>
    option
      .setName('enabled')
      .setDescription('Enable (true) or Pause (false)')
      .setRequired(true)
  );

export async function execute(interaction) {
  const category = interaction.options.getString('category');
  const enabled = interaction.options.getBoolean('enabled');

  const updated = db.toggleSchedule(interaction.guildId, category, enabled);

  const embed = new EmbedBuilder()
    .setColor(enabled ? config.colors.emerald : config.colors.error)
    .setTitle(enabled ? '🟢 Schedule Resumed' : '⏸️ Schedule Paused')
    .setDescription(
      `Automated drops for **${category.toUpperCase()}** are now **${enabled ? 'ACTIVE' : 'PAUSED'}** in this server.`
    )
    .addFields(
      {
        name: 'Current Schedule States',
        value:
          `• **Memes:** ${updated.memesEnabled !== false ? '🟢 Active' : '⏸️ Paused'}\n` +
          `• **Daily Motivation:** ${updated.motivationEnabled !== false ? '🟢 Active' : '⏸️ Paused'}\n` +
          `• **Book Wisdom:** ${updated.booksEnabled !== false ? '🟢 Active' : '⏸️ Paused'}`
      }
    )
    .setFooter({ text: config.branding.footerText })
    .setTimestamp();

  return interaction.reply({ embeds: [embed] });
}
