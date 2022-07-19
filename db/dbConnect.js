const mongoose = require("mongoose");
require('dotenv').config();

async function dbConnect() {
    mongoose.connect(process.env.DB_URL)
        .then(() => {
            console.log("Connected Successfully");
        })
        .catch((err) => {
            console.log("Unable to connect");
            console.error(err);
        })
};

module.exports = dbConnect;