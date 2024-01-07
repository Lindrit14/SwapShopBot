const { SlashCommandBuilder } = require('discord.js');
// const { Collection, Events, GatewayIntentBits } = require('discord.js');

// const { insertOffer, getOffer, endOffer, generateUniqueOfferId } = require('./db/database');
// const client = new Client({ intents: [GatewayIntentBits.Guilds] });


const { EmbedBuilder } = require('discord.js');

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// const offerId = generateUniqueOfferId();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('offer')
		.setDescription('Creates a new offer.')
		.addStringOption(option =>
			option.setName('title')
				.setDescription('The title of the offer')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('price')
				.setDescription('The price of the offer')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('category')
				.setDescription('The category of the offer')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('type')
				.setDescription('The type of the offer (sale or auction)')
				.setRequired(true))
		.addAttachmentOption(option =>
			option.setName('file')
				.setDescription('select a file')
				.setRequired(true)),
	async execute(interaction) {
		// Retrieve each option from the interaction

		const file = interaction.options.getAttachment('file');
		const title = interaction.options.getString('title');
		const price = interaction.options.getString('price');
		const category = interaction.options.getString('category');
		const type = interaction.options.getString('type');

		// Create an embed with fields for each piece of data
		const offerEmbed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('New Offer Created')
			.addFields(
				{ name: 'Title', value: title },
				{ name: 'Price', value: price },
				{ name: 'Category', value: category },
				{ name: 'Type', value: type },
			)
			.setTimestamp();

		const contactButton = new ButtonBuilder()
			.setCustomId('contactSeller')
			.setLabel('Contact Seller')
			.setStyle(ButtonStyle.Primary);

		// Add the button to a row


		const endOfferButton = new ButtonBuilder()
			.setCustomId('endOffer')
			.setLabel('End Offer')
			.setStyle(ButtonStyle.Danger);

		const row = new ActionRowBuilder().addComponents(contactButton, endOfferButton);
		// If there's a file, add it as an image or attachment
		if (file) {
			offerEmbed.setImage(file.url);
		}

		// Respond to the interaction with the embed
		await interaction.reply({ embeds: [offerEmbed], components: [row] });
	},


};
