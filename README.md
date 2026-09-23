# 👑 The Elite Circle • Automated Content & Meme Bot

A high-performance Discord automation bot tailored for **The Elite Circle**. The bot automates content drops across three critical channels:
1. 🎭 **Memes Drop:** Every **15 minutes** (`*/15 * * * *`).
2. ⚡ **Daily Motivation:** Once per day at **8:00 AM** (`0 8 * * *`).
3. 📖 **Trending Book Page & Business / Social Skills:** Twice per day at **10:00 AM & 6:00 PM** (`0 10,18 * * *`).

---

## 🚀 Key Features

- **Admin Channel Routing:** Admins can bind and re-route destination channels dynamically using `/setchannel`.
- **Pre-Seeded Masterclass Library:** Comes out-of-the-box with **50+ Business & Social Skills Book Highlights** (*Atomic Habits*, *48 Laws of Power*, *Never Split the Difference*, *The Psychology of Money*, *Zero to One*, *Deep Work*, etc.), **50+ Elite Motivation Quotes**, and curated starter memes.
- **Fair Anti-Repetition Rotation Engine:** Ensures all items in the pool cycle through before repeating, keeping content fresh and engaging.
- **Dynamic Meme Fallback:** Automatically fetches trending safe humor from community feeds if the pool runs low.
- **Instant Preview & Testing:** `/postnow` allows admins to trigger immediate test posts to any channel.
- **Live Server Dashboard:** `/status` displays assigned channels, active timers, item counts, and timezone.
- **Admin Content Ingestion:** Add memes (`/addmeme`), quotes (`/addmotivation`), and book wisdom (`/addbook`) directly inside Discord.

---

## 📁 Project Structure

```
├── .env.example              # Template for Discord bot credentials
├── .env                      # Active environment configuration
├── package.json              # Project manifest and scripts
├── data/                     # Persistent JSON database (auto-created)
│   ├── guilds.json           # Server channel mappings & toggle states
│   ├── memes.json            # Meme pool
│   ├── motivations.json      # Daily motivation quotes
│   ├── books.json            # Business & social skill book library
│   └── history.json          # Audit post log
├── scripts/
│   └── dryrun-test.js        # Automated verification & test suite
└── src/
    ├── config.js             # Configuration, colors, branding, and cron schedules
    ├── deploy-commands.js    # Slash commands deployer (REST API)
    ├── index.js              # Bot entry point and event handlers
    ├── database/
    │   ├── db.js             # Database operations & rotation algorithms
    │   └── seeds.js          # Pre-seeded masterclass library
    ├── services/
    │   ├── poster.js         # Discord embed formatting & channel dispatcher
    │   └── scheduler.js      # node-cron task manager
    └── commands/
        ├── setchannel.js     # /setchannel [category] [channel]
        ├── addcontent.js     # /addmeme, /addmotivation, /addbook
        ├── postnow.js        # /postnow [category]
        ├── status.js         # /status
        ├── toggleschedule.js # /toggleschedule [category] [enabled]
        └── queue.js          # /queue [category]
```

---

## 🛠️ Quick Setup Guide

### 1. Discord Developer Portal Setup
1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Click **New Application** and name it (e.g. `The Elite Circle Bot`).
3. Navigate to the **Bot** tab on the left:
   - Click **Reset Token** and copy your **Bot Token**.
   - Under **Privileged Gateway Intents**, enable **Message Content Intent** (optional: Server Members Intent).
4. Navigate to **OAuth2 > URL Generator**:
   - Scopes: `bot`, `applications.commands`
   - Bot Permissions: `View Channels`, `Send Messages`, `Embed Links`, `Attach Files`, `Read Message History`.
   - Copy the generated URL and paste it in your browser to invite the bot to **The Elite Circle** server.
5. In **General Information**, copy your **Application ID** (this is your `CLIENT_ID`).

### 2. Configure `.env`
Edit the `.env` file in this directory:
```env
DISCORD_TOKEN=your_copied_bot_token_here
CLIENT_ID=your_application_id_here
GUILD_ID=your_discord_server_id_here   # Optional: set for instant slash command sync

# Default timezone for scheduled posts
TIMEZONE=Asia/Kathmandu
```
*(Tip: Right-click your server icon in Discord and choose "Copy Server ID" to get `GUILD_ID`)*

### 3. Deploy Slash Commands
Register the 8 slash commands with Discord:
```cmd
cmd.exe /c npm run deploy-commands
```

### 4. Run the Bot
Start the bot process:
```cmd
cmd.exe /c npm start
```
*For auto-restart during development:*
```cmd
cmd.exe /c npm run dev
```

---

## 🤖 Slash Commands Reference

| Command | Permission | Description |
| :--- | :--- | :--- |
| `/setchannel category channel` | Administrator | Assigns a channel for `memes`, `motivation`, or `books`. |
| `/postnow category [destination]` | Administrator | Instantly posts a meme, motivation, or book page to test delivery. |
| `/addmeme [image] [image_url] [caption]` | Administrator | Adds a custom meme to the 15-minute rotation pool. |
| `/addmotivation quote author [category]` | Administrator | Adds a custom high-impact quote to the morning pool. |
| `/addbook title author quote_or_page takeaway [category]` | Administrator | Adds a business or social skill book takeaway. |
| `/status` | Everyone | View current channel mappings, active timers, and pool counts. |
| `/queue category` | Administrator | Preview upcoming items in the rotation pool. |
| `/toggleschedule category enabled` | Administrator | Pauses or resumes automated drops for any category. |

---

## 🧪 Testing

To run the automated verification suite without needing active bot credentials:
```cmd
cmd.exe /c npm test
```
All tests verify database queries, rotation integrity, cron intervals, embed generation, and command definitions.
