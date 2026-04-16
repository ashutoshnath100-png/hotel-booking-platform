import express from "express";
import dotenv from "dotenv";
import { connection } from "../config/db.js";
const router = express.Router();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

router.post("/register",async(req,resp)=> {
    try {
        const db = await connection();
        const {name,email,password} = req.body;

        const existingUser = await db.collection("users").findOne({email});
        if (existingUser) {
            return resp.status(400).send("User already exists")
        }

        const hashedPassword = await bcrypt.hash(password,10);

        await db.collection("users").insertOne({
            name,
            email,
            password: hashedPassword,
            role: "user"
        });

        resp.send("User Registered Successfully");

    } catch (error) {
        console.error("Error occurred while registering user:", error);
        resp.status(500).send("Internal server error");
    }
})

router.post("/login",async(req,resp)=> {
    try {
        const db = await connection();
        const {email,password} = req.body;

        const user = await db.collection("users").findOne({email});
        if (!user) {
            return resp.status(400).send("Invalid email or password");
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if (!isMatch) {
            return resp.status(400).send("Invalid email or password");
        }
        const token = jwt.sign({userId: user._id, role: user.role},process.env.SECRET_KEY,{expiresIn: "1d"});
        resp.send({token});

    }
        catch (error) {
        console.error("Error occurred while logging in user:", error);
        resp.status(500).send("Internal server error");
        }
})

export default router;