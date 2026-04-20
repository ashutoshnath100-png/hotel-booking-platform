import express from "express";
import { connection } from "../config/db.js";
import auth from "../middleware/auth.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// 🔥 BOOK HOTEL
router.post("/book", auth, async (req, resp) => {
  try {
    const db = await connection();

    const {
      hotelId,
      checkIn,
      checkOut,
      name,
      members,
      aadhaar
    } = req.body;

    if (!hotelId || !checkIn || !checkOut) {
      return resp.status(400).send("Missing fields");
    }

    const hotel = await db.collection("hotels").findOne({
      _id: new ObjectId(hotelId)
    });

    if (!hotel) {
      return resp.status(404).send("Hotel not found");
    }

    // 🔥 CHECK DUPLICATE
    const existingBooking = await db.collection("bookings").findOne({
      hotelId: new ObjectId(hotelId),
      $or: [
        {
          checkIn: { $lte: new Date(checkOut) },
          checkOut: { $gte: new Date(checkIn) }
        }
      ]
    });

    if (existingBooking) {
      return resp.status(400).send("Already booked");
    }

    const days =
      (new Date(checkOut) - new Date(checkIn)) /
      (1000 * 60 * 60 * 24);

    const totalPrice = days * hotel.price;

    await db.collection("bookings").insertOne({
      userId: req.user.userId,
      hotelId: new ObjectId(hotelId),
      name,
      members,
      aadhaar,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      totalPrice
    });

    resp.send("Booking successful");

  } catch (error) {
    console.log(error);
    resp.status(500).send("Server error");
  }
});

// 🔥 ADMIN GET BOOKINGS
router.get("/", auth, async (req, res) => {
  try {
    const db = await connection();

    if (req.user.role !== "admin") {
      return res.status(403).send("Access denied");
    }

    const bookings = await db.collection("bookings").find().toArray();

    res.send(bookings);
  } catch (err) {
    res.status(500).send("Error");
  }
});

// 🔥 CHECK BOOKINGS (IMPORTANT)
router.get("/check/:hotelId", async (req, res) => {
  const db = await connection();

  const bookings = await db.collection("bookings").find({
    hotelId: new ObjectId(req.params.hotelId)
  }).toArray();

  res.send(bookings);
});

export default router;