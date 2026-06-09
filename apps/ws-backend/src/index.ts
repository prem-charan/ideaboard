import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
    // ws.on('error', console.error);

    ws.on('message', (data) => {
        ws.send("pong");
    })
});
console.log("ws server running on port 8080");