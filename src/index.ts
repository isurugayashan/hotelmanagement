import "dotenv/config"
import express from  "express";
import hotelsRouter from "./api/hotel";
import connectDB from "./infrastructure/db";
import bookingsRouter from "./api/booking";
import cors from "cors";
import globalErrorHandlingMiddleware from "./api/middlewares/global-error-handling-middleware";
import { clerkMiddleware } from "@clerk/express";
import { handleWebhook } from "./application/payment";
import bodyParser from "body-parser";
import paymentsRouter from "./api/payment";

const app = express();
app.use(clerkMiddleware());
// Middleware to parse JSON data in the request body

app.use(cors({ origin: process.env.FRONTEND_URL }));

app.post(
  "/api/stripe/webhook",
  bodyParser.raw({ type: "application/json" }),
  handleWebhook
);

app.use(express.json());

connectDB() 

app.use("/api/hotels", hotelsRouter)
app.use("/api/bookings", bookingsRouter)
app.use("/api/payments", paymentsRouter)

// Apply error handling middleware LAST
app.use(globalErrorHandlingMiddleware)

// Define the port to run the server
const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
