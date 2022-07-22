const mongoose = require('mongoose')

const BingoItemSchema = new mongoose.Schema({
    mission: String,
    location: String,
    image: String,
    details: String
})

module.exports = mongoose.model.BingoItems || mongoose.model("BingoItems", BingoItemSchema);

