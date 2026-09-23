import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { db } from '../database/db.js';
import { config } from '../config.js';
import { scheduler } from '../services/scheduler.js';

export const data = new SlashCommandBuilder()
  .setName('status')
  .setDescription('View current channels, schedules, and content pool statistics');

export async function execute(interaction) {
  const guild = db.getGuild(interaction.guildId);
  const stats = db.getStats(interaction.guildId);
  const schedStatus = scheduler.getStatus();

  const embed = new EmbedBuilder()
    .setColor(config.colors.gold)
    .setAuthor({
      name: config.branding.serverName,
      iconURL: config.branding.iconUrl
    })
    .setTitle('⚡ The Elite Circle • Automation Status')
    .setDescription('Real-time operational dashboard for automated content drops and schedules.')
    .addFields(
      {
        name: '📍 Channel Routing',
        value: 
          `• **Memes Channel:** ${guild.memeChannelId ? `<#${guild.memeChannelId}>` : '🔴 *Not Configured*'}\n` +
          `• **Daily Motivation:** ${guild.motivationChannelId ? `<#${guild.motivationChannelId}>` : '🔴 *Not Configured*'}\n` +
          `• **Book Wisdom & Skills:** ${guild.bookChannelId ? `<#${guild.bookChannelId}>` : '🔴 *Not Configured*'}`,
        inline: false
      },
      {
        name: '⏱️ Automated Schedules',
        value:
          `• **Memes:** Every 15 Minutes (\`${config.schedules.memeCron}\`) — ${guild.memesEnabled !== false ? '🟢 Active' : '⏸️ Paused'}\n` +
          `• **Daily Motivation:** 1x/Day @ 8:00 AM (\`${config.schedules.motivationCron}\`) — ${guild.motivationEnabled !== false ? '🟢 Active' : '⏸️ Paused'}\n` +
          `• **Book Wisdom & Skills:** 2x/Day @ 10 AM & 6 PM (\`${config.schedules.bookCron}\`) — ${guild.booksEnabled !== false ? '🟢 Active' : '⏸️ Paused'}\n` +
          `• **Timezone:** \`${config.timezone}\``,
        inline: false
      },
      {
        name: '📚 Content Library Pools',
        value:
          `• **Total Memes:** \`${stats.totalMemes}\` items\n` +
          `• **Daily Motivations:** \`${stats.totalMotivations}\` quotes\n` +
          `• **Book & Social Skills:** \`${stats.totalBooks}\` masterclass entries`,
        inline: true
      },
      {
        name: '🛠️ Admin Controls',
        value:
          '• `/setchannel` — Assign channels\n' +
          '• `/addmeme` — Add meme\n' +
          '• `/addmotivation` — Add quote\n' +
          '• `/addbook` — Add book takeaway\n' +
          '• `/postnow` — Trigger instant post\n' +
          '• `/toggleschedule` — Pause/resume',
        inline: true
      }
    )
    .setFooter({
      text: config.branding.footerText,
      iconURL: config.branding.iconUrl
    })
    .setTimestamp();

  return interaction.reply({ embeds: [embed] });
}
