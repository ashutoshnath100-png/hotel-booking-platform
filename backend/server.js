import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import hotelRoutes from "./routes/hotel.js";
import bookingRoutes from "./routes/booking.js";
import adminRoutes from "./routes/admin.js";
import cors from "cors";
import reviewRoutes from "./routes/review.js";

const app = express();
dotenv.config();
app.use(cors());

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reviews", reviewRoutes);

connectDB();
app.get('/',(req,resp) => {
    resp.send("Server is working");
});

app.listen(process.env.PORT,() => {
    console.log(`Server is running on port ${process.env.PORT}`);
});