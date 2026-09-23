import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { config } from '../config.js';
import { db } from '../database/db.js';
import { internetFetcher } from './internetFetcher.js';

export const poster = {
  /**
   * Post a Meme to a specific channel
   */
  async postMeme(channel, guildId, options = {}) {
    if (!channel) return { success: false, error: 'Channel is null or undefined' };

    let meme = null;

    // If options specify online, or randomly alternate between fresh trending internet memes and local library
    const shouldCheckOnline = options.fetchOnline || (Math.random() < 0.5 && !options.localOnly);
    
    if (shouldCheckOnline) {
      meme = await internetFetcher.fetchBestInternetMeme();
    }

    // Fallback to local database library if internet meme wasn't retrieved or if local preferred
    if (!meme) {
      meme = db.getNextMeme();
    }

    if (!meme) {
      return { success: false, error: 'No memes available in library or internet' };
    }

    const embed = new EmbedBuilder()
      .setColor(config.colors.memeColor)
      .setTitle(`🎭 ${meme.title || 'Elite Circle Humor'}`)
      .setDescription(meme.caption ? `*${meme.caption}*` : null)
      .setImage(meme.imageUrl)
      .setFooter({
        text: `${config.branding.footerText} • Meme Drop (Every 15m)${meme.upvotes ? ` • ⭐ ${meme.upvotes.toLocaleString()} upvotes` : ''}`,
        iconURL: config.branding.iconUrl
      })
      .setTimestamp();

    try {
      const message = await channel.send({ embeds: [embed] });
      db.logPost({
        guildId,
        category: 'memes',
        channelId: channel.id,
        itemId: meme.id || 'online',
        summary: meme.title || meme.caption || 'Meme'
      });
      return { success: true, messageId: message.id, meme };
    } catch (err) {
      console.error(`[Poster] Failed to post meme in #${channel.name}:`, err.message);
      return { success: false, error: err.message };
    }
  },

  /**
   * Post Daily Motivation to a specific channel
   */
  async postMotivation(channel, guildId, options = {}) {
    if (!channel) return { success: false, error: 'Channel is null or undefined' };

    let motivation = null;
    let isAiGenerated = false;

    // Try Gemini AI if available (unless localOnly is requested)
    if (config.geminiApiKey && !options.localOnly) {
      motivation = await internetFetcher.generateGeminiMotivation();
      if (motivation) isAiGenerated = true;
    }

    // Fallback to local database library
    if (!motivation) {
      motivation = db.getNextMotivation();
    }

    if (!motivation) {
      return { success: false, error: 'No motivation quotes in library' };
    }

    const embed = new EmbedBuilder()
      .setColor(config.colors.gold)
      .setAuthor({
        name: 'THE ELITE CIRCLE • DAILY MORNING MOTIVATION',
        iconURL: config.branding.iconUrl
      })
      .setTitle(`⚡ ${motivation.category || 'Discipline & Excellence'}`)
      .setDescription(
        `>>> **"${motivation.quote}"**\n\n— *${motivation.author}*`
      )
      .addFields(
        {
          name: '🧠 Daily Directive',
          value: motivation.directive || 'Win your morning, protect your attention, and execute your highest leverage tasks first.',
          inline: false
        }
      )
      .setFooter({
        text: `${config.branding.footerText} • Daily Dose (1x/Day)${isAiGenerated ? ' • 🤖 Gemini AI Curated' : ''}`,
        iconURL: config.branding.iconUrl
      })
      .setTimestamp();

    try {
      const message = await channel.send({ embeds: [embed] });
      db.logPost({
        guildId,
        category: 'motivation',
        channelId: channel.id,
        itemId: motivation.id || 'gemini_ai',
        summary: `${motivation.author}: ${motivation.quote.slice(0, 40)}...`
      });
      return { success: true, messageId: message.id, motivation };
    } catch (err) {
      console.error(`[Poster] Failed to post motivation in #${channel.name}:`, err.message);
      return { success: false, error: err.message };
    }
  },

  /**
   * Post Trending Book Page & Business / Social Skills wisdom
   */
  async postBookQuote(channel, guildId, options = {}) {
    if (!channel) return { success: false, error: 'Channel is null or undefined' };

    let book = null;
    let isAiGenerated = false;

    // Try Gemini AI if available (unless localOnly is requested)
    if (config.geminiApiKey && !options.localOnly) {
      book = await internetFetcher.generateGeminiBookInsight();
      if (book) isAiGenerated = true;
    }

    // Fallback to local database library
    if (!book) {
      book = db.getNextBook();
    }

    if (!book) {
      return { success: false, error: 'No book wisdom in library' };
    }

    const embed = new EmbedBuilder()
      .setColor(config.colors.cyberBlue)
      .setAuthor({
        name: 'THE ELITE CIRCLE • BOOK WISDOM & SKILLS MASTERY',
        iconURL: config.branding.iconUrl
      })
      .setTitle(`📖 ${book.bookTitle}`)
      .setDescription(`*by ${book.author}* • \`${book.category || 'Business & Social Skills'}\``)
      .addFields(
        {
          name: '📑 Key Page Excerpt',
          value: `> "${book.quoteOrPage}"`,
          inline: false
        },
        {
          name: '🎯 Actionable Takeaway / Social & Business Skill',
          value: book.takeaway || 'Implement this strategy in your conversations and decisions today.',
          inline: false
        }
      )
      .setFooter({
        text: `${config.branding.footerText} • Masterclass (2x/Day)${isAiGenerated ? ' • 🤖 Gemini AI Deep Dive' : ''}`,
        iconURL: config.branding.iconUrl
      })
      .setTimestamp();

    try {
      const message = await channel.send({ embeds: [embed] });
      db.logPost({
        guildId,
        category: 'books',
        channelId: channel.id,
        itemId: book.id,
        summary: `${book.bookTitle} (${book.author})`
      });
      return { success: true, messageId: message.id, book };
    } catch (err) {
      console.error(`[Poster] Failed to post book wisdom in #${channel.name}:`, err.message);
      return { success: false, error: err.message };
    }
  },

  /**
   * Helper to check required bot permissions in a channel
   */
  checkChannelPermissions(channel, clientUser) {
    if (!channel || !channel.isTextBased()) {
      return { ok: false, reason: 'Channel is not a text channel.' };
    }
    const permissions = channel.permissionsFor(clientUser);
    if (!permissions) {
      return { ok: true }; // Cannot determine (e.g. DM or test environment)
    }

    const missing = [];
    if (!permissions.has(PermissionFlagsBits.ViewChannel)) missing.push('View Channel');
    if (!permissions.has(PermissionFlagsBits.SendMessages)) missing.push('Send Messages');
    if (!permissions.has(PermissionFlagsBits.EmbedLinks)) missing.push('Embed Links');
    if (!permissions.has(PermissionFlagsBits.AttachFiles)) missing.push('Attach Files');

    if (missing.length > 0) {
      return { ok: false, reason: `Missing required permissions: ${missing.join(', ')}` };
    }
    return { ok: true };
  }
};
