const Room = require("../models/RoomModel");
const UsableRooms = require("./UsableRoomsList");

async function FindFreeRoomsByDate(date_data, month_data, year_data) {
  try {
    if (!date_data) return;
    let Date_Format = `${year_data}-${
      month_data < 10 ? "0" + month_data : month_data
    }-${date_data < 10 ? "0" + date_data : date_data}`;
    let regex = new RegExp(Date_Format, "i");
    const data = await Room.find({ Date: regex });
    let procesed_data = [];
    for (let i = 0; i < data.length; i++) {
      procesed_data.push(data[i].RoomNo);
    }
    return UsableRooms.filter((x) => !procesed_data.includes(x));
  } catch (error) {
    console.log(error);
  }
}

async function FindDataByDate(date_data, month_data, year_data) {
  try {
    if (!date_data) return;
    let Date_Format = `${year_data}-${
      month_data < 10 ? "0" + month_data : month_data
    }-${date_data < 10 ? "0" + date_data : date_data}`;
    let regex = new RegExp(Date_Format, "i");
    return data = await Room.find({ Date: regex });
  } catch (error) {
    console.log(error);
  }
}

function FindFreeRoomsForSlot(data, slot) {
  let arr = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].Slot == slot) {
      arr.push(data[i].RoomNo);
    }
  }
  return UsableRooms.filter((x) => !arr.includes(x));
}

function FindFreeRoomsForSlotExcludedAllDay(slot=[],allday=[]){
  return slot.filter(x => !allday.includes(x));
}

function FindSameString(arr = [], ...arrays) {
  return arr.filter((a) => arrays.every((b) => b.includes(a)));
}

module.exports = {
  FindFreeRoomsForSlot,
  FindSameString,
  FindFreeRoomsByDate,
  FindFreeRoomsForSlotExcludedAllDay,
  FindDataByDate
};
