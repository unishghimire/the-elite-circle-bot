import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');

// File paths
const GUILDS_FILE = path.join(DATA_DIR, 'guilds.json');
const MEMES_FILE = path.join(DATA_DIR, 'memes.json');
const MOTIVATIONS_FILE = path.join(DATA_DIR, 'motivations.json');
const BOOKS_FILE = path.join(DATA_DIR, 'books.json');
const HISTORY_FILE = path.join(DATA_DIR, 'history.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helpers for reading/writing JSON files
function readJson(filePath, defaultValue = []) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8');
      return defaultValue;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
    return defaultValue;
  }
}

function writeJson(filePath, data) {
  try {
    const tempPath = `${filePath}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, filePath);
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err.message);
  }
}

// In-memory cache for fast sync
let guilds = readJson(GUILDS_FILE, {});
let memes = readJson(MEMES_FILE, []);
let motivations = readJson(MOTIVATIONS_FILE, []);
let books = readJson(BOOKS_FILE, []);
let history = readJson(HISTORY_FILE, []);

export const db = {
  init() {
    guilds = readJson(GUILDS_FILE, {});
    memes = readJson(MEMES_FILE, []);
    motivations = readJson(MOTIVATIONS_FILE, []);
    books = readJson(BOOKS_FILE, []);
    history = readJson(HISTORY_FILE, []);
    console.log(`[Database] Initialized. Memes: ${memes.length}, Motivations: ${motivations.length}, Books: ${books.length}, Configured Guilds: ${Object.keys(guilds).length}`);
  },

  // Guild configuration
  getGuild(guildId) {
    if (!guilds[guildId]) {
      guilds[guildId] = {
        guildId,
        memeChannelId: null,
        motivationChannelId: null,
        bookChannelId: null,
        memesEnabled: true,
        motivationEnabled: true,
        booksEnabled: true,
        updatedAt: new Date().toISOString()
      };
      writeJson(GUILDS_FILE, guilds);
    }
    return guilds[guildId];
  },

  getAllGuilds() {
    return Object.values(guilds);
  },

  setChannel(guildId, category, channelId) {
    const guild = this.getGuild(guildId);
    if (category === 'memes') {
      guild.memeChannelId = channelId;
    } else if (category === 'motivation') {
      guild.motivationChannelId = channelId;
    } else if (category === 'books') {
      guild.bookChannelId = channelId;
    } else {
      throw new Error(`Invalid category "${category}". Must be "memes", "motivation", or "books".`);
    }
    guild.updatedAt = new Date().toISOString();
    guilds[guildId] = guild;
    writeJson(GUILDS_FILE, guilds);
    return guild;
  },

  toggleSchedule(guildId, category, enabled) {
    const guild = this.getGuild(guildId);
    if (category === 'memes') {
      guild.memesEnabled = enabled ?? !guild.memesEnabled;
    } else if (category === 'motivation') {
      guild.motivationEnabled = enabled ?? !guild.motivationEnabled;
    } else if (category === 'books') {
      guild.booksEnabled = enabled ?? !guild.booksEnabled;
    }
    guild.updatedAt = new Date().toISOString();
    guilds[guildId] = guild;
    writeJson(GUILDS_FILE, guilds);
    return guild;
  },

  // Memes management
  getMemes() {
    return memes;
  },

  addMeme({ imageUrl, caption = '', title = '', addedBy = 'admin' }) {
    const item = {
      id: `meme_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      imageUrl,
      caption,
      title: title || caption || 'Elite Circle Humor',
      addedBy,
      timesPosted: 0,
      lastPostedAt: null,
      createdAt: new Date().toISOString()
    };
    memes.push(item);
    writeJson(MEMES_FILE, memes);
    return item;
  },

  getNextMeme() {
    if (memes.length === 0) return null;
    // Sort by timesPosted ascending, then oldest lastPostedAt
    const sorted = [...memes].sort((a, b) => {
      if ((a.timesPosted || 0) !== (b.timesPosted || 0)) {
        return (a.timesPosted || 0) - (b.timesPosted || 0);
      }
      const timeA = a.lastPostedAt ? new Date(a.lastPostedAt).getTime() : 0;
      const timeB = b.lastPostedAt ? new Date(b.lastPostedAt).getTime() : 0;
      return timeA - timeB;
    });

    // Select candidate from top 5 least used to avoid purely predictable repetition
    const candidatePool = sorted.slice(0, Math.min(5, sorted.length));
    const selected = candidatePool[Math.floor(Math.random() * candidatePool.length)];

    selected.timesPosted = (selected.timesPosted || 0) + 1;
    selected.lastPostedAt = new Date().toISOString();
    writeJson(MEMES_FILE, memes);
    return selected;
  },

  // Daily Motivations management
  getMotivations() {
    return motivations;
  },

  addMotivation({ quote, author = 'Unknown', category = 'Discipline & Mindset', addedBy = 'admin' }) {
    const item = {
      id: `mot_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      quote,
      author,
      category,
      addedBy,
      timesPosted: 0,
      lastPostedAt: null,
      createdAt: new Date().toISOString()
    };
    motivations.push(item);
    writeJson(MOTIVATIONS_FILE, motivations);
    return item;
  },

  getNextMotivation() {
    if (motivations.length === 0) return null;
    const sorted = [...motivations].sort((a, b) => {
      if ((a.timesPosted || 0) !== (b.timesPosted || 0)) {
        return (a.timesPosted || 0) - (b.timesPosted || 0);
      }
      const timeA = a.lastPostedAt ? new Date(a.lastPostedAt).getTime() : 0;
      const timeB = b.lastPostedAt ? new Date(b.lastPostedAt).getTime() : 0;
      return timeA - timeB;
    });

    const candidatePool = sorted.slice(0, Math.min(3, sorted.length));
    const selected = candidatePool[Math.floor(Math.random() * candidatePool.length)];

    selected.timesPosted = (selected.timesPosted || 0) + 1;
    selected.lastPostedAt = new Date().toISOString();
    writeJson(MOTIVATIONS_FILE, motivations);
    return selected;
  },

  // Books (Trending Book Page Motivation, Business & Social Skills)
  getBooks() {
    return books;
  },

  addBook({ bookTitle, author, quoteOrPage, takeaway, category = 'Business & Social Skills', addedBy = 'admin' }) {
    const item = {
      id: `book_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      bookTitle,
      author,
      quoteOrPage,
      takeaway,
      category,
      addedBy,
      timesPosted: 0,
      lastPostedAt: null,
      createdAt: new Date().toISOString()
    };
    books.push(item);
    writeJson(BOOKS_FILE, books);
    return item;
  },

  getNextBook() {
    if (books.length === 0) return null;
    const sorted = [...books].sort((a, b) => {
      if ((a.timesPosted || 0) !== (b.timesPosted || 0)) {
        return (a.timesPosted || 0) - (b.timesPosted || 0);
      }
      const timeA = a.lastPostedAt ? new Date(a.lastPostedAt).getTime() : 0;
      const timeB = b.lastPostedAt ? new Date(b.lastPostedAt).getTime() : 0;
      return timeA - timeB;
    });

    const candidatePool = sorted.slice(0, Math.min(3, sorted.length));
    const selected = candidatePool[Math.floor(Math.random() * candidatePool.length)];

    selected.timesPosted = (selected.timesPosted || 0) + 1;
    selected.lastPostedAt = new Date().toISOString();
    writeJson(BOOKS_FILE, books);
    return selected;
  },

  // Record audit history
  logPost({ guildId, category, channelId, itemId, summary }) {
    const entry = {
      id: `log_${Date.now()}`,
      guildId,
      category,
      channelId,
      itemId,
      summary,
      timestamp: new Date().toISOString()
    };
    history.push(entry);
    if (history.length > 500) {
      history = history.slice(-500); // keep last 500 records
    }
    writeJson(HISTORY_FILE, history);
  },

  getStats(guildId) {
    const guild = guildId ? this.getGuild(guildId) : null;
    return {
      totalMemes: memes.length,
      totalMotivations: motivations.length,
      totalBooks: books.length,
      guildConfig: guild
    };
  },

  seedIfEmpty(seeds) {
    let seededCount = 0;
    if (memes.length === 0 && seeds.memes?.length > 0) {
      memes = [...seeds.memes];
      writeJson(MEMES_FILE, memes);
      seededCount += memes.length;
    }
    if (motivations.length === 0 && seeds.motivations?.length > 0) {
      motivations = [...seeds.motivations];
      writeJson(MOTIVATIONS_FILE, motivations);
      seededCount += motivations.length;
    }
    if (books.length === 0 && seeds.books?.length > 0) {
      books = [...seeds.books];
      writeJson(BOOKS_FILE, books);
      seededCount += books.length;
    }
    return seededCount;
  }
};
