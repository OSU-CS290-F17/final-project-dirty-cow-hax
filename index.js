const express  = require("express");
const app      = express();
const path     = require("path");
const fs       = require("fs");

const log      = require("./log");

const config   = require("./config");

// app.use(express.static("client"));

//#region Get routes


app.get('/', (req, res, next) => {

    req.url += "index.html";
    next();

});

app.get('/index.html', (req, res, next) => {

    res.contentType("html");
    res.status(200).sendFile(path.join(__dirname, config.public_folder, "index.html"));


});

app.get('*', (req, res, next) => {

    if(!fs.exists(path.join(__dirname, config.public_folder, req.url))) {
        res.status(404).sendFile(path.join(__dirname, config.public_folder, "404.html"));
        return;
    }

    res.status(200).sendFile(path.join(__dirname, config.public_folder, req.url));

});


//#endregion


//#region Post routes



//#endregion


app.listen(config.port, () => {
    log.info(`Server listening on port ${config.port}`);
});
