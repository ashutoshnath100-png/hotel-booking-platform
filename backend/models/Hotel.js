import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    location: String,
    rating: {
      type: Number,
      default: 4,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Hotel", hotelSchema);