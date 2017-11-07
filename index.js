const express  = require("express");
const app      = express();
const path     = require("path");

const util     = require("./util");
const log      = require("./log");

const config   = require("./config");

app.use(express.static("client"));

//#region Get routes


app.get('/', (req, res, next) => {

    next();

});

app.get('index', (req, res, next) => {

    const data = util.tryLoadFile("index.html");

    res.status(200).send(data);

});

app.get('*', (req, res, next) => {

    const data = util.tryLoadFile("404.html");

    res.status(404).send(data);

});


//#endregion


//#region Post routes



//#endregion


app.listen(config.port, () => {
    log.info(`Server listening on port ${config.port}`);
});
