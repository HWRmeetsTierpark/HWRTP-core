const db = require('./db_utils');

const testUser = 77220630636;

db.getPic(testUser, function (result) {
    console.log(`pic - ${result}`);
});

// db.setEntryTime(testUser);

// db.addRemainingTime(testUser, 10);

// db.calculateRemainingTime(testUser);

db.getRemainingTime(testUser, function (result) {
    console.log(`remainingTime - ${result}`);
});

db.addUser(123456789, function (err) {
    if (err) {
        console.log(err);
    }
});