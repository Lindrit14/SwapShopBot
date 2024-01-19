const { SlashCommandBuilder } = require("discord.js");

const { EmbedBuilder } = require("discord.js");

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("auction")
    .setDescription("Creates a new auction.")
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("The title of the auction")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("price")
        .setDescription("Starting Price of the offer")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("The category of the auction")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("Time the offer is going to last in hours")
        .setRequired(true)
    )
    .addAttachmentOption((option) =>
      option.setName("file").setDescription("select a file").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("bid")
        .setDescription("Minimal Price increase for each bid")
        .setRequired(false)
    ),
  async execute(interaction) {
    // Retrieve each option from the interaction
    const file = interaction.options.getAttachment("file");
    const title = interaction.options.getString("title");
    const price = interaction.options.getString("price");
    const biddingPrice = interaction.options.getString("bid")
      ? interaction.options.getString("bid")
      : 1; //Default value = 1;
    const time = interaction.options.getString("time");
    const category = interaction.options.getString("category");
    const username = interaction.user.username;
    const idOffer = Date.now();
    const status = "Pending";

    // Create an embed with fields for each piece of data
    const offerEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("New Auction Created")
      .addFields(
        { name: "ID", value: `${idOffer}` },
        { name: "Title", value: title },
        { name: "Starting Price", value: price },
        { name: "Category", value: category },
        { name: "Bidding Price", value: `${biddingPrice} €` },
        { name: "Remaining Time", value: time },
        { name: "By User", value: username },
        { name: "Status", value: status }
      )
      .setTimestamp();

    const contactButton = new ButtonBuilder()
      .setCustomId("contactSeller")
      .setLabel("Contact Seller")
      .setStyle(ButtonStyle.Primary);

    const endOffer = new ButtonBuilder()
      .setCustomId("endAuction")
      .setLabel("End Auction")
      .setStyle(ButtonStyle.Danger);

    // Add the button to a row
    const row = new ActionRowBuilder().addComponents(contactButton);
    row.addComponents(endOffer);

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

      if (interaction.customId === "endAuction") {
        if (interaction.user.username != username) {
          interaction.reply(
            "Only the user that created the auction can end it!"
          );
          return;
        }

        const editedOffer = new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle("Offer has ended")
          .addFields(
            { name: "ID", value: `${idOffer}` },
            { name: "Title", value: title },
            { name: "Starting Price", value: price },
            { name: "Category", value: category },
            { name: "Bidding Price", value: `${biddingPrice} €` },
            { name: "Remaining Time", value: time },
            { name: "By User", value: username },
            { name: "Status", value: status }
          )
          .setTimestamp();

        const newContactButton = new ButtonBuilder()
          .setCustomId("contactSeller")
          .setLabel("Contact Seller")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true);

        const newEndOfferButton = new ButtonBuilder()
          .setCustomId("endAuction")
          .setLabel("End Auction")
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
        interaction.reply(`Auction with id ${idOffer} has ended`);
      }
    });
  },
};
