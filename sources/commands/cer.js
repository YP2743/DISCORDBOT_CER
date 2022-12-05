const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {
  FindFreeRoomsByDate,
  FindFreeRoomsForSlot,
  FindSameString,
  FindFreeRoomsForSlotExcludedAllDay,
  FindDataByDate,
} = require("../server/controllers/RoomController");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cer")
    .setDescription("Check usable rooms in a specific day")
    .addStringOption((option) =>
      option
        .setName("date")
        .setDescription(
          "Must enter. If the date is less than 10, do not put 0 before it !!!"
        )
    )
    .addStringOption((option) =>
      option
        .setName("month")
        .setDescription(
          "If leave blank the default month will be the present month"
        )
    )
    .addStringOption((option) =>
      option
        .setName("year")
        .setDescription(
          "If leave blank the default year will be the present year"
        )
    ),
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;
    let date_data = interaction.options.getString("date");
    let month_data = interaction.options.getString("month");
    let year_data = interaction.options.getString("year");
    let temp_month = new Date().getMonth() + 1;
    let temp_year = new Date().getFullYear();
    if (!month_data) month_data = temp_month;
    if (!year_data) year_data = temp_year;
    let UsedAllDay = await FindDataByDate(date_data, month_data, year_data);
    let FreeRoomsAllDay = await FindFreeRoomsByDate(
      date_data,
      month_data,
      year_data
    );
    let SLOT_1 = FindFreeRoomsForSlot(UsedAllDay, 1);
    let SLOT_1_EAD = FindFreeRoomsForSlotExcludedAllDay(SLOT_1, FreeRoomsAllDay);
    let SLOT_2 = FindFreeRoomsForSlot(UsedAllDay, 2);
    let SLOT_2_EAD = FindFreeRoomsForSlotExcludedAllDay(SLOT_2, FreeRoomsAllDay);
    let SLOT_3 = FindFreeRoomsForSlot(UsedAllDay, 3);
    let SLOT_3_EAD = FindFreeRoomsForSlotExcludedAllDay(SLOT_3, FreeRoomsAllDay);
    let SLOT_4 = FindFreeRoomsForSlot(UsedAllDay, 4);
    let SLOT_4_EAD = FindFreeRoomsForSlotExcludedAllDay(SLOT_4, FreeRoomsAllDay);
    let SLOT_1_2 = FindSameString(SLOT_1_EAD, SLOT_2_EAD);
    let SLOT_2_3 = FindSameString(SLOT_2_EAD, SLOT_3_EAD);
    let SLOT_3_4 = FindSameString(SLOT_3_EAD, SLOT_4_EAD);
    let SLOT_1_2_3 = FindSameString(SLOT_1_EAD, SLOT_2_EAD, SLOT_3_EAD);
    let SLOT_2_3_4 = FindSameString(SLOT_2_EAD, SLOT_3_EAD, SLOT_4_EAD);
    const Embed = new EmbedBuilder()
      .setColor(0xc36fed)
      .setTitle(date_data + "/" + month_data + "/" + year_data)
      .addFields({ name: "All Day", value: FreeRoomsAllDay.toString() })
      .addFields({ name: "SLOT 1", value: SLOT_1_EAD.toString() })
      .addFields({ name: "SLOT 2", value: SLOT_2_EAD.toString() })
      .addFields({ name: "SLOT 3", value: SLOT_3_EAD.toString() })
      .addFields({ name: "SLOT 4", value: SLOT_4_EAD.toString() })
      .addFields({ name: "SLOT 1 & 2", value: SLOT_1_2.toString() })
      .addFields({ name: "SLOT 2 & 3", value: SLOT_2_3.toString() })
      .addFields({ name: "SLOT 3 & 4", value: SLOT_3_4.toString() })
      .addFields({ name: "SLOT 1 & 2 & 3", value: SLOT_1_2_3.toString() })
      .addFields({ name: "SLOT 2 & 3 & 4", value: SLOT_2_3_4.toString() })
      .setTimestamp();
    await interaction.reply({ embeds: [Embed] });
  },
};
