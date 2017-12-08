const MongoClient = require('mongodb').MongoClient;
const util = require('./util');

const mongoUrl = 'mongodb://localhost:27017/hwrtp';
const userCollection = 'user';

const moment = require('moment');

var db_utils = {};

/**
 * returns the attributes value of a user
 * @param db
 * @param user
 * @param attribute
 * @param cb callback-function
 */
function getAttribute (db, user, attribute, cb) {
    const attributeQuery = {_id: 0};
    attributeQuery[attribute] = 1;
    db.collection(userCollection).find({user: user}, attributeQuery).toArray(function (mongoError, dbResult) {
        if (mongoError) throw mongoError;
        db.close();
        util.call(cb, dbResult[0][attribute]);
    })
}

/**
 * returns the base64-coded picture of a user (not yet decided if a face or a fingerprint)
 * @param user
 * @param cb callback-function
 */
db_utils.getPic = function(user, cb) {
    MongoClient.connect(mongoUrl, function (err, db) {
        if (err) throw err;
        getAttribute(db, user, 'pic', function (result) {
            util.call(cb, result);
        });
    })
};

/**
 * sets the entry-time of a user
 * @param user
 * @param time default now (system-time)
 */
db_utils.setEntryTime = function(user, time = new Date()) {
    MongoClient.connect(mongoUrl, function (err, db) {
        if (err) throw err;
        db.collection(userCollection).updateOne({user: user}, {
            $set: {entryTime: time}
        });
        db.close();
    })
};

/**
 * adds remaining time to a user
 * @param user
 * @param minutes
 */
db_utils.addRemainingTime = function(user, minutes) {
    MongoClient.connect(mongoUrl, function (err, db) {
        if (err) throw err;
        db.collection(userCollection).updateOne({user: user}, {
            $inc: {remainingTime: +minutes}
        });
        db.close();
    })
};

/**
 * subtract remaining time of a user
 * @param user
 * @param minutes
 */
function subtractRemainingTime(user, minutes) {
    MongoClient.connect(mongoUrl, function (err, db) {
        if (err) throw err;
        db.collection(userCollection).updateOne({user: user}, {
            $inc: {remainingTime: minutes * -1}
        });
        db.close();
    })
}
/**
 * calculate remaining time after a user left
 * @param user
 */
db_utils.calculateRemainingTime = function(user){
    MongoClient.connect(mongoUrl, function (err, db) {
        if (err) throw err;
        getAttribute(db, user, 'entryTime', function (dbResult) {
            var entryDate = dbResult;
            entryDate.setHours(entryDate.getHours() - 1);
            console.log("User has spent " + moment(new Date()).diff(dbResult, 'minutes') + " minutes at Tierpark Berlin");
            subtractRemainingTime(user, moment(new Date()).diff(dbResult, 'minutes'))
        });
    });
};

/**
 * return remaining time
 * @param user
 * @param cb callback-function
 */
db_utils.getRemainingTime = function(user, cb){
    MongoClient.connect(mongoUrl, function (err, db) {
        if (err) throw err;
        getAttribute(db, user, 'remainingTime', function (result) {
            util.call(cb,result);
        });
    })
};

/**
 * inserts a user by id
 * @param id
 * @param cb callback-function
 */
db_utils.addUser = function(id, cb){
    MongoClient.connect(mongoUrl, function (err, db) {
        if (err) throw err;
        db.collection(userCollection).insertOne({'user': id, 'remainingTime' : 0}, function (err) {
            if (err) console.log(err);
            util.call(cb, err);
        })
    })
};

db_utils.getUser = function (id, cb) {
    MongoClient.connect(mongoUrl, function (err, db) {
        if (err) throw err;
        return db.collection(userCollection).find({'user': id}).toArray(function (mongoError, dbResult) {
            if (mongoError) throw mongoError;
            db.close();
            util.call(cb, dbResult[0]);
        });
    });
};

module.exports = db_utils;