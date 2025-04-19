import mongoose from "mongoose";
import seedUsers from "../seed";

const connectDB = async () => {
  try {
    // Modern connection (remove deprecated options)
    console.log("Connecting to MongoDB at:", process.env.MONGO_URI);

    const mongoURI = process.env.MONGO_URI
    if (!mongoURI) {
      throw new Error("❌ MONGO_URI is not defined in environment variables");
    }
    const conn = await mongoose.connect(mongoURI, {
      dbName: "db", // 👈 Optional, explicit db name
    });

    console.log(`✅ MongoDB connected at: ${conn.connection.host}`);
    await seedUsers();
  } catch (error: any) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;