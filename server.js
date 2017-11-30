const express = require("express");
const exphbs  = require("express-handlebars");
const app     = express();
const path    = require("path");
const fs      = require("fs");
const mongo   = require("./mongo");

const log      = require("./log");

const config   = require("./config");

// app.use(express.static("client"));

//#region Get routes

app.engine('handlebars', exphbs({
    defaultLayout: 'boilerplate',
    partialsDir: [
        "views/partials/"
    ]
}));

app.use(express.static('views/public'));

app.set('view engine', 'handlebars');

app.get('/', (req, res, next) => {

    req.url += "index.html";
    next();

});

app.get('/index.html', (req, res, next) => {

    res.status(200).render('layouts/main', {});

});

app.get('*', (req, res, next) => {
    if(req.url.endsWith('/')) req.url = req.url.substring(0, req.url.length - 1);
    res.status(200).render(`layouts${req.url}`, (err, html) => {
        if(err) {
            res.status(404).render('layouts/404');
            return;
        }

        res.send(html);
    });

});


//#endregion


//#region Post routes



//#endregion


// Checks to see if mongo is connected. If not, waits 5 seconds and tries again. If not still it exits
if(mongo.isConnected()) {
    app.listen(config.port, () => {
        log.info(`Server listening on port ${config.port}`);
    });
} else {
    setTimeout(() => {
        if (mongo.isConnected()) {
            app.listen(config.port, () => {
                log.info(`Server listening on port ${config.port}`);
            });
        }
    }, 5 * 1000)
}
