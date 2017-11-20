const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({host:"127.0.0.1", port:"8080"}, function () {
    console.log("SocketServer started");
});

wss.on('connection', function(ws) {
    console.log("client connected");
    ws.on('message', function(message) {
        console.log("message received: " + message);
    });
});