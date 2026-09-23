import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType } from 'discord.js';
import { db } from '../database/db.js';
import { config } from '../config.js';
import { poster } from '../services/poster.js';

export const data = new SlashCommandBuilder()
  .setName('setchannel')
  .setDescription('Set destination channel for automated memes, daily motivation, or book wisdom')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addStringOption(option =>
    option
      .setName('category')
      .setDescription('Content category to route')
      .setRequired(true)
      .addChoices(
        { name: '🎭 Memes (Every 15 Minutes)', value: 'memes' },
        { name: '⚡ Daily Motivation (1x Per Day @ 8:00 AM)', value: 'motivation' },
        { name: '📖 Book Wisdom & Skills (2x Per Day @ 10 AM & 6 PM)', value: 'books' }
      )
  )
  .addChannelOption(option =>
    option
      .setName('channel')
      .setDescription('Select the text channel')
      .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
      .setRequired(true)
  );

export async function execute(interaction) {
  const category = interaction.options.getString('category');
  const channel = interaction.options.getChannel('channel');

  // Permission check
  const permCheck = poster.checkChannelPermissions(channel, interaction.client.user);
  if (!permCheck.ok) {
    return interaction.reply({
      content: `⚠️ **Warning:** The bot may not be able to post in ${channel}.\nReason: ${permCheck.reason}\nPlease make sure the bot has **View Channel**, **Send Messages**, and **Embed Links** permissions in ${channel}.`,
      ephemeral: true
    });
  }

  // Update in database
  const updatedGuild = db.setChannel(interaction.guildId, category, channel.id);

  const categoryLabels = {
    memes: '🎭 Memes (Every 15 Minutes)',
    motivation: '⚡ Daily Motivation (1x Per Day @ 8:00 AM)',
    books: '📖 Book Wisdom & Skills (2x Per Day @ 10 AM & 6 PM)'
  };

  const embed = new EmbedBuilder()
    .setColor(config.colors.gold)
    .setTitle('✅ Channel Configured Successfully')
    .setAuthor({
      name: config.branding.serverName,
      iconURL: config.branding.iconUrl
    })
    .setDescription(
      `**Category:** ${categoryLabels[category]}\n` +
      `**Assigned Channel:** ${channel} (\`#${channel.name}\`)\n\n` +
      `Automated drops are now directed to this channel according to schedule!`
    )
    .addFields(
      {
        name: 'Current Guild Configuration',
        value: 
          `• **Memes Channel:** ${updatedGuild.memeChannelId ? `<#${updatedGuild.memeChannelId}>` : '*Not Set*'}\n` +
          `• **Daily Motivation:** ${updatedGuild.motivationChannelId ? `<#${updatedGuild.motivationChannelId}>` : '*Not Set*'}\n` +
          `• **Book Wisdom:** ${updatedGuild.bookChannelId ? `<#${updatedGuild.bookChannelId}>` : '*Not Set*'}`,
        inline: false
      },
      {
        name: '💡 Pro Tip',
        value: 'You can test posting immediately using `/postnow` or view full server setup with `/status`.',
        inline: false
      }
    )
    .setFooter({
      text: config.branding.footerText,
      iconURL: config.branding.iconUrl
    })
    .setTimestamp();

  return interaction.reply({ embeds: [embed] });
}
