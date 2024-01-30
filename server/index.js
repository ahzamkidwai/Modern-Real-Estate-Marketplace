import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user-route.js";
import authRouter from "./routes/auth-route.js";
import listingRouter from "./routes/listing-route.js"
import errorMiddleware from "./middlewares/error-Middleware.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser())

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter)

/*
Error Middleware

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

*/

app.use(errorMiddleware);

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CLOUD_DATABASE_URL);
    console.log("Database Connection is Successful.");
  } catch (err) {
    console.log("Database Connection Failed.");
    console.error(err);
    process.exit(1);
  }
};

app.listen(process.env.PORT, () => {
  console.log(`Server is running at Port ${process.env.PORT}`);
  dbConnect();
});
