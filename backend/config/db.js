// import { MongoClient } from "mongodb";
// import dotenv from "dotenv";

// dotenv.config();

// const url = process.env.MONGO_URI || "mongodb://localhost:27017";
// const client = new MongoClient(url);
// let dbName = "hotel_booking";
// export const collectionName = "booking";

// export const connection = async() => {
//     const connect = await client.connect();
//     return await connect.db(dbName);
// }

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Atlas Connected:", conn.connection.host);
  } catch (error) {
    console.error("DB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;