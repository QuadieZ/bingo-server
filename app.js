const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloud = require('cloudinary').v2;

const dbConnect = require('./db/dbConnect');
const User = require('./db/models/UserModel');
const UserInfo = require('./db/models/UserInfoModel')
const BingoItem = require('./db/models/BingoItemModel');
const auth = require('./auth');

const app = express();
dbConnect();

cloud.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});


// Cors Error handling
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});



// body-parser config
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))

// init response
app.get("/", (req, res, next) => {
    res.json({ message: 'Your server is up!' });
    next();
});

// creating register endpoint
app.post("/register", (req, res) => {

    // hash the password
    bcrypt.hash(req.body.password, 10).then((hashedPass) => {
        const user = new User({
            username: req.body.username,
            password: hashedPass
        })

        user.save().then((result) => {
            const userInfo = new UserInfo({
                username: user.username,
                completed: ["", "", "", "", "", "", "", "", "", "", "", "Free", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                isBingo: false
            })
            userInfo.save().then((result) => {
                res.status(201).send({
                    message: "Created Info",
                    result
                });
            })
                .catch((err) => {
                    res.status(500).send({
                        message: "Error creating info",
                        err
                    })
                })
        })
            .catch((err) => {
                res.status(500).send({
                    message: "Error creating user",
                    err
                })
            })
    })
        .catch((err) => {
            res.status(500).send({
                message: "Password was not hashed successfully",
                err
            })
        })


});

// login endpoint
app.post("/login", (req, res) => {
    User.findOne({ username: req.body.username })
        .then((user) => {
            bcrypt.compare(req.body.password, user.password)
                .then((result) => {
                    if (!result) {
                        return res.status(400).send({
                            message: "Password does not match"
                        })
                    }
                    const token = jwt.sign(
                        {
                            userId: user._id,
                            username: user.name,
                        },
                        "RANDOM-TOKEN",
                        { expiresIn: "24h" }
                    )

                    //   return success response
                    res.status(200).send({
                        message: "Login Successful",
                        username: user.username,
                        token,
                    });
                })
        }).catch((err) => {
            res.status(404).send({
                message: "Username not found",
                err
            })
        })
})

// authentication endpoint
app.get("/bingo", auth, (request, response) => {
    BingoItem.find()
        .then((result) => {
            response.status(200).send(result)
        })
        .catch((err) => {
            res.status(404).send({
                message: "Cannot load data",
                err
            })
        })

});

app.post("/bingo", (req, res) => {
    const bingoItem = new BingoItem({
        mission: req.body.mission,
        location: req.body.location,
        image: req.body.image,
        details: req.body.details
    })

    bingoItem.save().then((result) => {
        res.status(201).send({
            message: "Created Bingo Item",
            result
        });
    })
        .catch((err) => {
            res.status(500).send({
                message: "Error creating item",
                err
            })
        })
})

app.get("/data", auth, (req, res) => {
    UserInfo.findOne({ username: req.body.username })
        .then((user) => {
            if (!user) {
                return res.status(500).send({
                    message: "user not found"
                })
            }

            res.status(200).send({
                user
            })
        })

});

// update data
app.put("/data", auth, (req, res) => {
    UserInfo.updateOne({ username: req.body.username }, { $set: { "completed": req.body.updated } })
        .then((result) => {
            res.status(201).send({
                message: "Updated",
                result
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error updating",
                err
            })
        })

});
module.exports = app;

