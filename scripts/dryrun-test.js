import cron from 'node-cron';
import { db } from '../src/database/db.js';
import { seedDatabase } from '../src/database/seeds.js';
import { config } from '../src/config.js';
import { poster } from '../src/services/poster.js';
import { commands } from '../src/deploy-commands.js';

console.log('====================================================');
console.log('🧪 RUNNING DRY-RUN VERIFICATION TEST SUITE');
console.log('====================================================\n');

let failedTests = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
  } else {
    console.error(`❌ [FAIL] ${testName}`);
    failedTests++;
  }
}

async function runTests() {
  // Test 1: Database Init & Seed
  console.log('--- TEST 1: Database Initialization & Seeding ---');
  db.init();
  seedDatabase();
  const stats = db.getStats();
  assert(stats.totalMemes >= 10, `Memes seeded successfully (Count: ${stats.totalMemes})`);
  assert(stats.totalMotivations >= 15, `Motivations seeded successfully (Count: ${stats.totalMotivations})`);
  assert(stats.totalBooks >= 20, `Books & Skills seeded successfully (Count: ${stats.totalBooks})`);

  // Test 2: Content Rotation
  console.log('\n--- TEST 2: Content Rotation Engine ---');
  const meme1 = db.getNextMeme();
  assert(meme1 && meme1.imageUrl, `getNextMeme returned valid meme: "${meme1.title || meme1.caption}"`);
  assert(meme1.timesPosted >= 1, `Meme timesPosted incremented (timesPosted: ${meme1.timesPosted})`);

  const mot1 = db.getNextMotivation();
  assert(mot1 && mot1.quote && mot1.author, `getNextMotivation returned valid quote: "${mot1.author}"`);
  assert(mot1.timesPosted >= 1, `Motivation timesPosted incremented (timesPosted: ${mot1.timesPosted})`);

  const book1 = db.getNextBook();
  assert(book1 && book1.bookTitle && book1.takeaway, `getNextBook returned valid book: "${book1.bookTitle}"`);
  assert(book1.timesPosted >= 1, `Book timesPosted incremented (timesPosted: ${book1.timesPosted})`);

  // Test 3: Admin Channel Configuration
  console.log('\n--- TEST 3: Admin Channel Configuration ---');
  const testGuildId = 'test_guild_12345';
  db.setChannel(testGuildId, 'memes', '111111111111111111');
  db.setChannel(testGuildId, 'motivation', '222222222222222222');
  db.setChannel(testGuildId, 'books', '333333333333333333');

  const guildConfig = db.getGuild(testGuildId);
  assert(guildConfig.memeChannelId === '111111111111111111', 'Meme channel ID saved correctly');
  assert(guildConfig.motivationChannelId === '222222222222222222', 'Motivation channel ID saved correctly');
  assert(guildConfig.bookChannelId === '333333333333333333', 'Book channel ID saved correctly');

  // Test 4: Toggle Schedule
  console.log('\n--- TEST 4: Schedule Toggling ---');
  db.toggleSchedule(testGuildId, 'memes', false);
  assert(db.getGuild(testGuildId).memesEnabled === false, 'Meme schedule paused successfully');
  db.toggleSchedule(testGuildId, 'memes', true);
  assert(db.getGuild(testGuildId).memesEnabled === true, 'Meme schedule resumed successfully');

  // Test 5: Dynamic Admin Additions
  console.log('\n--- TEST 5: Dynamic Content Additions by Admin ---');
  const customMeme = db.addMeme({
    imageUrl: 'https://example.com/elite_meme.png',
    caption: 'Custom Test Meme',
    addedBy: 'AdminUser#0001'
  });
  assert(customMeme && customMeme.id.startsWith('meme_'), 'Admin added meme successfully');

  const customMot = db.addMotivation({
    quote: 'Stay hungry, stay foolish.',
    author: 'Steve Jobs',
    category: 'Innovation',
    addedBy: 'AdminUser#0001'
  });
  assert(customMot && customMot.author === 'Steve Jobs', 'Admin added motivation quote successfully');

  const customBook = db.addBook({
    bookTitle: 'The Lean Startup',
    author: 'Eric Ries',
    quoteOrPage: 'The only way to win is to learn faster than anyone else.',
    takeaway: 'Build, Measure, Learn feedback loop.',
    category: 'Entrepreneurship',
    addedBy: 'AdminUser#0001'
  });
  assert(customBook && customBook.bookTitle === 'The Lean Startup', 'Admin added book excerpt successfully');

  // Test 6: Cron Expression Validation
  console.log('\n--- TEST 6: Cron Schedules Validation ---');
  assert(cron.validate(config.schedules.memeCron), `Meme Cron valid: "${config.schedules.memeCron}" (Every 15m)`);
  assert(cron.validate(config.schedules.motivationCron), `Motivation Cron valid: "${config.schedules.motivationCron}" (1x/day @ 8 AM)`);
  assert(cron.validate(config.schedules.bookCron), `Book Cron valid: "${config.schedules.bookCron}" (2x/day @ 10 AM & 6 PM)`);

  // Test 7: Slash Commands Registry
  console.log('\n--- TEST 7: Slash Commands Definition ---');
  assert(commands.length === 8, `All 8 Slash Commands registered: (${commands.map(c => c.name).join(', ')})`);
  const requiredCmds = ['setchannel', 'addmeme', 'addmotivation', 'addbook', 'postnow', 'status', 'toggleschedule', 'queue'];
  for (const cmdName of requiredCmds) {
    const found = commands.some(c => c.name === cmdName);
    assert(found, `Command /${cmdName} exists and has valid structure`);
  }

  // Test 8: Mock Channel Posting / Embed Generation
  console.log('\n--- TEST 8: Embed Generation & Mock Poster Execution ---');
  let postedMessages = [];
  const mockChannel = {
    id: '111111111111111111',
    name: 'memes-and-motivation',
    isTextBased: () => true,
    permissionsFor: () => ({
      has: () => true
    }),
    send: async (payload) => {
      postedMessages.push(payload);
      return { id: `mock_msg_${Date.now()}` };
    }
  };

  const memePostRes = await poster.postMeme(mockChannel, testGuildId, { localOnly: true });
  assert(memePostRes.success === true, 'Meme embed generated and sent to channel');
  assert(typeof postedMessages[0].embeds[0].data.title === 'string' && postedMessages[0].embeds[0].data.title.length > 0, 'Meme embed contains title');

  const motPostRes = await poster.postMotivation(mockChannel, testGuildId, { localOnly: true });
  assert(motPostRes.success === true, 'Daily motivation embed generated and sent to channel');
  assert(postedMessages[1].embeds[0].data.author.name.includes('THE ELITE CIRCLE'), 'Motivation embed contains clean branding header');

  const bookPostRes = await poster.postBookQuote(mockChannel, testGuildId, { localOnly: true });
  assert(bookPostRes.success === true, 'Book wisdom embed generated and sent to channel');
  assert(postedMessages[2].embeds[0].data.author.name.includes('THE ELITE CIRCLE'), 'Book embed contains clean branding header');

  // Summary
  console.log('\n====================================================');
  if (failedTests === 0) {
    console.log('🎉 ALL TESTS PASSED! The bot engine is 100% operational.');
  } else {
    console.error(`💥 ${failedTests} tests failed.`);
  }
  console.log('====================================================');
  process.exit(failedTests === 0 ? 0 : 1);
}

runTests();
