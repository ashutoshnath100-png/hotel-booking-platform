import express from 'express';
import { connection } from '../config/db.js';
import auth from '../middleware/auth.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

router.post("/book",auth,async(req,resp)=> {
    try {
        const db = await connection();
        const {hotelId, checkIn, checkOut} = req.body;
        const hotel = await db.collection("hotels").findOne({
            _id: new ObjectId(hotelId)
        });
        if (!hotel) {
            return resp.status(404).send("Hotel not found");
        }

        const existingBooking = await db.collection("bookings").findOne({
            hotelId: new ObjectId(hotelId),
            $or: [
                {
                    checkIn: {$lte: checkOut},
                    checkOut: {$gte: checkIn}
                }
            ]
        });
        if (existingBooking) {
            return resp.status(400).send("Booking already exists for the selected dates");
        }

        const days = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
        const totalPrice = days * hotel.price;

        await db.collection("bookings").insertOne({
            userId: req.user._id,
            hotelId,
            checkIn,
            checkOut,
            totalPrice
        });
        resp.send("Booking successful");
    }
    catch(error) {
        console.error(error);
            resp.status(500).send("Internal server error");
    }
})

export default router;