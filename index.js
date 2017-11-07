const express  = require("express");
const config   = require("./config");
const log      = require("./log");
const app      = express();
const path     = require("path");

const util     = require("./util");


app.use(express.static("client"));

const public_path = path.join(__dirname, "client");

app.get('/', (req, res, next) => {

    next();

});

app.get('/index.html', (req, res, next) => {

    const data = util.tryLoadFile("index.html");

    res.status(200).send(data);

});

app.get('*', (req, res, next) => {

    const data = util.tryLoadFile("404.html");

    res.status(404).send(data);

});

app.listen(config.port, () => {
    log.info(`Server listening on port ${config.port}`);
});
