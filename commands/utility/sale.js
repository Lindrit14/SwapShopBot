const { SlashCommandBuilder, ComponentType } = require("discord.js");

const { EmbedBuilder } = require("discord.js");

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("offer")
    .setDescription("Creates a new offer.")
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("The title of the offer")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("price")
        .setDescription("The price of the offer")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("The category of the offer")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("The type of the offer (sale or auction)")
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
    const type = interaction.options.getString("type");
    const username = interaction.user.username;
    const status = "Pending";

    // Create an embed with fields for each piece of data
    const offerEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("New Offer Created")
      .addFields(
        { name: "ID", value: `${idOffer}` },
        { name: "Title", value: title },
        { name: "Price", value: price },
        { name: "Category", value: category },
        { name: "Type", value: type },
        { name: "By User", value: username },
        { name: "Status", value: status }
      )
      .setTimestamp();

    const contactButton = new ButtonBuilder()
      .setCustomId("contactSeller")
      .setLabel("Contact Seller")
      .setStyle(ButtonStyle.Primary);

    const endOfferButton = new ButtonBuilder()
      .setCustomId("endOffer")
      .setLabel("End Offer")
      .setStyle(ButtonStyle.Danger);

    // Add the button to a row
    const row = new ActionRowBuilder().addComponents(
      contactButton,
      endOfferButton
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
          `This offer was created by ${username}, send them a DM to learn more about the item!`
        );
        return;
      }

      if (interaction.customId === "endOffer") {
        if (interaction.user.username != username) {
          interaction.reply("Only the user that created the offer can end it!");
          return;
        }

        const editedOffer = new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle("Offer has ended")
          .addFields(
            { name: "ID", value: `${idOffer}` },
            { name: "Title", value: title },
            { name: "Price", value: price },
            { name: "Category", value: category },
            { name: "Type", value: type },
            { name: "By User", value: username },
            { name: "Status", value: "Complete" }
          )
          .setTimestamp();

        const newContactButton = new ButtonBuilder()
          .setCustomId("contactSeller")
          .setLabel("Contact Seller")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true);

        const newEndOfferButton = new ButtonBuilder()
          .setCustomId("endOffer")
          .setLabel("End Offer")
          .setStyle(ButtonStyle.Danger)
          .setDisabled(true);

        // Add the button to a row
        const newRow = new ActionRowBuilder().addComponents(
          newContactButton,
          newEndOfferButton
        );

        reponse.edit({
          embeds: [editedOffer],
          components: [newRow],
        });
        interaction.reply(`Offer with id ${idOffer} has ended`);
      }
    });
  },
};
