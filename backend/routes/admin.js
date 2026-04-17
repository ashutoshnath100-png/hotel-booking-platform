import express from 'express';
import { connection } from '../config/db.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get("/dashboard",auth,async(req,resp)=> {
    try {
        const db = await connection();
        if (req.user.role !== "admin") {
            return resp.status(403).send("Access denied. Admin privileges required.");
        }
        const totalBookings = await db.collection("bookings").countDocuments();
        const totalHotels = await db.collection("hotels").countDocuments();
        const bookings = await db.collection("bookings").find().toArray();

        const totalRevenue = bookings.reduce((sum, booking)=> sum + booking.totalPrice, 0);
        resp.send({
            totalBookings,
            totalHotels,
            totalRevenue
        })
    }
    catch(error) {
        console.error(error);
        resp.status(500).send("Internal server error");
    }
})

export default router;