const { SlashCommandBuilder, ComponentType, Client, GatewayIntentBits } = require("discord.js");

const { EmbedBuilder } = require("discord.js");

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");


module.exports = {
  data: new SlashCommandBuilder()
    .setName("sale")
    .setDescription("Creates a new sale.")
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("The title of the sale")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("price")
        .setDescription("The price of the sale")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("The category of the sale")
        .setRequired(true)
    )
    .addAttachmentOption((option) =>
      option.setName("file").setDescription("select a file").setRequired(true)
    ),
  async execute(interaction) {
    // Retrieve each option from the interaction

    const idOffer = Date.now();
    const file = interaction.options.getAttachment("file");
    const title = interaction.options.getString("title");
    const price = interaction.options.getString("price");
    const category = interaction.options.getString("category");
    const username = interaction.user.username;
    const status = "Pending";

    // Create an embed with fields for each piece of data
    const offerEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("New Sale Created")
      .addFields(
        { name: "ID", value: `${idOffer}` },
        { name: "Title", value: title },
        { name: "Price", value: price },
        { name: "Category", value: category },
        { name: "Status", value: status }
      )
      .setTimestamp();

    const contactButton = new ButtonBuilder()
      .setCustomId("contactSeller")
      .setLabel("Contact Seller")
      .setStyle(ButtonStyle.Primary);

    const endSaleButton = new ButtonBuilder()
      .setCustomId("endSale")
      .setLabel("End Sale")
      .setStyle(ButtonStyle.Danger);

    // Add the button to a row
    const row = new ActionRowBuilder().addComponents(
      contactButton,
      endSaleButton
    );

    // If there's a file, add it as an image or attachment
    if (file) {
      offerEmbed.setImage(file.url);
    }

    // Respond to the interaction with the embed
    const reponse = await interaction.reply({
      embeds: [offerEmbed],
      components: [row],
    });

    const collector = reponse.createMessageComponentCollector({
      componentType: ComponentType.Button,
    });

    collector.on("collect", (interaction) => {
      if (interaction.customId === "contactSeller") {
        interaction.user.send(
          `This sale was created by ${username}, send them a DM to learn more about the item!`
        );
        return;
      }

      if (interaction.customId === "endSale") {
        if (interaction.user.username != username) {
          interaction.reply("Only the user that created the sale can end it!");
          return;
        }

        const editedOffer = new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle("Sale has ended")
          .addFields(
            { name: "ID", value: `${idOffer}` },
            { name: "Title", value: title },
            { name: "Price", value: price },
            { name: "Category", value: category },
            { name: "Status", value: "Complete" }
          )
          .setTimestamp();

        const newContactButton = new ButtonBuilder()
          .setCustomId("contactSeller")
          .setLabel("Contact Seller")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true);

        const newEndSaleButton = new ButtonBuilder()
          .setCustomId("endSale")
          .setLabel("End Sale")
          .setStyle(ButtonStyle.Danger)
          .setDisabled(true);

        // Add the button to a row
        const newRow = new ActionRowBuilder().addComponents(
          newContactButton,
          newEndSaleButton
        );

        reponse.edit({
          embeds: [editedOffer],
          components: [newRow],
        });
        interaction.reply(`Sale with id ${idOffer} has ended`);
      }
    });
  },
};
