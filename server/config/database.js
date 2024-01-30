import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CLOUD_DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database Connection is Successful.");
  } catch (err) {
    console.log("Database Connection Failed.");
    console.error(err);
    process.exit(1);
  }
};
