module.exports = {
    isConnected,
    getUserInfo,
    getEntries,
    getEntry,
    addEntry,
    addUser,

}

const Bluebird = require("bluebird");
const { MongoClient, ObjectId } = require("mongodb");
const client = Bluebird.promisifyAll(MongoClient);

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

async function getUserInfo(userID) {
    let dataCollection = await mongoConnection.collection('final');
    let userInfo = await dataCollection.findOne({_id : new ObjectId(userID)});
    return userInfo;
}

async function getEntry(userID, entryID){
    let dataCollection = await mongoConnection.collection('final');
    let entryInfo = await dataCollection.findOne({
        _id: new ObjectId(userID),
        entries : { $slice : [entryID, 1]}
    });
    return entryInfo;
}

async function getEntries(userID, maxNumber, offset){

    offset = offset || 0;

    let dataCollection = await mongoConnection.collection('final');
    let entries = await dataCollection.findOne({ _id: new ObjectId(userID)});
    let limitedCollection = [];
    for (let i = 0; i < maxNumber && i < dataCollection.length; i++){
        limitedCollection.push(dataCollection.entries[i]);
    }
    return limitedCollection;
}

async function updateUser(userID, data){
    let dataCollection = await mongoConnection.collection('final');
    let result = await dataCollection.updateOne(
        { userID: new ObjectId(userID) },
        { $set: { userID: data } }
    );

    return result != undefined;
}

async function updateEntry(entryID, data) {
    let dataCollection = await mongoConnection.collection('final');
    let result = await dataCollection.updateOne(
        { entryID: entryID },
        { $set: { entryID: data }}
    );

    return result != undefined;
}

async function deleteUser(userID){
    let dataCollection = await mongoConnection.collection('final');
    let result = await dataCollection.delete(
        { userID: new ObjectId(userID) }
    );

    return result != undefined;
}

async function deleteEntry(entryID){
    let dataCollection = await mongoConnection.collection('final');
    let result = await dataCollection.delete(
        { entryID: entryID }
    );

    return result != undefined;
}


async function addUser(name, age){
    let dataCollection = await mongoConnection.collection('final');
    let result = await dataCollection.insert(
        { name: name },
        { age: age },
        { entries: {} }
    );
    let user = await dataCollection.findOne('final', {age: age, name: name});
    return user ? user._id : undefined;
}

async function addEntry(userID, entryID, data){
    
    let entryObj = {
        time: 0,
        weight: data,
    };

    let dataCollection = await mongoConnection.collection('final');
    let result = await dataCollection.updateOne(
        { userID: new ObjectId(userID) },
        { $push: { entries : entryObj }}
    );

    return result != undefined;
}
