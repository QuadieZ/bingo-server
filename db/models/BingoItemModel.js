const mongoose = require('mongoose')

const BingoItemSchema = new mongoose.Schema({
    mission: {
        type: String
    },
    isDone: {
        type: Boolean
    },
    location: {
        type: String
    }
})

module.exports = mongoose.model.BingoItems || mongoose.model("BingoItems", BingoItemSchema);

