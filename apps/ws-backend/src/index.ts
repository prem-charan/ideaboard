import "dotenv/config";
import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getJwtSecret } from "@repo/backend-common/config";

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function (ws, request) {
    const url = request.url;
    if (!url) {
        return;
    }
    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") ?? "";

    const decoded = jwt.verify(token, getJwtSecret());
    if (!decoded || !(decoded as JwtPayload).userId) {
        ws.close();
        return;
    }
    
    ws.on("message", function message(data) {
        ws.send("pong");
    });
});
console.log("ws server running on port 8080");