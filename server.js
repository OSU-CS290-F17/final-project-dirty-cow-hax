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

app.get('/index', async (req, res, next) => {

    const users = await databaseConnection.getUsers();
    for(let i = 0; i < users.length; i++){
        users[i].home = true;
    }
    res.status(200).render('layouts/index', {
        showLogin: true,
        people: users
    });

});

app.get('/people/:userID', async (req, res) => {

    const userID = req.params.userID;
    
    const userInfo = await databaseConnection.getUser(userID);
    const entries = await databaseConnection.getEntries(userID, 25, 0);
    
    res.status(200).render('layouts/main', {
        userInfo,
        entries
    });

});


app.get(`/people/:userID/raw`, async (req, res) => {

    const userID = req.params.userID;
    const entries = await databaseConnection.getEntries(userID, 25, 0);

    res.status(200).contentType('application/json').send(entries);

});


app.get('*', (req, res, next) => {

    if(req.url.endsWith('/')) req.url = req.url.substring(0, req.url.length - 1);
    res.status(200).render(`layouts${req.url}`, (err, html) => {
        if(err) {
            res.status(404).render('layouts/error', {
                err: "Page not Found.",
                errNum: 404
            });
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
        
        res.status(400).render('layouts/error', {
            err: "Bad Request",
            errNum: 400
        });
        
    }
    
    let id = await databaseConnection.addUser(userData.name, userData.age);
    res.status(200).send(id);
    // res.stat

});


//Add a new entry to a user
app.post("/people/:userID/new", async (req, res) => {

    const userID = req.params.userID;
    const entryData = req.body;

    if ( /*isNaN(userID) ||*/ !entryData.hasOwnProperty('time') || !entryData.hasOwnProperty('weight')) { 
        console.log(userID, req.body);
        res.status(400).render('layouts/error', {
            err: "Bad Request",
            errNum: 400
        });
        return;

    }
    await databaseConnection.addEntry(userID, entryData);
    res.status(200).send("complete");

});



//#endregion

//#region delete methods



//Delete user
app.delete('/people/:userID', async (req, res) => {

    const userID = req.params.userID;

    if(!await databaseConnection.deleteUser(userID)) {
        res.status(400).render('layouts/error', {
            err: "Bad Request",
            errNum: 400
        });
        return;
    }

    res.status(200).send('User Deleted');

});

//Delete entry
app.delete(`/people/:userID/delete`, async (req, res) => {


    const userID = req.params.userID;
    const postToDelete = req.body;

    if (!await databaseConnection.deleteEntry(userID, postToDelete)) {
        res.status(400).render('layouts/error', {
            err: "Deletion Failed",
            errNum: 400
        });
        return;

    }

    res.status(200).send('Entry Deleted');

});

app.put(`/people/:userID`, async (req, res) => {

    const userID = req.params.userID;
    const data = req.body;

    if (!await databaseConnection.updateEntry(userID, data)) {
        res.status(400).render('layouts/error', {
            err: "Update Failed",
            errNum: 400
        });
        return;
    }

    res.status(200).send('Entry Updated');
    

})

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
