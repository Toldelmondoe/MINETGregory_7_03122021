const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(, {
    dialect: "mysql",
    host: "localhost:8080"
});
const helmet = require('helmet');
const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(bodyParser.json());
app.use(helmet());


module.exports = app;