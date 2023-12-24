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

		// Implement logic to handle the offer creation using the provided details

		// You might want to use the file URL or some property in your response or internal logic
		// Respond to the interaction with acknowledgment of the file and other details
		await interaction.reply({
			content: `File Attached: ${file ? file.url : 'No file attached'}, Offer created: ${title}, Price: ${price}, Category: ${category}, Type: ${type}`,
		});
	},
};
