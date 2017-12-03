module.exports = {
    isConnected,
    getUserInfo,
    getEntries,
    getEntry,
    addEntry,
    addUser,

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

function getCollectionAsArray(collection, options) {

    options = options || {}; //This line sets options to {} if options is undefined

    let dataCollection = mongoConnection.collection(collection);
    dataCollection.find(options).toArray((err, results) => {
        if(err) {
            return err;
        }

        return results;
    });
}

function getUserInfo(userID) {
    let dataCollection = mongoConnection.collection('final');
    let userInfo = dataCollection.findOne('final', {_id : userID});
    return userInfo;
}

function getEntry(userID, entryID){
    let dataCollection = mongoConnection.collection('final');
    let entryInfo = dataCollection.findOne('final', {_id : userID}, { entries : { $slice : [entryID, 1]}});
    return entryInfo;
}

function getEntries(userID, maxNumber){
    let dataCollection = mongoConnection.collection('final');
    let entries = dataCollection.findOne('final', {_id: userID});
    let limitedCollection = [];
    for (let i = 0; i < maxNumber && i < dataCollection.length; i++){
        limitedCollection.push(dataCollection.entries[i]);
    }
    return limitedCollection;
}

function updateUser(userID, data){
    let dataCollection = mongoConnection.collection('final');
    dataCollection.updateOne(
        { userID: userID },
        { $set: { userID: data } },
        function(err, result){
            return !err;
        }
    );
}

function updateEntry(entryID, data){
    let dataCollection = mongoConnection.collection('final');
    dataCollection.updateOne(
        { entryID: entryID },
        { $set: { entryID: data }},
        function(err, result){
            return !err;
        }
    );
}

function deleteUser(userID){
    let dataCollection = mongoConnection.collection('final');
    dataCollection.delete(
        { userID: userID },
        function(err, result){
            return !err;
        }
    );
}

function deleteEntry(entryID){
    let dataCollection = mongoConnection.collection('final');
    dataCollection.delete(
        { entryID: entryID },
        function(err, result){
            return !err;
        }
    );
}


function addUser(name, age){
    let dataCollection = mongoConnection.collection('final');
    dataCollection.insert(
        { name: name },
        { age: age },
        { entries: {} }
    );
    userName = dataCollection.findOne('final', {age: age});
    return userName._id;
}

function addEntry(userID, entryID, data){
    let entryObj = {
        time: 0,
        weight: data,
    };

    let dataCollection = mongoConnection.collection('final');
    dataCollection.updateOne(
        { userID: userID },
        { $push: { entries : entryObj }},
        function(err, result){
            return !err;
        }
    );
}
