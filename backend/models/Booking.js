import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
    },
    name: String,
    members: Number,
    aadhaar: String,
    checkIn: Date,
    checkOut: Date,
    totalPrice: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);