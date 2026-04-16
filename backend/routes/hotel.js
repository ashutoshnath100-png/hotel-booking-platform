import express from "express";
import { connection } from "../config/db.js";
import auth from "../middleware/auth.js";
const router = express.Router();

router.post("/add",auth,async(req,resp)=> {
    try {
        const db = await connection();
        if (req.user.role !== "admin") {
            return resp.status(403).send("Access denied. Only admins can add hotels.");
        }
        const hotelData = req.body;
        await db.collection("hotels").insertOne(hotelData);
        resp.send("Hotel added successfully");
    }
    catch (error) {
        resp.status(500).send("Internal server error");
    }
})

router.get("/",async(req,resp)=> {
    try {
        const db = await connection();
        const hotels = await db.collection("hotels").find().toArray();
        resp.send(hotels);
    }
    catch (error) {
        resp.status(500).send("Internal server error");
    }
})

router.get("/search",async(req,resp)=> {
    try {
        const db = await connection();
        const { location} = req.query;

        const hotels = await db.collection("hotels").find({location}).toArray();
        resp.send(hotels);
    }
    catch (error) {
        resp.status(500).send("Internal server error"); 
    }
})

export default router;