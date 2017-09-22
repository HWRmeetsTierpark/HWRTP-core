const MongoClient = require('mongodb').MongoClient;

const mongoUrl = 'mongodb://localhost:27017/hwrtp';
const userCollection = 'user';

const moment = require('moment');

function getAttribute(db, user, attribute, cb) {
    const attributeQuery = {_id: 0};
    attributeQuery[attribute] = 1;
    db.collection(userCollection).find({user: user}, attributeQuery).toArray(function (mongoError, dbResult) {
        if (mongoError) throw mongoError;
        db.close();
        cb(dbResult[0][attribute]);
    })
}

function getPic(user, cb) {
    MongoClient.connect(mongoUrl, function (err, db) {
        if (err) throw err;
        getAttribute(db, user, "pic", function (result) {
            cb(result)
        });
    })
}

function setEntryTime(user, time = new Date()) {
    MongoClient.connect(mongoUrl, function (err, db) {
        if (err) throw err;
        db.collection(userCollection).updateOne({user: user}, {
            $set: {entryTime: time}
        });
        db.close();
    })
}

function addRemainingTime(user, minutes) {
    MongoClient.connect(mongoUrl, function (err, db) {
        if (err) throw err;
        db.collection(userCollection).updateOne({user: user}, {
            $inc: {remainingTime: +minutes}
        });
        db.close();
    })
}

function substractRemainingTime(user, minutes) {
    MongoClient.connect(mongoUrl, function (err, db) {
        if (err) throw err;
        db.collection(userCollection).updateOne({user: user}, {
            $inc: {remainingTime: -minutes}
        });
        db.close();
    })
}

function calculateRemainingTime(user) {
    MongoClient.connect(mongoUrl, function (err, db) {
        if (err) throw err;
        db.collection(userCollection).find({user: user}, {_id: 0, entryTime: 1}).toArray(function (err, dbResult) {
            if (err) throw err;
            db.close();
            substractRemainingTime(user, moment(new Date()).diff(dbResult[0].entryTime, 'minutes'))
        })
    })
}

function getRemainingTime(user, cb) {
    MongoClient.connect(mongoUrl, function (err, db) {
        if (err) throw err;
        getAttribute(db, user, "remainingTime", function (result) {
            cb(result)
        });
    })
}

module.exports = {getPic, setEntryTime, addRemainingTime, calculateRemainingTime, getRemainingTime};