import express from "express";
import auth from "../middleware/auth.js";
import Review from "../models/Review.js";
import mongoose from "mongoose";

const router = express.Router();


// ➕ ADD REVIEW
router.post("/add", auth, async (req, res) => {
  try {
    const { hotelId, rating, comment } = req.body;

    if (!hotelId || !rating) {
      return res.status(400).send("Missing fields");
    }

    const newReview = new Review({
      userId: req.user.userId,
      hotelId,
      rating,
      comment,
    });

    await newReview.save();

    res.send("Review added");

  } catch (err) {
    console.error("ADD REVIEW ERROR:", err);
    res.status(500).send("Error");
  }
});


// 📥 GET REVIEWS BY HOTEL
router.get("/:hotelId", async (req, res) => {
  try {
    const reviews = await Review.find({
      hotelId: req.params.hotelId,
    }).populate("userId", "name");

    res.send(reviews);

  } catch (err) {
    console.error("GET REVIEWS ERROR:", err);
    res.status(500).send("Error");
  }
});


// ⭐ GET AVERAGE RATING
router.get("/average/:hotelId", async (req, res) => {
  try {
    const result = await Review.aggregate([
      {
        $match: {
          hotelId: new mongoose.Types.ObjectId(req.params.hotelId),
        },
      },
      {
        $group: {
          _id: "$hotelId",
          avgRating: { $avg: "$rating" },
        },
      },
    ]);

    res.send({
      avgRating: result[0]?.avgRating || 0,
    });

  } catch (err) {
    console.error("AVG RATING ERROR:", err);
    res.status(500).send("Error");
  }
});

export default router;