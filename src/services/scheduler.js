import cron from 'node-cron';
import { config } from '../config.js';
import { db } from '../database/db.js';
import { poster } from './poster.js';

let activeTasks = [];

export const scheduler = {
  init(client) {
    this.stopAll();
    console.log('[Scheduler] Initializing automated tasks...');

    // 1. MEME SCHEDULER: Every 15 minutes
    const memeCronExp = config.schedules.memeCron;
    if (cron.validate(memeCronExp)) {
      const memeTask = cron.schedule(memeCronExp, async () => {
        console.log(`[Scheduler] ⏰ Running 15-Minute Meme Drop (${new Date().toLocaleTimeString()})...`);
        const guilds = db.getAllGuilds();
        for (const g of guilds) {
          if (!g.memeChannelId || g.memesEnabled === false) continue;
          try {
            const channel = await client.channels.fetch(g.memeChannelId).catch(() => null);
            if (channel) {
              const res = await poster.postMeme(channel, g.guildId);
              if (res.success) {
                console.log(`[Scheduler] ✅ Meme posted to #${channel.name} in guild ${g.guildId}`);
              } else {
                console.warn(`[Scheduler] ⚠️ Could not post meme to guild ${g.guildId}: ${res.error}`);
              }
            }
          } catch (err) {
            console.error(`[Scheduler] Error posting meme for guild ${g.guildId}:`, err.message);
          }
        }
      }, {
        timezone: config.timezone
      });
      activeTasks.push({ name: 'Memes (Every 15m)', task: memeTask, cron: memeCronExp });
      console.log(`[Scheduler] 🟢 Meme scheduler active: "${memeCronExp}" (Every 15 minutes)`);
    } else {
      console.error(`[Scheduler] ❌ Invalid meme cron expression: ${memeCronExp}`);
    }

    // 2. DAILY MOTIVATION SCHEDULER: 1 time per day (Default 8:00 AM)
    const motivationCronExp = config.schedules.motivationCron;
    if (cron.validate(motivationCronExp)) {
      const motivationTask = cron.schedule(motivationCronExp, async () => {
        console.log(`[Scheduler] ⏰ Running Daily Motivation Post (${new Date().toLocaleTimeString()})...`);
        const guilds = db.getAllGuilds();
        for (const g of guilds) {
          if (!g.motivationChannelId || g.motivationEnabled === false) continue;
          try {
            const channel = await client.channels.fetch(g.motivationChannelId).catch(() => null);
            if (channel) {
              const res = await poster.postMotivation(channel, g.guildId);
              if (res.success) {
                console.log(`[Scheduler] ✅ Daily motivation posted to #${channel.name} in guild ${g.guildId}`);
              } else {
                console.warn(`[Scheduler] ⚠️ Could not post motivation to guild ${g.guildId}: ${res.error}`);
              }
            }
          } catch (err) {
            console.error(`[Scheduler] Error posting motivation for guild ${g.guildId}:`, err.message);
          }
        }
      }, {
        timezone: config.timezone
      });
      activeTasks.push({ name: 'Daily Motivation (1x/day)', task: motivationTask, cron: motivationCronExp });
      console.log(`[Scheduler] 🟢 Daily motivation scheduler active: "${motivationCronExp}" (1x per day @ 8:00 AM)`);
    } else {
      console.error(`[Scheduler] ❌ Invalid motivation cron expression: ${motivationCronExp}`);
    }

    // 3. BOOK WISDOM & BUSINESS/SOCIAL SKILLS SCHEDULER: 2 times per day (Default 10:00 AM & 6:00 PM)
    const bookCronExp = config.schedules.bookCron;
    if (cron.validate(bookCronExp)) {
      const bookTask = cron.schedule(bookCronExp, async () => {
        console.log(`[Scheduler] ⏰ Running Book & Skills Motivation Post (${new Date().toLocaleTimeString()})...`);
        const guilds = db.getAllGuilds();
        for (const g of guilds) {
          if (!g.bookChannelId || g.booksEnabled === false) continue;
          try {
            const channel = await client.channels.fetch(g.bookChannelId).catch(() => null);
            if (channel) {
              const res = await poster.postBookQuote(channel, g.guildId);
              if (res.success) {
                console.log(`[Scheduler] ✅ Book wisdom posted to #${channel.name} in guild ${g.guildId}`);
              } else {
                console.warn(`[Scheduler] ⚠️ Could not post book wisdom to guild ${g.guildId}: ${res.error}`);
              }
            }
          } catch (err) {
            console.error(`[Scheduler] Error posting book wisdom for guild ${g.guildId}:`, err.message);
          }
        }
      }, {
        timezone: config.timezone
      });
      activeTasks.push({ name: 'Book Page & Skills (2x/day)', task: bookTask, cron: bookCronExp });
      console.log(`[Scheduler] 🟢 Book & Skills scheduler active: "${bookCronExp}" (2x per day @ 10 AM & 6 PM)`);
    } else {
      console.error(`[Scheduler] ❌ Invalid book cron expression: ${bookCronExp}`);
    }
  },

  stopAll() {
    for (const item of activeTasks) {
      if (item.task) item.task.stop();
    }
    activeTasks = [];
  },

  getStatus() {
    return {
      activeCount: activeTasks.length,
      tasks: activeTasks.map(t => ({ name: t.name, cron: t.cron })),
      timezone: config.timezone
    };
  }
};
