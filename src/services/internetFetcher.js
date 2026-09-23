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

// Curated subreddits dedicated 100% to AI, AI Agents, LLMs, and Machine Learning
const AI_MEME_SUBREDDITS = [
  'aimemes',
  'ChatGPT',
  'OpenAI',
  'singularity',
  'LocalLLaMA',
  'ArtificialInteligence'
];

// Keywords to verify AI relevance for general tech memes
const AI_REGEX = /\b(ai|agent|agents|llm|gpt|chatgpt|claude|gemini|openai|anthropic|deepseek|copilot|cursor|token|prompt|hallucinat|agi|robot|model|neural|machine learning|vibe coding|bot|rlhf|diffusion)\b/i;

export const internetFetcher = {
  /**
   * Fetches the HIGHEST UPVOTED AI & AI Agent memes from the internet.
   * Only returns memes strictly about AI, AI agents, LLMs, and technology models.
   */
  async fetchBestInternetMeme() {
    const subreddit = AI_MEME_SUBREDDITS[Math.floor(Math.random() * AI_MEME_SUBREDDITS.length)];
    
    // Method 1: High-speed Verified Meme API (Direct Reddit images, upvote-ranked)
    try {
      const apiRes = await axios.get(`https://meme-api.com/gimme/${subreddit}/8`, { timeout: 5000 });
      if (apiRes.data?.memes?.length > 0) {
        // Filter for safe, direct image URLs (.jpg, .png, .webp, .jpeg)
        const safeMemes = apiRes.data.memes
          .filter(m => !m.nsfw && m.url && !m.url.endsWith('.gifv'))
          .sort((a, b) => (b.ups || 0) - (a.ups || 0));

        if (safeMemes.length > 0) {
          const best = safeMemes[0];
          return {
            title: best.title,
            imageUrl: best.url,
            caption: `🤖 AI & Agent Humor • r/${best.subreddit} • ${best.ups ? best.ups.toLocaleString() : '🔥'} upvotes`,
            source: `r/${best.subreddit}`,
            upvotes: best.ups || 0
          };
        }
      }
    } catch (err) {
      // Fall through to Method 2
    }

    // Method 2: ProgrammerHumor strictly filtered for AI & Agent topics
    try {
      const progRes = await axios.get(`https://meme-api.com/gimme/ProgrammerHumor/15`, { timeout: 5000 });
      if (progRes.data?.memes?.length > 0) {
        const aiMemes = progRes.data.memes
          .filter(m => !m.nsfw && m.url && !m.url.endsWith('.gifv') && AI_REGEX.test(m.title))
          .sort((a, b) => (b.ups || 0) - (a.ups || 0));

        if (aiMemes.length > 0) {
          const best = aiMemes[0];
          return {
            title: best.title,
            imageUrl: best.url,
            caption: `🤖 AI Agent Meme • r/ProgrammerHumor • ${best.ups ? best.ups.toLocaleString() : '🔥'} upvotes`,
            source: `r/ProgrammerHumor`,
            upvotes: best.ups || 0
          };
        }
      }
    } catch (err) {
      // Fallback
    }

    // Method 2: Direct Reddit Top JSON
    try {
      const redditRes = await axios.get(
        `https://www.reddit.com/r/${subreddit}/top.json?t=day&limit=25`,
        {
          headers: { 'User-Agent': 'TheEliteCircleBot/2.0 (Discord Meme Curator)' },
          timeout: 5000
        }
      );

      if (redditRes.data?.data?.children?.length > 0) {
        const posts = redditRes.data.data.children
          .map(c => c.data)
          .filter(post => {
            if (!post || post.over_18 || post.is_video || post.stickied) return false;
            const url = post.url || '';
            const isImage = /\.(jpg|jpeg|png|webp)$/i.test(url) || url.includes('i.redd.it') || url.includes('i.imgur.com');
            return isImage && !url.endsWith('.gifv');
          });

        if (posts.length > 0) {
          posts.sort((a, b) => b.ups - a.ups);
          const topPost = posts[0];
          return {
            title: topPost.title,
            imageUrl: topPost.url,
            caption: `🔥 Trending on r/${subreddit} • ${topPost.ups.toLocaleString()} upvotes`,
            source: `r/${subreddit}`,
            upvotes: topPost.ups
          };
        }
      }
    } catch (err) {
      // Fallback to local
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
