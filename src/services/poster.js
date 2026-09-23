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

    // 1. Always prioritize fresh trending internet meme from Reddit / Meme API
    if (!options.localOnly) {
      try {
        meme = await internetFetcher.fetchBestInternetMeme();
      } catch (err) {
        console.warn('[Poster] Internet meme fetch error:', err.message);
      }
    }

    // 2. Fallback to verified local library if internet fetch failed or localOnly
    if (!meme || !meme.imageUrl || meme.imageUrl.includes('example.com')) {
      meme = db.getNextMeme();
    }

    if (!meme || !meme.imageUrl) {
      return { success: false, error: 'No valid memes available in library or internet' };
    }

    // Determine clean title & description without redundancy
    const title = meme.title || 'Humor Drop';
    const description = (meme.caption && meme.caption !== title && !meme.caption.includes('Elite Circle Humor')) 
      ? `*${meme.caption}*` 
      : null;

    const embed = new EmbedBuilder()
      .setColor(0x00F0FF) // Cyber / AI Neon Cyan
      .setTitle(`🤖 ${title}`)
      .setImage(meme.imageUrl)
      .setFooter({
        text: 'The Elite Circle • AI & Agent Memes',
        iconURL: config.branding.iconUrl
      })
      .setTimestamp();

    if (description) {
      embed.setDescription(description);
    }

    try {
      const message = await channel.send({ embeds: [embed] });
      db.logPost({
        guildId,
        category: 'memes',
        channelId: channel.id,
        itemId: meme.id || 'online',
        summary: title
      });
      return { success: true, messageId: message.id, meme };
    } catch (err) {
      console.error(`[Poster] Failed to post meme in #${channel.name}:`, err.message);
      return { success: false, error: err.message };
    }
  },

  /**
   * Post Daily Motivation to a specific channel (Clean & Minimalist)
   */
  async postMotivation(channel, guildId, options = {}) {
    if (!channel) return { success: false, error: 'Channel is null or undefined' };

    let motivation = null;

    // Try Gemini AI if available (unless localOnly is requested)
    if (config.geminiApiKey && !options.localOnly) {
      motivation = await internetFetcher.generateGeminiMotivation();
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
        name: 'THE ELITE CIRCLE',
        iconURL: config.branding.iconUrl
      })
      .setTitle(`⚡ ${motivation.category || 'Daily Motivation'}`)
      .setDescription(
        `>>> *" ${motivation.quote.trim()} "*\n\n— **${motivation.author.trim()}**`
      )
      .setFooter({
        text: 'The Elite Circle • Daily Motivation',
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
   * Post Trending Book Page & Business / Social Skills wisdom (Clean & Minimalist)
   */
  async postBookQuote(channel, guildId, options = {}) {
    if (!channel) return { success: false, error: 'Channel is null or undefined' };

    let book = null;

    // Try Gemini AI if available (unless localOnly is requested)
    if (config.geminiApiKey && !options.localOnly) {
      book = await internetFetcher.generateGeminiBookInsight();
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
        name: 'THE ELITE CIRCLE',
        iconURL: config.branding.iconUrl
      })
      .setTitle(`📖 ${book.bookTitle}`)
      .setDescription(`*by ${book.author}* • \`${book.category || 'Business & Social Skills'}\``)
      .addFields(
        {
          name: 'Insight',
          value: `> "${book.quoteOrPage.trim()}"`,
          inline: false
        },
        {
          name: 'Takeaway',
          value: book.takeaway.trim(),
          inline: false
        }
      )
      .setFooter({
        text: 'The Elite Circle • Book Wisdom',
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
