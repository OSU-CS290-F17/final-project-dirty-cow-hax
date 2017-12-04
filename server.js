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

app.get('/people/:userID', async (req, res) => {

    const userID = req.params.userID;
    
    const userInfo = await databaseConnection.getUserInfo(userID);
    const entries = await databaseConnection.getEntries(userID);
    
    res.status(200).render('layouts/main', {
        userInfo,
        entries
    });

});

app.get('/people/:userID/:entryID', async (req, res) => {

    const userID = req.params.userID;
    const entryID = req.params.entryID;
    
    if(isNaN(userID) || isNaN(entryID)) {
        
        res.status(400).render('layouts/404');
        return;

    }

    const userInfo = await databaseConnection.getUserInfo(userID);
    const entryData = await databaseConnection.getSingleEntry(userID, entryID);

    if (!userInfo || !entryData) {

        res.status(500).send('Internal Server Error');
        return;

    }

    res.status(200).render('layouts/single-entry', {
        userInfo,
        entryData
    })

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
app.post("/people/new", async (req, res) => { 

    const userData = req.body;
    
    if ( !userData.hasOwnProperty('name') || !userData.hasOwnProperty('age') ) {
        
        res.status(400).render('layouts/bad-request');
        
    }
    
    let id = await databaseConnection.addUser(userData.name, userData.age);
    res.status(307).redirect(`/people/${userID}`);

});


//Add a new entry to a user
app.post("/people/:userID/new", async (req, res) => {

    const userID = req.params.userID;
    const entryData = req.body;

    if ( isNaN(userID) || !entryData.hasOwnProperty('time') || !entryData.hasOwnProperty('weight')) { 
        
        res.status(400).render('layouts/bad-request');
        return;

    }
    
    await databaseConnection.addEntry(userID, {}, entryData);
    res.status(307).redirect(`/people/${userID}`);

});



//#endregion

//#region delete methods



//Delete user
app.delete('/people/:userID', async (req, res) => {

    const userID = req.params.userID;

    if (isNaN(userID)) {

        res.status(400).send('Bad Request');
        return;

    }

    if(!await databaseConnection.deleteUser(userID)) {
        res.status(400).send('Bad Request');
        return;
    }

    res.status(200).send('User Deleted');

});

//Delete entry
app.delete(`/people/:userID/:entryID`, async (req, res) => {


    const userID = req.params.userID;
    const entryID = req.params.entryID;

    if (isNaN(userID) || isNaN(entryID)) {

        res.status(400).send('Bad Request');
        return;

    }

    if(!await databaseConnection.deleteEntry(userID, entryID)) {

        res.status(400).send('Deletion Failed');
        return;

    }

    res.status(200).send('Entry Deleted');

});

//#endregion

//#region server launch

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

//#endregion
