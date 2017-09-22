const WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({host:"127.0.0.1", port:"8080"});
const db = require('./db_utils');

wss.on('connection', function(ws) {
    ws.on('message', function(message) {
        console.log(message);
    });
});

db.getPicByUser(77220630636, function (result) {
    console.log(result);
});