const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path          = require("path");
const auth          = require("./middleware/auth");
const app = express();

const authRoutes    = require("./routes/auth")
const userRoutes    = require("./routes/user")
const messageRoutes = require("./routes/message")
const commentRoutes = require("./routes/comment")

const { Sequelize } = require('sequelize');
const sequelize = new Sequelize("", {
    dialect: "mysql",
    host: "localhost:8080"
});


app.use(bodyParser.json());
app.use(helmet());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", authRoutes);
app.use("/api/users", auth, userRoutes);
app.use("/api/messages", auth, messageRoutes);
app.use("/api/comments", auth, commentRoutes);

module.exports = app;