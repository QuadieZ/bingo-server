const mongoose = require('mongoose')

const BingoItemSchema = new mongoose.Schema({
    mission: String,
    isDone: Boolean,
    location: String
})

module.exports = mongoose.model.BingoItems || mongoose.model("BingoItems", BingoItemSchema);

