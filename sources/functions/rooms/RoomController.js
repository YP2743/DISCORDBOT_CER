const Room = require("../models/RoomModel");
const UsableRooms = require("./UsableRoomsList");
const Date_Array = require("./Date_Array");
const Month_Array = require("./Month_Array");
const February_Date = require("./February_Date");
const { cacheValueWithEx, getCache } = require("../redis/RedisCommands");

async function FindDataByDate(date_data, month_data, year_data) {
  try {
    if (
      !date_data ||
      !Date_Array.includes(date_data) ||
      !Month_Array.includes(month_data.toString()) ||
      year_data.toString() !== "2023"
    )
      return;
    else if (month_data.toString() === "2") {
      if (!February_Date.includes(date_data)) return;
    }
    let Date_Format = `${year_data}-${
      month_data < 10 ? "0" + month_data : month_data
    }-${date_data < 10 ? "0" + date_data : date_data}`;
    let regex = new RegExp(Date_Format, "i");
    let redis_data = await getCache(Date_Format);
    if (redis_data !== null) {
      return JSON.parse(redis_data);
    } else {
      let data = await Room.find({ Date: regex });
      await cacheValueWithEx(Date_Format, JSON.stringify(data), 86400);
      return data;
    }
  } catch (error) {
    console.log(error);
  }
}

function FindFreeRoomsByDate(data) {
  let procesed_data = [];
  for (let i = 0; i < data.length; i++) {
    procesed_data.push(data[i].RoomNo);
  }
  return UsableRooms.filter((x) => !procesed_data.includes(x));
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

function FindFreeRoomsForSlotExcludedAllDay(slot = [], allday = []) {
  let slot_excludedAD = slot.filter((x) => !allday.includes(x));
  if (slot_excludedAD.length === 0) {
    slot_excludedAD.push("Check All Day List !!!");
  }
  return slot_excludedAD;
}

function FindSameString(arr = [], ...arrays) {
  let arr__ = [
    "No Consecutive Empty Rooms or All Rooms are already consecutive !!!",
  ];
  let arr_ = arr.filter((a) => arrays.every((b) => b.includes(a)));
  if (arr_.length === 0 || arr_.includes("Check All Day List !!!")) {
    return arr__;
  } else return arr_;
}

module.exports = {
  FindFreeRoomsForSlot,
  FindSameString,
  FindFreeRoomsByDate,
  FindFreeRoomsForSlotExcludedAllDay,
  FindDataByDate,
};
