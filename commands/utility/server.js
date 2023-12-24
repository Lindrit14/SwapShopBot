const { SlashCommanderBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommanderBuilder()
		.setName('server')
		.setDescription('Provides information about the server'),
	async execute(interaction) {
		await interaction.reply(`This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`);
	},
};