module.exports = {
    isConnected,
    getCollectionAsArray
}

const { MongoClient } = require("mongodb");
const client = MongoClient;

const mongoHost     = process.env.MONGODB_HOST;
const mongoPort     = process.env.MONGODB_PORT || 27017;
const mongoUser     = process.env.MONGODB_USER;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoDBName   = process.env.MONGO_DB;

const mongoUrl = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDBName}`;
let mongoConnection = undefined;

client.connect(mongoUrl, (err, connection) => {
    if (err) {
        throw err;
    }

    mongoConnection = connection;
});

function isConnected () {
    return mongoConnection != undefined;
} 

async function getCollectionAsArray(collection, options) {

    options = options || {}; //This line sets options to {} if options is undefined

    let dataCollection = mongoConnection.collection(collection);
    await dataCollection.find(options).toArray((err, results) => {
        if(err) {
            return err;
        }

        return results;
    });
}

function getUserInfo(userID) {
    let dataCollection = getCollectionAsArray(collection, userID);
    return dataCollection;
}
function getEntry(entryID){
    let dataCollection = getCollectionAsArray(collection, entryID);
    return dataCollection;
}
async function getEntries(userID, maxNumber){
    let dataCollection = getCollectionAsArray(collection, userID);
    let limitedCollection= [];
    for (let i = 0; i < maxNumber || dataCollection[i] == undefined; i++){
        limitedCollection[i] = dataCollection[i];
    }
    return limitedCollection;
}
function updateUser(userID, data){
    let dataCollection = getCollectionAsArray(collection, userID);
    return dataCollection;
}
function updateEntry(entryID, data){
    let dataCollection = getCollectionAsArray(collection, entryID);
    return dataCollection;
}
function deleteUser(userID){
    let dataCollection = getCollectionAsArray(collection, userID);
    return dataCollection;
}
function deleteEntry(entryID){
    let dataCollection = getCollectionAsArray(collection, userID);
    return dataCollection;
}
