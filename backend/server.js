import express from "express";
import dotenv from "dotenv";
import { connection as connectDB} from "./config/db.js";
import authRoutes from "./routes/auth.js";
import hotelRoutes from "./routes/hotel.js";
import bookingRoutes from "./routes/booking.js";
import adminRoutes from "./routes/admin.js";
import cors from "cors";

const app = express();
dotenv.config();
app.use(cors());

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

await connectDB();
app.get('/',(req,resp) => {
    resp.send("Server is working");
});

app.listen(2003,() => {
    console.log("Server is running on port 2003");
});