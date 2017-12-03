const express              = require("express");
const exphbs               = require("express-handlebars");
const app                  = express();
const path                 = require("path");
const databaseConnection   = require("./database");
const bodyParser           = require('body-parser');

const __debug            = process.env.DEBUG == "true";

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
app.use(bodyParser.json());

app.set('view engine', 'handlebars');

app.get('/', (req, res, next) => {

    req.url += "index";
    next();

});

app.get('/index', (req, res, next) => {

    res.status(200).render('layouts/main', {
        showLogin: true
    });

});

app.get('/people/:userID', (req, res) => {

    const userID = parseInt(req.params.userID);
    
    if(isNaN(userID)) {

        res.status(400).render('layouts/bad-request');
        return;

    }

    const userInfo = databaseConnection.getUserInfo(userID);
    const entries = databaseConnection.getEntries(userID);
    
    res.status(200).render('layouts/main', {
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
    const entryData  = databaseConnection.getSingleEntry(userID, entryID);

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


//Generate a brand new user here and load the new user's page
app.post("/people/new", (req, res) => { 

    //Create user
    const userData = req.body;

    res.status(307).redirect(`/people/${userID}`);

});


//Add a new entry to a user
app.post("/people/:userID/new", (req, res) => {

    const userID = parseInt(req.params.userID);
    const entryData = req.body;

    if ( isNaN(userID) ) { 
        
        res.status(400).render('layouts/bad-request');
        return;

    }

    res.status(307).redirect(`/people/${userID}`);

});



//#endregion




//#region delete methods



//Delete user
app.delete('/people/:userID', (req, res) => {

    const userID = parseInt(req.params.userID);

    if (isNaN(userID)) {

        res.status(400).render('layouts/bad-request');
        return;

    }

    databaseConnection.deleteUser()

});

//Delete entry
app.delete(`/people/:userID/:entryID`, (req, res) => {


    const userID = parseInt(req.params.userID);
    const entryID = parseInt(req.params.entryID);

    if (isNaN(userID) || isNaN(entryID)) {

        res.status(400).render('layouts/bad-request');
        return;

    }

    databaseConnection.deleteEntry(entryID);

});



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
