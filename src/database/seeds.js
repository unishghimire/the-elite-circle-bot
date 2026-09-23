import { db } from './db.js';

export const seedBooks = [
  {
    id: 'book_atomic_habits_1',
    bookTitle: 'Atomic Habits',
    author: 'James Clear',
    category: 'Habits & Systems',
    quoteOrPage: 'You do not rise to the level of your goals. You fall to the level of your systems. Your goal is your desired outcome. Your system is the collection of daily habits that will get you there.',
    takeaway: 'Focus on making 1% improvements every single day. Small aggregate changes yield exponential results over 12 months.',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'book_influence_carnegie_1',
    bookTitle: 'How to Win Friends and Influence People',
    author: 'Dale Carnegie',
    category: 'Social Skills & Leadership',
    quoteOrPage: 'You can make more friends in two months by becoming interested in other people than you can in two years by trying to get other people interested in you.',
    takeaway: 'Become genuinely interested in others. Ask insightful questions about their passions and listen 70% of the time.',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'book_never_split_diff_1',
    bookTitle: 'Never Split the Difference',
    author: 'Chris Voss',
    category: 'Negotiation & Communication',
    quoteOrPage: 'Tactical Empathy is listening as a martial art, hearing the unspoken emotional needs behind the opponent’s words. Mirroring (repeating the last 3 words) builds rapport without conceding ground.',
    takeaway: 'Never compromise just to avoid tension. Use calibrated questions starting with "How" and "What" to give the other party an illusion of control while steering the deal.',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'book_psych_money_1',
    bookTitle: 'The Psychology of Money',
    author: 'Morgan Housel',
    category: 'Wealth & Business',
    quoteOrPage: 'Spending money to show people how much money you have is the fastest way to have less money. Wealth is what you don’t see: the cars not purchased, the diamonds not bought, the first-class upgrades declined.',
    takeaway: 'True financial freedom is waking up every morning knowing you have total control over your time and decisions.',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'book_48_laws_1',
    bookTitle: 'The 48 Laws of Power',
    author: 'Robert Greene',
    category: 'Strategy & Power Dynamics',
    quoteOrPage: 'Law 4: Always Say Less Than Necessary. When you are trying to impress people with words, the more you say, the more common you appear, and the less in control. Powerful people impress and intimidate by saying less.',
    takeaway: 'Cultivate restraint. Silence makes other people reveal their hand while preserving your aura of authority and mystery.',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'book_deep_work_1',
    bookTitle: 'Deep Work',
    author: 'Cal Newport',
    category: 'Focus & Productivity',
    quoteOrPage: 'To produce at your peak level you need to work for extended periods with full concentration on a single task free from distraction. High-Quality Work Produced = (Time Spent) x (Intensity of Focus).',
    takeaway: 'Eliminate context-switching. Block out 90-minute hyper-focused morning sessions with notifications strictly disabled.',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'book_zero_to_one_1',
    bookTitle: 'Zero to One',
    author: 'Peter Thiel',
    category: 'Startups & Business Strategy',
    quoteOrPage: 'All happy companies are different: each one earns a monopoly by solving a unique problem. All failed companies are the same: they failed to escape competition. Competition is for losers; seek creative monopoly.',
    takeaway: 'Don’t build a slightly better copy of an existing solution. Create proprietary value 10x better in a specific niche and scale outward.',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'book_naval_almanack_1',
    bookTitle: 'The Almanack of Naval Ravikant',
    author: 'Eric Jorgenson',
    category: 'Wealth & Judgment',
    quoteOrPage: 'Seek wealth, not money or status. Wealth is having assets that earn while you sleep. Forget status games; they are zero-sum games played by people seeking attention rather than sovereignty.',
    takeaway: 'Scale yourself with leverage: code, media, capital, and labor. Products with zero marginal cost of reproduction create disproportionate wealth.',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'book_crucial_conv_1',
    bookTitle: 'Crucial Conversations',
    author: 'Kerry Patterson et al.',
    category: 'Social Skills & Communication',
    quoteOrPage: 'When stakes are high, opinions vary, and emotions run strong, humans either go to silence (withholding info) or violence (controlling, attacking). The masters of dialogue create Psychological Safety first.',
    takeaway: 'Before disagreeing, establish a mutual purpose and mutual respect. People never become defensive because of what you say; they become defensive because they feel unsafe.',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'book_cialdini_influence_1',
    bookTitle: 'Influence: The Psychology of Persuasion',
    author: 'Robert Cialdini',
    category: 'Sales & Psychology',
    quoteOrPage: 'The Principle of Reciprocity: People feel deeply obligated to return favors and concessions. If you provide genuine, unexpected value upfront without demanding anything, people instinctively look for ways to help you succeed.',
    takeaway: 'Lead every professional interaction by offering a resource, connection, or solution first. The social reciprocity returns ten-fold.',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'book_high_output_mgmt_1',
    bookTitle: 'High Output Management',
    author: 'Andrew S. Grove',
    category: 'Management & Scale',
    quoteOrPage: 'The output of a manager is the output of the organizational units under his or her supervision or influence. Your leverage is measured by how much output you can generate per hour of your time invested.',
    takeaway: 'Identify high-leverage activities: training team members, defining clear decision metrics, and removing systemic bottlenecks.',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'book_hard_thing_1',
    bookTitle: 'The Hard Thing About Hard Things',
    author: 'Ben Horowitz',
    category: 'Leadership & Resilience',
    quoteOrPage: 'There are no silver bullets, only lead bullets. In the struggle, you will feel like you are failing every day. The difference between a master CEO and an amateur is the ability to look the brutal truth in the face without blinking.',
    takeaway: 'Embrace the struggle. When everything is going wrong, focus on the single next move that keeps the company alive.',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'book_thinking_fast_slow_1',
    bookTitle: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    category: 'Cognitive Science & Decisions',
    quoteOrPage: 'System 1 operates automatically and quickly, with little or no effort and no sense of voluntary control. System 2 allocates attention to effortful mental operations. True leadership requires catching your System 1 biases before making major bets.',
    takeaway: 'Never make irreversible decisions under emotional highs or fatigue. Force System 2 deliberation through checklists and pre-mortems.',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'book_principles_dalio_1',
    bookTitle: 'Principles: Life and Work',
    author: 'Ray Dalio',
    category: 'Systems & Decision Making',
    quoteOrPage: 'Pain + Reflection = Progress. If you can develop a reflex to view pain as a puzzle that yields a gem (a principle) once solved, you will evolve at lightning speed.',
    takeaway: 'Radical open-mindedness and radical transparency allow reality to guide your strategy rather than ego or wishful thinking.',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'book_extreme_ownership_1',
    bookTitle: 'Extreme Ownership',
    author: 'Jocko Willink & Leif Babin',
    category: 'Leadership & Discipline',
    quoteOrPage: 'There are no bad teams, only bad leaders. When a leader takes 100% ownership of everything in their world—including the mistakes of subordinates—the culture immediately shifts to problem-solving and accountability.',
    takeaway: 'Never point fingers or make excuses. If someone failed, ask how you can communicate the intent, training, or resources more clearly.',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'book_ego_is_enemy_1',
    bookTitle: 'Ego Is the Enemy',
    author: 'Ryan Holiday',
    category: 'Mindset & Stoicism',
    quoteOrPage: 'Silence is the respite of the confident and the strong. The pretense of knowledge is our greatest obstacle to skill. Be an eternal student; the moment you believe you have arrived is the moment you begin to decline.',
    takeaway: 'Detach yourself from praise and validation. Direct all energy toward the craft, the execution, and the standards you hold yourself to.',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'book_7_habits_1',
    bookTitle: 'The 7 Habits of Highly Effective People',
    author: 'Stephen R. Covey',
    category: 'Personal Mastery',
    quoteOrPage: 'Habit 5: Seek First to Understand, Then to Be Understood. Most people do not listen with the intent to understand; they listen with the intent to reply. They are either speaking or preparing to speak.',
    takeaway: 'Paraphrase the other person’s argument so clearly that they say: "Exactly, that is what I mean." Only then can you present your perspective with true authority.',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'book_shoe_dog_1',
    bookTitle: 'Shoe Dog',
    author: 'Phil Knight',
    category: 'Entrepreneurship & Grit',
    quoteOrPage: 'The cowards never started and the weak died along the way. That leaves us, ladies and gentlemen. Us. Let everyone else call your idea crazy... just keep going. Don’t stop. Don’t even think about stopping until you get there.',
    takeaway: 'Relentless persistence beats raw talent. When capital is tight, stay focused on delivering unmatched quality to the community that believes in your mission.',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'book_good_to_great_1',
    bookTitle: 'Good to Great',
    author: 'Jim Collins',
    category: 'Business Excellence',
    quoteOrPage: 'Level 5 Leaders channel their ego needs away from themselves and into the larger goal of building a great company. They display a paradoxical blend of personal humility and indomitable professional will.',
    takeaway: 'The Flywheel Effect: Greatness comes not from a single dramatic breakthrough, but from pushing a heavy flywheel turn upon turn over years.',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'book_meditations_1',
    bookTitle: 'Meditations',
    author: 'Marcus Aurelius',
    category: 'Stoicism & Mental Resilience',
    quoteOrPage: 'The impediment to action advances action. What stands in the way becomes the way. You have power over your mind, not outside events. Realize this, and you will find your strength.',
    takeaway: 'Convert every setback, rejection, or delay into fuel for mental discipline, patience, and character refinement.',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  }
];

export const seedMotivations = [
  {
    id: 'mot_1',
    quote: 'The secret of change is to focus all of your energy, not on fighting the old, but on building the new.',
    author: 'Socrates',
    category: 'Focus & Vision',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'mot_2',
    quote: 'We don’t rise to the level of our expectations, we fall to the level of our training.',
    author: 'Archilochus',
    category: 'Discipline',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'mot_3',
    quote: 'If you want to live an exceptional life, you must give up the desire to be normal. Average habits yield average outcomes.',
    author: 'The Elite Circle Codex',
    category: 'Elite Standards',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'mot_4',
    quote: 'Discipline is choosing between what you want now and what you want most.',
    author: 'Abraham Lincoln',
    category: 'Self-Control',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'mot_5',
    quote: 'You will never change your life until you change something you do daily. The secret of your success is found in your daily routine.',
    author: 'John C. Maxwell',
    category: 'Consistency',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'mot_6',
    quote: 'First say to yourself what you would be; and then do what you have to do.',
    author: 'Epictetus',
    category: 'Stoic Execution',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'mot_7',
    quote: 'The cost of being disciplined is always less than the price of regret.',
    author: 'Nido Qubein',
    category: 'Mindset',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'mot_8',
    quote: 'Do not pray for an easy life, pray for the strength to endure a difficult one.',
    author: 'Bruce Lee',
    category: 'Strength & Grit',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'mot_9',
    quote: 'The master has failed more times than the beginner has even tried.',
    author: 'Stephen McCranie',
    category: 'Mastery',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'mot_10',
    quote: 'He who has a why to live can bear almost any how.',
    author: 'Friedrich Nietzsche',
    category: 'Purpose & Will',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'mot_11',
    quote: 'Success isn’t owned, it’s leased. And rent is due every single day.',
    author: 'J.J. Watt',
    category: 'Daily Hustle',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'mot_12',
    quote: 'Waste no more time arguing what a good man should be. Be one.',
    author: 'Marcus Aurelius',
    category: 'Action Over Words',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'mot_13',
    quote: 'The only person you are destined to become is the person you decide to be.',
    author: 'Ralph Waldo Emerson',
    category: 'Sovereignty',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'mot_14',
    quote: 'Obsessed is just a word the lazy use to describe the dedicated.',
    author: 'Russell Warren',
    category: 'Focus',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'mot_15',
    quote: 'If you are the smartest person in the room, you are in the wrong room. Surround yourself with giants.',
    author: 'Confucius',
    category: 'Network & Standards',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  }
];

export const seedMemes = [
  {
    id: 'meme_ai_1',
    imageUrl: 'https://i.imgflip.com/1ur9b0.jpg',
    title: 'Prompt Engineering vs 500 Lines of Code',
    caption: 'Why write 500 lines of manual code when you can prompt an AI agent to build it in 10 seconds 🧠🤖',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'meme_ai_2',
    imageUrl: 'https://i.imgflip.com/1bhk.jpg',
    title: 'Autonomous AI Agent Running Amok',
    caption: 'Watching your autonomous AI coding agent commit 42 files and refactor the entire architecture at 3 AM 🔥💻',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'meme_ai_3',
    imageUrl: 'https://i.imgflip.com/261o3j.jpg',
    title: 'AI Agent Reflection Loop',
    caption: 'Agent 1 writing the code vs Agent 2 critiquing it vs Agent 3 planning world domination 🤖🔄',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'meme_ai_4',
    imageUrl: 'https://i.imgflip.com/26am.jpg',
    title: 'Vibe Coding with AI',
    caption: 'Software Engineer distracted by Cursor & Claude Sonnet while traditional syntax typing looks on in despair 👀⚡',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'meme_ai_5',
    imageUrl: 'https://i.imgflip.com/1g8my4.jpg',
    title: 'Two Buttons: Manual Debug vs Let AI Agent Fix It',
    caption: 'Sweating over 4 hours of stack trace logs vs hitting "Ask AI Agent" and watching it patch the bug in 3 seconds 🚀🤖',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'meme_ai_6',
    imageUrl: 'https://i.imgflip.com/30b1gx.jpg',
    title: 'Drake Hotline: Reading Docs vs AI Agent Summary',
    caption: 'Reading 400 pages of legacy API docs? Nah. Feeding it to an AI Agent with tool use? Absolutely. 💼💡',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'meme_ai_7',
    imageUrl: 'https://i.imgflip.com/2wifvo.jpg',
    title: 'AI Confident Hallucinations',
    caption: 'When the LLM hallucinates an entire npm library that does not exist but gives you complete documentation 🤡📦',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'meme_ai_8',
    imageUrl: 'https://i.imgflip.com/1otk96.jpg',
    title: 'Change My Mind: Multi-Agent Systems Are The Future',
    caption: 'Autonomous AI Agent swarms will build 90% of business applications by 2027. Change my mind ☕🤖',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'meme_ai_9',
    imageUrl: 'https://i.imgflip.com/43a45p.jpg',
    title: 'Bernie Sanders: Asking for More GPU Compute',
    caption: 'I am once again asking for more H100 clusters and infinite context window tokens 📈⚡',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  },
  {
    id: 'meme_ai_10',
    imageUrl: 'https://i.imgflip.com/2cp1.jpg',
    title: 'Senior Architect Discovers Vibe Coding',
    caption: 'When the senior architect realizes the junior dev with an AI Agent just deployed the whole production MVP before lunch 🤯💻',
    timesPosted: 0,
    lastPostedAt: null,
    addedBy: 'system'
  }
];

export function seedDatabase() {
  db.init();
  const added = db.seedIfEmpty({
    books: seedBooks,
    motivations: seedMotivations,
    memes: seedMemes
  });
  console.log(`[Seed] Seeded ${added} starter library items into database.`);
  return added;
}
