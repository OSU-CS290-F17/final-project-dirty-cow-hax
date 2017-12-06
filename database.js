module.exports = {
    isConnected,
    getUsers,
    getUser,
    getEntries,
    getEntry,
    updateUser,
    updateEntry,
    addEntry,
    addUser,
    deleteEntry,
    deleteUser
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

async function getCollectionAsArray(collection, options) {

    options = options || {}; //This line sets options to {} if options is undefined

    let dataCollection = mongoConnection.collection(collection);
    return await dataCollection.find(options).toArray();
}

async function getUsers() {
    let dataCollection = await mongoConnection.collection('final');
    let users = await getCollectionAsArray('final');

    return users;
}
async function getUser(userID) {
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
    let person = await dataCollection.findOne(
        { _id: new ObjectId(userID)},
        { entries: { $slice: [offset, maxNumber] }}
    );

    return person.entries;
}

async function updateUser(userID, data){
    let dataCollection = await mongoConnection.collection('final');
    let result = await dataCollection.updateOne(
        { userID: new ObjectId(userID) },
        { $set: { userID: data } }
    );

    return result != undefined;
}

async function updateEntry(userID, data) {
    let result = await deleteEntry(userID, {time: data.oldTime});
    result += await addEntry(userID, {time: data.time, weight: data.weight});
    return result != undefined;
}

async function deleteUser(userID){
    let dataCollection = await mongoConnection.collection('final');
    let result = await dataCollection.delete(
        { _id: new ObjectId(userID) }
    );

    return result != undefined;
}

async function deleteEntry(userID, data) {

    let dataCollection = await mongoConnection.collection('final');
    let result = await dataCollection.update(
        { _id: new ObjectId(userID) },
        {
            $pull: {
                entries: {
                    time: data.time
                }
            }
        },
        {multi: true}
    );

    return result != undefined;
}


async function addUser(name, age) {
    let dataCollection = await mongoConnection.collection('final');
    let result = await dataCollection.insert(
        { name: name,
          age: age,
          entries: [] }
    );
    let user = await dataCollection.findOne({age: age, name: name});
    return user ? user._id.toHexString() : undefined;
}

async function addEntry(userID, data) {
   
    let dataCollection = await mongoConnection.collection('final');
    let result = await dataCollection.updateOne(
        { _id: new ObjectId(userID) },
        { $push: { entries : data }}
    );

    return result != undefined;
}
