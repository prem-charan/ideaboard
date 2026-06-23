import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import { getJwtSecret } from "@repo/backend-common/config";
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from "@repo/common/types"

const app = express();
app.use(express.json());

app.post("/signup", (req, res) => {
    const data = CreateUserSchema.safeParse(req.body);
    if (!data.success) {
        res.json({
            message: "Incorrect signup inputs"
        });
        return;
    }
    //db call

    res.json({
        userId: 1
    })
})

app.post("/signin", (req, res) => {
    const data = SigninSchema.safeParse(req.body);
    if (!data.success) {
        res.json({
            message: "Incorrect signin inputs"
        });
        return;
    }
    
    const userId = 1;
    const token = jwt.sign({
        userId
    }, getJwtSecret());

    res.json({
        token
    })
    
})

app.post("/create-room", middleware, (req, res) => {
    const data = CreateRoomSchema.safeParse(req.body);
    if (!data.success) {
        res.json({
            message: "Incorrect room inputs"
        });
        return;
    }
    //db call

    res.json({
        roomId: 123
    })
})

app.listen(3001, () => {console.log("http server running on port 3001")});