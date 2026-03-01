import {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField,
  ChannelType
} from "discord.js";
import dotenv from "dotenv";
import { createTranscript } from "discord-html-transcripts";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const STAFF_ROLE_ID = "1477465151656562748";
const LOG_CHANNEL_ID = "1477467727387037859";

const CATEGORY_MAP = {
  ban: "1477469108235796520",
  report: "1477469081794904115",
  discord: "1477468976744370370",
  bug: "1477468947732369448",
  connect: "1477468916727939284"
};

const CLOSED_CATEGORY_ID = "1477468824633610361";

client.once("clientReady", () => {
  console.log(`✅ ${client.user.tag} 起動完了`);
});

client.on("interactionCreate", async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === "ticketpanel") {

        const embed = new EmbedBuilder()
          .setTitle("Natsuki Community | サポート")
          .setDescription(
            "チケットを作成して運営へお問い合わせください。\n" +
            "同じ内容で複数作成しないでください。"
          )
          .setColor(0x2b2d31)
          .setImage("attachment://ticket.png");

        const row1 = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId("ban").setLabel("BAN異議申し立て").setStyle(ButtonStyle.Danger),
          new ButtonBuilder().setCustomId("report").setLabel("プレイヤー通報").setStyle(ButtonStyle.Primary)
        );

        const row2 = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId("discord").setLabel("Discord通報").setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setCustomId("bug").setLabel("バグ報告").setStyle(ButtonStyle.Secondary),
          new ButtonBuilder().setCustomId("connect").setLabel("接続問題").setStyle(ButtonStyle.Secondary)
        );

        await interaction.reply({
          embeds: [embed],
          components: [row1, row2],
          files: ["./assets/ticket.png"]
        });
      }
    }

    if (!interaction.isButton()) return;

    const guild = interaction.guild;

    if (interaction.customId === "close_ticket") {

      await interaction.reply({
        content: "ログ保存してクローズします...",
        ephemeral: true
      });

      const transcript = await createTranscript(interaction.channel, {
        limit: -1,
        returnType: "buffer",
        filename: `${interaction.channel.name}.html`
      });

      const logChannel = guild.channels.cache.get(LOG_CHANNEL_ID);

      if (logChannel) {
        await logChannel.send({
          content: `チケットログ: ${interaction.channel.name}`,
          files: [{ attachment: transcript, name: `${interaction.channel.name}.html` }]
        });
      }

      await interaction.channel.setParent(CLOSED_CATEGORY_ID);

      await interaction.channel.permissionOverwrites.edit(interaction.user.id, {
        SendMessages: false
      });

      await interaction.channel.permissionOverwrites.edit(STAFF_ROLE_ID, {
        SendMessages: false
      });

      await interaction.channel.send("このチケットはクローズされました。");

      return;
    }

    const categoryId = CATEGORY_MAP[interaction.customId];
    if (!categoryId) return;

    const safeUsername = interaction.user.username
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, "");
    const channelName = `ticket-${safeUsername}-${interaction.customId}`;
    const existing = guild.channels.cache.find(c =>
      c.name === channelName &&
      c.parentId === categoryId
    );

    if (existing) {
      return interaction.reply({
        content: "このカテゴリーですでにチケットがあります。",
        ephemeral: true
      });
    }

    const staffRole = guild.roles.cache.get(STAFF_ROLE_ID);
    if (!staffRole) {
      return interaction.reply({
        content: "運営ロールIDが無効です。",
        ephemeral: true
      });
    }

    const channel = await guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      parent: categoryId,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
        },
        {
          id: staffRole.id,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
        },
        {
          id: guild.members.me.id,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
        }
      ]
    });

    const closeRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("close_ticket")
        .setLabel("チケットを閉じる")
        .setStyle(ButtonStyle.Danger)
    );

    await channel.send({
      content:
        `${interaction.user} さんのチケットです。\n` +
        `種類: ${interaction.customId}\n\n内容を記入してください。`,
      components: [closeRow]
    });

    await interaction.reply({
      content: `✅ チケットを作成しました: ${channel}`,
      ephemeral: true
    });

  } catch (err) {
    console.error(err);
  }
});

client.login(process.env.TOKEN);
