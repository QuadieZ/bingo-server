const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const dbConnect = require('./db/dbConnect');
const User = require('./db/models/UserModel');
const auth = require('./auth');

const app = express();
dbConnect();

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// init response
app.get("/", (req, res, next) => {
    res.json({ message: 'Your server is up!' });
    next();
});

// creating register endpoint
app.post("/register", (req, res) => {

    // hash the password
    bcrypt.hash(req.body.password, 10).then((hashedPass) => {
        console.log("hashed", hashedPass)
        const user = new User({
            username: req.body.username,
            password: hashedPass
        })

        user.save().then((result) => {
            res.status(201).send({
                message: "User created successfully",
                result
            });
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


// free endpoint
app.get("/free-endpoint", (request, response) => {
    response.json({ message: "You are free to access me anytime" });
});

// authentication endpoint
app.get("/auth-endpoint", auth, (request, response) => {
    response.json({ message: "You are authorized to access me" });
});

module.exports = app;

