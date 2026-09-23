import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { db } from '../database/db.js';
import { config } from '../config.js';

export const addMemeCommand = {
  data: new SlashCommandBuilder()
    .setName('addmeme')
    .setDescription('Add a new meme to the automated 15-minute rotation pool')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addAttachmentOption(option =>
      option
        .setName('image')
        .setDescription('Upload meme image file')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('image_url')
        .setDescription('Or provide an image URL')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('caption')
        .setDescription('Optional witty caption / title for the meme')
        .setRequired(false)
    ),

  async execute(interaction) {
    const attachment = interaction.options.getAttachment('image');
    const imageUrl = interaction.options.getString('image_url');
    const caption = interaction.options.getString('caption') || 'Elite Circle Humor';

    const finalUrl = attachment ? attachment.url : imageUrl;
    if (!finalUrl) {
      return interaction.reply({
        content: '❌ Please provide either an uploaded image attachment or an `image_url`.',
        ephemeral: true
      });
    }

    const item = db.addMeme({
      imageUrl: finalUrl,
      caption,
      title: caption,
      addedBy: interaction.user.tag
    });

    const embed = new EmbedBuilder()
      .setColor(config.colors.memeColor)
      .setTitle('✅ Meme Added to Rotation Pool')
      .setDescription(`**Caption:** *${caption}*\n**Meme ID:** \`${item.id}\`\nThis meme will now appear in the 15-minute scheduled drop!`)
      .setImage(finalUrl)
      .setFooter({ text: `${config.branding.footerText} • Pool Size: ${db.getMemes().length} memes` })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }
};

export const addMotivationCommand = {
  data: new SlashCommandBuilder()
    .setName('addmotivation')
    .setDescription('Add a new high-impact daily motivation quote')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option =>
      option
        .setName('quote')
        .setDescription('The motivational quote text')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('author')
        .setDescription('Author / Speaker of the quote')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('category')
        .setDescription('Theme / Category (e.g. Discipline, Stoicism, Mindset)')
        .setRequired(false)
    ),

  async execute(interaction) {
    const quote = interaction.options.getString('quote');
    const author = interaction.options.getString('author');
    const category = interaction.options.getString('category') || 'Discipline & Mindset';

    const item = db.addMotivation({
      quote,
      author,
      category,
      addedBy: interaction.user.tag
    });

    const embed = new EmbedBuilder()
      .setColor(config.colors.gold)
      .setTitle('✅ Daily Motivation Added')
      .setDescription(`>>> **"${quote}"**\n\n— *${author}*`)
      .addFields(
        { name: 'Category', value: `\`${category}\``, inline: true },
        { name: 'Total Motivation Pool', value: `${db.getMotivations().length} quotes`, inline: true }
      )
      .setFooter({ text: config.branding.footerText })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }
};

export const addBookCommand = {
  data: new SlashCommandBuilder()
    .setName('addbook')
    .setDescription('Add a trending book excerpt & business / social skill takeaway')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option =>
      option
        .setName('title')
        .setDescription('Title of the book')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('author')
        .setDescription('Author of the book')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('quote_or_page')
        .setDescription('The key page excerpt / quote from the book')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('takeaway')
        .setDescription('Actionable business / social skill takeaway')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('category')
        .setDescription('Category (e.g. Business Strategy, Social Skills, Wealth, Negotiation)')
        .setRequired(false)
    ),

  async execute(interaction) {
    const bookTitle = interaction.options.getString('title');
    const author = interaction.options.getString('author');
    const quoteOrPage = interaction.options.getString('quote_or_page');
    const takeaway = interaction.options.getString('takeaway');
    const category = interaction.options.getString('category') || 'Business & Social Skills';

    const item = db.addBook({
      bookTitle,
      author,
      quoteOrPage,
      takeaway,
      category,
      addedBy: interaction.user.tag
    });

    const embed = new EmbedBuilder()
      .setColor(config.colors.cyberBlue)
      .setTitle('✅ Book Wisdom & Skills Entry Added')
      .setDescription(`**${bookTitle}** by *${author}*\nCategory: \`${category}\``)
      .addFields(
        { name: '📑 Excerpt', value: `> "${quoteOrPage}"`, inline: false },
        { name: '🎯 Key Takeaway / Skill', value: takeaway, inline: false },
        { name: 'Total Book Library', value: `${db.getBooks().length} book entries`, inline: true }
      )
      .setFooter({ text: config.branding.footerText })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }
};
