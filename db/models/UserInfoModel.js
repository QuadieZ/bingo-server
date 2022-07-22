const mongoose = require('mongoose')

const UserInfoSchema = new mongoose.Schema({
    username: String,
    completed: [Number],
    isBingo: Boolean
});

module.exports = mongoose.model.UserInfo || mongoose.model("UserInfo", UserInfoSchema)

