const { SlashCommandBuilder } = require('discord.js');

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
				.setRequired(true)),
	async execute(interaction) {
		// Retrieve each option from the interaction
		const title = interaction.options.getString('title');
		const price = interaction.options.getString('price');
		const category = interaction.options.getString('category');
		const type = interaction.options.getString('type');

		// Implement logic to handle the offer creation using the provided details

		// Respond to the interaction
		await interaction.reply(`Offer created: ${title}, Price: ${price}, Category: ${category}, Type: ${type}`);
	},
};
