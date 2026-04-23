import express from "express";
import auth from "../middleware/auth.js";
import Hotel from "../models/Hotel.js";
import Booking from "../models/Booking.js";

const router = express.Router();


// 🔥 BOOK HOTEL
router.post("/book", auth, async (req, res) => {
  try {
    const {
      hotelId,
      checkIn,
      checkOut,
      name,
      members,
      aadhaar,
    } = req.body;

    if (!hotelId || !checkIn || !checkOut) {
      return res.status(400).send("Missing fields");
    }

    // Find hotel
    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      return res.status(404).send("Hotel not found");
    }

    // 🔥 CHECK DUPLICATE BOOKING
    const existingBooking = await Booking.findOne({
      hotelId,
      $or: [
        {
          checkIn: { $lte: new Date(checkOut) },
          checkOut: { $gte: new Date(checkIn) },
        },
      ],
    });

    if (existingBooking) {
      return res.status(400).send("Already booked for selected dates");
    }

    // Calculate days
    const days =
      (new Date(checkOut) - new Date(checkIn)) /
      (1000 * 60 * 60 * 24);

    const totalPrice = days * hotel.price;

    // Save booking
    const newBooking = new Booking({
      userId: req.user.userId,
      hotelId,
      name,
      members,
      aadhaar,
      checkIn,
      checkOut,
      totalPrice,
    });

    await newBooking.save();

    res.send("Booking successful");

  } catch (error) {
    console.error("BOOKING ERROR:", error);
    res.status(500).send("Server error");
  }
});


// 🔥 ADMIN GET BOOKINGS
router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send("Access denied");
    }

    const bookings = await Booking.find()
      .populate("hotelId")
      .populate("userId");

    res.send(bookings);

  } catch (err) {
    console.error("GET BOOKINGS ERROR:", err);
    res.status(500).send("Error");
  }
});


// 🔥 CHECK BOOKINGS (FOR FRONTEND)
router.get("/check/:hotelId", async (req, res) => {
  try {
    const bookings = await Booking.find({
      hotelId: req.params.hotelId,
    });

    res.send(bookings);

  } catch (err) {
    console.error("CHECK BOOKINGS ERROR:", err);
    res.status(500).send("Error");
  }
});

export default router;