import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: String,
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);