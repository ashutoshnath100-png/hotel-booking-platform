import express from "express";
import auth from "../middleware/auth.js";
import Hotel from "../models/Hotel.js";
import mongoose from "mongoose";

const router = express.Router();


// ✅ ADD HOTEL
router.post("/add", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send("Access denied. Only admins can add hotels.");
    }

    const { name, price, location, rating } = req.body;

    if (!name || !price) {
      return res.status(400).send("Missing required fields");
    }

    const newHotel = new Hotel({
      name,
      price,
      location,
      rating,
    });

    await newHotel.save();

    res.send("Hotel added successfully");

  } catch (error) {
    console.error("ADD HOTEL ERROR:", error);
    res.status(500).send("Internal server error");
  }
});


// ✅ GET ALL HOTELS
router.get("/", async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.send(hotels);
  } catch (error) {
    console.error("GET HOTELS ERROR:", error);
    res.status(500).send("Internal server error");
  }
});


// ✅ SEARCH HOTELS (FILTER)
router.get("/search", async (req, res) => {
  try {
    const { location, minPrice, maxPrice, rating } = req.query;

    let query = {};

    // Location filter
    if (location && location.trim() !== "") {
      query.location = { $regex: location, $options: "i" };
    }

    // Price filter
    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice && !isNaN(minPrice)) {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice && !isNaN(maxPrice)) {
        query.price.$lte = Number(maxPrice);
      }
    }

    // Rating filter
    if (rating && !isNaN(rating)) {
      query.rating = { $gte: Number(rating) };
    }

    const hotels = await Hotel.find(query);

    res.send(hotels);

  } catch (error) {
    console.error("SEARCH ERROR:", error);
    res.status(500).send("Internal server error");
  }
});


// ✅ DELETE HOTEL
router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send("Access denied");
    }

    await Hotel.findByIdAndDelete(req.params.id);

    res.send("Hotel deleted successfully");

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).send("Error");
  }
});


// ✅ UPDATE HOTEL
router.put("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send("Access denied");
    }

    await Hotel.findByIdAndUpdate(req.params.id, req.body);

    res.send("Hotel updated successfully");

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).send("Error");
  }
});


// ✅ GET SINGLE HOTEL
router.get("/:id", async (req, res) => {
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ FIX: validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid hotel ID");
    }

    const hotel = await Hotel.findById(id);

    if (!hotel) {
      return res.status(404).send("Hotel not found");
    }

    res.send(hotel);

  } catch (err) {
    console.error("GET ONE ERROR:", err);
    res.status(500).send("Error");
  }
});
});

export default router;