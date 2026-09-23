import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const config = {
  // Discord Bot Credentials
  token: process.env.DISCORD_TOKEN || '',
  clientId: process.env.CLIENT_ID || '',
  guildId: process.env.GUILD_ID || '',

  // Google Gemini AI Key
  geminiApiKey: process.env.GEMINI_API_KEY || '',

  // System Timezone
  timezone: process.env.TIMEZONE || 'Asia/Kathmandu',

  // Automated Schedules
  schedules: {
    memeCron: process.env.MEME_CRON || '*/15 * * * *', // Every 15 minutes
    motivationCron: process.env.MOTIVATION_CRON || '0 8 * * *', // 1x per day at 8:00 AM
    bookCron: process.env.BOOK_CRON || '0 10,18 * * *', // 2x per day at 10:00 AM & 6:00 PM
  },

  // Database Path
  dbPath: path.resolve(__dirname, '../data/elite_circle.sqlite'),

  // Visual Branding - The Elite Circle Palette
  colors: {
    gold: 0xD4AF37,       // Luxury Elite Gold (Books & Motivation)
    royalPurple: 0x7928CA,// High-status purple
    cyberBlue: 0x00D2FF,  // Tech & Business clarity
    emerald: 0x10B981,    // Growth & Success
    memeColor: 0xFF5722,  // Vibrant Meme Orange/Red
    darkOnyx: 0x111116,   // Sleek Dark
    error: 0xEF4444,      // Crimson Error
  },

  // Emojis and branding
  branding: {
    serverName: 'The Elite Circle',
    footerText: 'The Elite Circle • High Performance & Mindset Hub',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', // Premium crest icon
  }
};
