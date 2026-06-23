import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";
import { middleware } from "./middleware";

const app = express();
app.use(express.json());

app.post("/signup", (req, res) => {
    //db call

    res.json({
        userId: 1
    })
})

app.post("/signin", (req, res) => {

    
    const userId = 1;
    const token = jwt.sign({
        userId
    }, JWT_SECRET); // get the JWT_SECRET from an .env file, not the config.ts file...fix this!!!!

    res.json({
        token
    })
    
})

app.post("/create-room", middleware, (req, res) => {
    //db call

    res.json({
        roomId: 123
    })
})

app.listen(3001, () => {console.log("http server running on port 3001")});