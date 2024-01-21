const { SlashCommandBuilder, ComponentType, Client, GatewayIntentBits } = require("discord.js");

const { EmbedBuilder } = require("discord.js");

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");


module.exports = {
  data: new SlashCommandBuilder()
    .setName("trade")
    .setDescription("Creates a new Trade.")
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("The title of the trade")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("price")
        .setDescription("The price of the trade")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("The category of the trade")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("looking-for")
        .setDescription("What should be traded for")
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
    const looking = interaction.options.getString("looking-for");
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
        { name: "Looking-for", value: looking },
        { name: "Status", value: status }
      )
      .setTimestamp();

    const contactButton = new ButtonBuilder()
      .setCustomId("contactSeller")
      .setLabel("Contact Seller")
      .setStyle(ButtonStyle.Primary);

    const endTradeButton = new ButtonBuilder()
      .setCustomId("endTrade")
      .setLabel("End Trade")
      .setStyle(ButtonStyle.Danger);

    // Add the button to a row
    const row = new ActionRowBuilder().addComponents(
      contactButton,
      endTradeButton
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
          `This trade was created by ${username}, send them a DM to learn more about the item!`
        );
        return;
      }

      if (interaction.customId === "endTrade") {
        if (interaction.user.username != username) {
          interaction.reply("Only the user that created the trade can end it!");
          return;
        }

        const editedOffer = new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle("Trade has ended")
          .addFields(
            { name: "ID", value: `${idOffer}` },
            { name: "Title", value: title },
            { name: "Price", value: price },
            { name: "Category", value: category },
            { name: "Looking-for", value: looking },
            { name: "Status", value: "Complete" }
          )
          .setTimestamp();

        const newContactButton = new ButtonBuilder()
          .setCustomId("contactSeller")
          .setLabel("Contact Seller")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true);

        const newEndTradeButton = new ButtonBuilder()
          .setCustomId("endTrade")
          .setLabel("End Trade")
          .setStyle(ButtonStyle.Danger)
          .setDisabled(true);

        // Add the button to a row
        const newRow = new ActionRowBuilder().addComponents(
          newContactButton,
          newEndTradeButton
        );

        reponse.edit({
          embeds: [editedOffer],
          components: [newRow],
        });
        interaction.reply(`Trade with id ${idOffer} has ended`);
      }
    });
  },
};
