import express from "express";
import { connection } from "../config/db.js";
import auth from "../middleware/auth.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// ➕ Add Review
router.post("/add", auth, async (req, res) => {
  try {
    const db = await connection();
    const { hotelId, rating, comment } = req.body;

    if (!hotelId || !rating) {
      return res.status(400).send("Missing fields");
    }

    await db.collection("reviews").insertOne({
      userId: req.user.userId,
      hotelId: new ObjectId(hotelId),
      rating,
      comment,
      createdAt: new Date()
    });

    res.send("Review added");
  } catch {
    res.status(500).send("Error");
  }
});

// 📥 Get Reviews by Hotel
router.get("/:hotelId", async (req, res) => {
  const db = await connection();

  const reviews = await db.collection("reviews")
    .find({ hotelId: new ObjectId(req.params.hotelId) })
    .toArray();

  res.send(reviews);
});

router.get("/average/:hotelId", async (req, res) => {
  try {
    const db = await connection();

    const result = await db.collection("reviews").aggregate([
      {
        $match: {
          hotelId: new ObjectId(req.params.hotelId)
        }
      },
      {
        $group: {
          _id: "$hotelId",
          avgRating: { $avg: "$rating" }
        }
      }
    ]).toArray();

    res.send({
      avgRating: result[0]?.avgRating || 0
    });

  } catch (err) {
    res.status(500).send("Error");
  }
});

export default router;