const WebSocketServer = require('ws').Server;
const db = require('./db_utils');
const util = require('./util');

var wss = new WebSocketServer({host:"localhost", port:"8080"}, function(){
    console.log("Server started");
});

wss.on('connection', function(ws) {
    console.log("client connected");
    ws.on('message', function(message) {
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
    db.getUser(json.user, function (result) {
        try{
            if(result.user != json.user){
                throw new Error("User not found: " + json.user);
            }
            if(json.entry){
                console.log("entry: true");
                if(result.remainingTime >= util.const.minEntryTime){
                    var date = new Date(0);
                    date.setUTCSeconds(json.time + 3600); //Fix for timezone error
                    db.setEntryTime(json.user, date);
                }else{
                    console.log("not enough time")
                }
            }else{
                console.log("entry: false");
                db.calculateRemainingTime(json.user);
            }
        }catch(err) {
            console.log(err);
        }
    });
}