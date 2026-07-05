import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import { getJwtSecret } from "@repo/backend-common/config";
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import argon2 from "argon2";
import { AuthenticatedRequest } from "./types";
import { parse } from "dotenv";

const app = express();
app.use(express.json());

app.post("/signup",async (req, res) => {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log(parsedData.error);
        res.json({
            message: "Incorrect signup inputs"
        });
        return;
    }
    try {
        const hashedPassword = await argon2.hash(parsedData.data.password, {
            type: argon2.argon2id
        });
        const user = await prismaClient.user.create({
            data: {
                email: parsedData.data.email,
                password: hashedPassword,
                name: parsedData.data.name
            }
        })
        return res.json({
            userId: user.id
        })
    } catch (err) {
        return res.status(409).json({
            message: err
        })
    }
})

app.post("/signin",async (req, res) => {
    const parsedData = SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            message: "Incorrect signin inputs"
        });
        return;
    }
    try {
        const user = await prismaClient.user.findFirst({
            where: {
                email: parsedData.data.email
            }
        });
        if (!user) {
            return res.status(403).json({
                message: "Invalid email, not authorized"
            });
        }
        const isPasswordCorrect = await argon2.verify(user.password, parsedData.data.password);
    
        if (!isPasswordCorrect) {
            return res.status(403).json({
                message: "Invalid password"
            });
        }
        
        const token = jwt.sign({
            userId: user.id
        }, getJwtSecret());
    
        return res.json({
            token
        });
    } catch (err) {
        return res.status(500).json({
            message: err
        })
    }
})

app.post("/create-room", middleware, async (req: AuthenticatedRequest, res) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            message: "Incorrect room inputs"
        });
        return;
    }
    try {
        const userId = req.userId;
        const room = await prismaClient.room.create({
            data: {
                slug: parsedData.data.roomName,
                adminId: userId as string
            }
        });
    
        return res.json({
            roomId: room.id
        });
    } catch (err) {
        return res.status(500).json({
            message: "room already exits with this name"
        })
    }
})

app.listen(3001, () => {console.log("http server running on port 3001")});