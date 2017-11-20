const MongoClient = require('mongodb').MongoClient;
const util = require('./util');

const mongoUrl = 'mongodb://localhost:27017/hwrtp';
const userCollection = 'user';

const moment = require('moment');

var db_utils = {};

function getAttribute (db, user, attribute, cb) {
    const attributeQuery = {_id: 0};
    attributeQuery[attribute] = 1;
    db.collection(userCollection).find({user: user}, attributeQuery).toArray(function (mongoError, dbResult) {
        if (mongoError) throw mongoError;
        db.close();
        util.call(cb, dbResult[0][attribute]);
    })
}

db_utils.getPic = function(user, cb) {
    MongoClient.connect(mongoUrl, function (err, db) {
        if (err) throw err;
        getAttribute(db, user, 'pic', function (result) {
            util.call(cb, result);
        });
    })
};

db_utils.setEntryTime = function(user, time = new Date()) {
    MongoClient.connect(mongoUrl, function (err, db) {
        if (err) throw err;
        db.collection(userCollection).updateOne({user: user}, {
            $set: {entryTime: time}
        });
        db.close();
    })
};

db_utils.addRemainingTime = function(user, minutes) {
    MongoClient.connect(mongoUrl, function (err, db) {
        if (err) throw err;
        db.collection(userCollection).updateOne({user: user}, {
            $inc: {remainingTime: +minutes}
        });
        db.close();
    })
};

db_utils.substractRemainingTime = function(user, minutes) {
    MongoClient.connect(mongoUrl, function (err, db) {
        if (err) throw err;
        db.collection(userCollection).updateOne({user: user}, {
            $inc: {remainingTime: -minutes}
        });
        db.close();
    })
};

db_utils.calculateRemainingTime = function(user){
    MongoClient.connect(mongoUrl, function (err, db) {
        if (err) throw err;
        getAttribute(db, 'entryTime', function (dbResult) {
            substractRemainingTime(user, moment(new Date()).diff(dbResult[0].entryTime, 'minutes'))
        })
    })
};

db_utils.getRemainingTime = function(user, cb){
    MongoClient.connect(mongoUrl, function (err, db) {
        if (err) throw err;
        getAttribute(db, user, 'remainingTime', function (result) {
            util.call(cb,result);
        });
    })
};

db_utils.addUser = function(id, cb){
    MongoClient.connect(mongoUrl, function (err, db) {
        if (err) throw err;
        db.collection(userCollection).insertOne({'user': id}, function (err) {
            if (err) console.log(err);
            util.call(cb, err);
        })
    })
};

module.exports = db_utils;