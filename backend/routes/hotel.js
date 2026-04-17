import express from "express";
import { connection } from "../config/db.js";
import auth from "../middleware/auth.js";
const router = express.Router();

router.post("/add", auth, async (req, resp) => {
    try {
        const db = await connection();
        if (req.user.role !== "admin") {
            return resp.status(403).send("Access denied. Only admins can add hotels.");
        }
        const { name, price, location, rating } = req.body;

        // ✅ ADD VALIDATION HERE
        if (!name || !price) {
            return resp.status(400).send("Missing required fields");
        }
        await db.collection("hotels").insertOne({
            name,
            price,
            location,
            rating
        });
        resp.send("Hotel added successfully");
    }
    catch (error) {
        resp.status(500).send("Internal server error");
    }
})

router.get("/", async (req, resp) => {
    try {
        const db = await connection();
        const hotels = await db.collection("hotels").find().toArray();
        resp.send(hotels);
    }
    catch (error) {
        resp.status(500).send("Internal server error");
    }
})

router.get("/search", async (req, resp) => {
    try {
        const db = await connection();
        const { location } = req.query;

        const hotels = await db.collection("hotels").find({ location }).toArray();
        resp.send(hotels);
    }
    catch (error) {
        resp.status(500).send("Internal server error");
    }
})

router.delete("/:id", auth, async (req, res) => {
    try {
        const db = await connection();

        if (req.user.role !== "admin") {
            return res.status(403).send("Access denied");
        }

        await db.collection("hotels").deleteOne({
            _id: new ObjectId(req.params.id)
        });

        res.send("Hotel deleted successfully");

    } catch (err) {
        res.status(500).send("Error");
    }
});

router.put("/:id", auth, async (req, res) => {
    try {
        const db = await connection();

        if (req.user.role !== "admin") {
            return res.status(403).send("Access denied");
        }

        await db.collection("hotels").updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        );

        res.send("Hotel updated successfully");

    } catch (err) {
        res.status(500).send("Error");
    }
});

router.get("/:id", async (req, res) => {
    const db = await connection();

    const hotel = await db.collection("hotels").findOne({
        _id: new ObjectId(req.params.id)
    });

    res.send(hotel);
});

export default router;