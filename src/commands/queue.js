import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { db } from '../database/db.js';
import { config } from '../config.js';

export const data = new SlashCommandBuilder()
  .setName('queue')
  .setDescription('Inspect the upcoming content library in rotation')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addStringOption(option =>
    option
      .setName('category')
      .setDescription('Content category')
      .setRequired(true)
      .addChoices(
        { name: '🎭 Memes Pool', value: 'memes' },
        { name: '⚡ Daily Motivation Pool', value: 'motivation' },
        { name: '📖 Book Wisdom Pool', value: 'books' }
      )
  );

export async function execute(interaction) {
  const category = interaction.options.getString('category');

  const embed = new EmbedBuilder()
    .setColor(config.colors.gold)
    .setAuthor({
      name: config.branding.serverName,
      iconURL: config.branding.iconUrl
    });

  if (category === 'memes') {
    const list = db.getMemes().slice(0, 6);
    embed.setTitle('🎭 Memes Rotation Pool (Top Items)')
      .setDescription(`Total Memes: **${db.getMemes().length}**`)
      .addFields(
        list.map((m, idx) => ({
          name: `${idx + 1}. ${m.title || m.caption || 'Untitled Meme'}`,
          value: `[Image Link](${m.imageUrl}) • Posted: \`${m.timesPosted || 0} times\` • Last: \`${m.lastPostedAt ? new Date(m.lastPostedAt).toLocaleDateString() : 'Never'}\``,
          inline: false
        }))
      );
  } else if (category === 'motivation') {
    const list = db.getMotivations().slice(0, 6);
    embed.setTitle('⚡ Daily Motivation Pool (Top Items)')
      .setDescription(`Total Quotes: **${db.getMotivations().length}**`)
      .addFields(
        list.map((m, idx) => ({
          name: `${idx + 1}. "${m.quote.slice(0, 60)}..."`,
          value: `— *${m.author}* (\`${m.category || 'Mindset'}\`) • Posted: \`${m.timesPosted || 0} times\``,
          inline: false
        }))
      );
  } else if (category === 'books') {
    const list = db.getBooks().slice(0, 5);
    embed.setTitle('📖 Book Wisdom & Skills Pool (Top Items)')
      .setDescription(`Total Masterclasses: **${db.getBooks().length}**`)
      .addFields(
        list.map((b, idx) => ({
          name: `${idx + 1}. ${b.bookTitle} (${b.author})`,
          value: `*Category:* \`${b.category || 'Business'}\`\n*Takeaway:* ${b.takeaway ? b.takeaway.slice(0, 90) : ''}...\n*Posted:* \`${b.timesPosted || 0} times\``,
          inline: false
        }))
      );
  }

  embed.setFooter({ text: config.branding.footerText }).setTimestamp();
  return interaction.reply({ embeds: [embed], ephemeral: true });
}
