const express              = require("express");
const exphbs               = require("express-handlebars");
const app                  = express();
const path                 = require("path");
const databaseConnection   = require("./database");

const __debug            = process.env.DEBUG;

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

    req.url += "index";
    next();

});

app.get('/index', (req, res, next) => {

    res.status(200).render('layouts/main', {});

});

app.get('/people/:userID', (req, res) => {

    const userID = parseInt(req.params.userID);
    
    if(isNaN(userID)) {

        res.status(400).render('layouts/bad-request');
        return;

    }

    const userInfo = databaseConnection.getUserInfo(userID);
    const entries = databaseConnection.getEntries(userID);
    
    res.status(200).render('layouts/user-overview', {
        userInfo,
        entries
    });

});

app.get('/people/:userID/:entryID', (req, res) => {

    const userID = parseInt(req.params.userID);
    const entryID = parseInt(req.params.entryID);

    if(isNaN(userID) || isNaN(entryID)) {
        
        res.status(400).render('layouts/bad-request');
        return;

    }

    const userInfo = databaseConnection.getUserInfo(userID);
    const entryID  = databaseConnection.getSingleEntry(userID, entryID);

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

app.post("")

//#endregion


// Checks to see if databaseConnection is connected. If not, waits 5 seconds and tries again. If not still it exits
if(databaseConnection.isConnected() || __debug) {
    app.listen(config.port, () => {
        log.info(`Server listening on port ${config.port}`);
    });
} else {
    setTimeout(() => {
        if (databaseConnection.isConnected()) {
            app.listen(config.port, () => {
                log.info(`Server listening on port ${config.port}`);
            });
        }
    }, 5 * 1000)
}
