const mongoose = require("mongoose");
const RoomSchema = new mongoose.Schema({
    Date: {
        type : String,
        require : true
    },
    Slot: {
        type : Number,
        require : true
    },
    RoomNo: {
        type : String,
        require : true
    },
    Teacher: {
        type : String,
        require : true
    }
},
    { collection: "FPT" }
)

module.exports = mongoose.model("RoomModel", RoomSchema);