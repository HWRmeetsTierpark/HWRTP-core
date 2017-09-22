var WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({host:"127.0.0.1", port:"8080"});

wss.on('connection', function(ws) {
    ws.on('message', function(message) {
        console.log(message);
    });
});