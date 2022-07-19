const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Username is taken"],
    },
    password: {
        type: String,
        required: [true, "Password is requried"],
        unique: false
    }
});

module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);