import axios from 'axios';
import { config } from '../config.js';
import { db } from '../database/db.js';

/**
 * Internet Fetcher Engine
 * Automatically discovers, filters, and ranks the BEST content from the internet:
 * 1. Top-rated trending memes (filtered by high upvotes & quality from Reddit & Meme APIs)
 * 2. High-impact daily motivation quotes (via ZenQuotes & Inspirational APIs)
 * 3. Curated trending business and social skills book lessons
 */

// Curated subreddits for high-status, witty, relatable, and business/tech humor
const MEME_SUBREDDITS = [
  'wholesomememes',
  'ProgrammerHumor',
  'me_irl',
  'memes',
  'AdviceAnimals'
];

export const internetFetcher = {
  /**
   * Fetches the HIGHEST UPVOTED, safest memes from the internet.
   * Ranks by upvotes so only top-tier content is posted.
   */
  async fetchBestInternetMeme() {
    const subreddit = MEME_SUBREDDITS[Math.floor(Math.random() * MEME_SUBREDDITS.length)];
    
    // Method 1: Direct Reddit Top Feed (sorted by highest upvotes today)
    try {
      const redditRes = await axios.get(
        `https://www.reddit.com/r/${subreddit}/top.json?t=day&limit=30`,
        {
          headers: { 'User-Agent': 'TheEliteCircleBot/2.0 (Discord Content Curator)' },
          timeout: 5000
        }
      );

      if (redditRes.data?.data?.children?.length > 0) {
        const posts = redditRes.data.data.children
          .map(c => c.data)
          .filter(post => {
            if (!post || post.over_18 || post.is_video || post.stickied) return false;
            const url = post.url || '';
            const isImage = /\.(jpg|jpeg|png|webp)$/i.test(url) || url.includes('i.redd.it') || url.includes('imgur.com');
            const hasGoodUpvotes = (post.ups || 0) >= 300; // Only high quality / viral memes
            return isImage && hasGoodUpvotes;
          });

        if (posts.length > 0) {
          // Sort by highest upvotes descending to get the absolute BEST
          posts.sort((a, b) => b.ups - a.ups);
          const topPost = posts[Math.floor(Math.random() * Math.min(posts.length, 5))];

          let cleanUrl = topPost.url;
          if (!/\.(jpg|jpeg|png|webp)$/i.test(cleanUrl) && topPost.thumbnail && topPost.thumbnail.startsWith('http')) {
            cleanUrl = topPost.thumbnail;
          }

          return {
            title: topPost.title,
            imageUrl: cleanUrl,
            caption: `🔥 Trending on r/${subreddit} • ${topPost.ups.toLocaleString()} upvotes`,
            source: `r/${subreddit}`,
            upvotes: topPost.ups
          };
        }
      }
    } catch (err) {
      // Fall through to Method 2 if Reddit rate-limits
    }

    // Method 2: High-speed Meme API fallback
    try {
      const apiRes = await axios.get(`https://meme-api.com/gimme/${subreddit}/10`, { timeout: 4000 });
      if (apiRes.data?.memes?.length > 0) {
        // Filter out NSFW and sort by upvotes
        const safeMemes = apiRes.data.memes
          .filter(m => !m.nsfw && m.url)
          .sort((a, b) => (b.ups || 0) - (a.ups || 0));

        if (safeMemes.length > 0) {
          const best = safeMemes[0];
          return {
            title: best.title,
            imageUrl: best.url,
            caption: `⚡ Curated from r/${best.subreddit} • ${best.ups || '🔥'} upvotes`,
            source: `r/${best.subreddit}`,
            upvotes: best.ups || 0
          };
        }
      }
    } catch (err) {
      // Return null so poster falls back to local database library
    }

    return null;
  },

  /**
   * Fetches fresh, verified inspirational motivation quotes from verified internet quote services.
   */
  async fetchOnlineMotivation() {
    try {
      const res = await axios.get('https://zenquotes.io/api/random', { timeout: 4000 });
      if (Array.isArray(res.data) && res.data[0]) {
        const item = res.data[0];
        if (item.q && item.a && !item.q.includes('zenquotes.io')) {
          return {
            quote: item.q.trim(),
            author: item.a.trim() || 'Unknown',
            category: 'Global Wisdom & Mindset'
          };
        }
      }
    } catch (err) {
      // Fallback
    }

    return null;
  },

  /**
   * Generates a fresh, deep-impact daily motivation quote & directive using Gemini AI
   */
  async generateGeminiMotivation() {
    if (!config.geminiApiKey) return null;
    const themes = [
      'Stoic emotional resilience and focus under extreme pressure',
      'The compounding effect of daily discipline vs motivation',
      'Elite standards, high-status habits, and cutting out distractions',
      'Overcoming fear of failure and relentless execution',
      'The difference between amateurs and masters in business'
    ];
    const theme = themes[Math.floor(Math.random() * themes.length)];

    const prompt = `You are the master curator for "The Elite Circle", a high-performance community of ambitious builders and entrepreneurs.
Generate 1 high-impact morning motivation quote and a daily directive based on this theme: "${theme}".
Return strictly valid JSON with these fields (no markdown backticks, just raw JSON):
{
  "quote": "The profound quote text",
  "author": "Name of historic leader, philosopher, founder, or 'The Elite Circle Codex'",
  "category": "Theme Title (e.g. Stoic Discipline, Unstoppable Focus)",
  "directive": "A concise, punchy 1-sentence action rule for today"
}`;

    try {
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${config.geminiApiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
        },
        { timeout: 8000 }
      );

      const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return JSON.parse(text);
      }
    } catch (err) {
      console.warn('[Gemini AI] Motivation generation fallback:', err.message);
    }
    return null;
  },

  /**
   * Generates an excerpt and actionable business/social skill breakdown from trending world-class books using Gemini AI
   */
  async generateGeminiBookInsight() {
    if (!config.geminiApiKey) return null;
    const bookPool = [
      'Atomic Habits by James Clear',
      'How to Win Friends and Influence People by Dale Carnegie',
      'Never Split the Difference by Chris Voss',
      'The 48 Laws of Power by Robert Greene',
      'The Psychology of Money by Morgan Housel',
      'Zero to One by Peter Thiel',
      'Deep Work by Cal Newport',
      'Influence: The Psychology of Persuasion by Robert Cialdini',
      'High Output Management by Andrew Grove',
      'The Hard Thing About Hard Things by Ben Horowitz',
      'Crucial Conversations by Kerry Patterson',
      'Thinking, Fast and Slow by Daniel Kahneman',
      'The Almanack of Naval Ravikant by Eric Jorgenson',
      'Ego Is the Enemy by Ryan Holiday',
      'Shoe Dog by Phil Knight'
    ];
    const targetBook = bookPool[Math.floor(Math.random() * bookPool.length)];

    const prompt = `You are a high-level executive and social psychology mentor for "The Elite Circle".
From the book "${targetBook}", extract a critical page lesson / golden quote, and provide an actionable business or social skill breakdown that members can apply in conversations, negotiations, or leadership today.
Return strictly valid JSON with these fields (no markdown backticks, just raw JSON):
{
  "bookTitle": "Exact book title",
  "author": "Book author",
  "category": "e.g. Social Skills & Charisma, Negotiation, Business Strategy, Wealth Psychology",
  "quoteOrPage": "The exact core insight, quote, or page concept from the book (2-4 sentences)",
  "takeaway": "Specific, practical tactical exercise or rule to apply today (2-3 sentences)"
}`;

    try {
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${config.geminiApiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
        },
        { timeout: 8000 }
      );

      const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return JSON.parse(text);
      }
    } catch (err) {
      console.warn('[Gemini AI] Book insight generation fallback:', err.message);
    }
    return null;
  },

  /**
   * Discovers and saves new trending memes into the local database pool automatically.
   */
  async autoCacheTrendingMemes(count = 5) {
    let saved = 0;
    for (let i = 0; i < count; i++) {
      const meme = await this.fetchBestInternetMeme();
      if (meme && meme.imageUrl) {
        const exists = db.getMemes().some(m => m.imageUrl === meme.imageUrl);
        if (!exists) {
          db.addMeme({
            imageUrl: meme.imageUrl,
            caption: meme.caption,
            title: meme.title,
            addedBy: 'internet-curator'
          });
          saved++;
        }
      }
    }
    return saved;
  }
};
