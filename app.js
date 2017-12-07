const WebSocketServer = require('ws').Server;
const db = require('./db_utils');
const util = require('./util');

var wss = new WebSocketServer({host:"127.0.0.1", port:"8080"}, function(){
    console.log("Server started");
});

wss.on('connection', function(ws) {
    console.log("client connected")
    ws.on('message', function(message) {
        console.log("message received %s", message);
        try{
            handleMessage(JSON.parse(message));
        }catch(err){
            ws.send("error while parsing message");
        }
    });
});

function handleMessage(json){
    var db_user = db.getUser(json.user);
    console.log(db_user);
}