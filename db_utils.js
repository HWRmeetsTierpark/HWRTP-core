const MongoClient = require('mongodb').MongoClient;

const mongoUrl = "mongodb://localhost:27017/hwrtp";
const userCollection = "user";

function getPicByUser(user, cb) {
    MongoClient.connect(mongoUrl, function (err, db) {
        if (err) throw err;
        db.collection(userCollection).find({"user": user}, {}).toArray(function (mongoError, dbResult) {
            if (mongoError) throw mongoError;
            db.close();
            cb(dbResult[0]);
        })
    })
}

module.exports = {getPicByUser};