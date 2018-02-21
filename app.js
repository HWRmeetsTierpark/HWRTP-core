const WebSocketServer = require('ws').Server;
const db = require('./db_utils');
const util = require('./util');

// create WebSocketServer running on localhost on port 9000
var wss = new WebSocketServer({host: "localhost", port: "9000"}, function () {
    console.log("Server started");
});


wss.on('connection', function(ws) {
    // client connected
    console.log("client connected");
    ws.on('message', function(message) {
        // server received message
        console.log("message received %s", message);
        try{
            handleMessage(JSON.parse(message));
        }catch(err){
            console.log("error while parsing json");
        }
    });
});

function handleMessage(json){
    console.log(json.user);
    // getting user from database
    db.getUser(json.user, function (result) {
        try{
            if(result.user != json.user){
                // user not found
                throw new Error("User not found: " + json.user);
            }
            if(json.entry){
                // user wants to check in
                console.log("entry: true");
                if(result.remainingTime >= util.const.minEntryTime){ // do user have enough time?
                    var date = new Date(0);
                    date.setUTCSeconds(json.time + 3600); //Fix for timezone error
                    db.setEntryTime(json.user, date);
                }else{
                    console.log("not enough time")
                }
            }else{
                // user wants to check out
                console.log("entry: false");
                db.calculateRemainingTime(json.user);
            }
        }catch(err) {
            console.log(err);
        }
    });
}