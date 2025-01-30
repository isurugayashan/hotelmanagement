import "dotenv/config"
import express from  "express";
import hotelsRouter from "./api/hotel.js";
import connectDB from "./infrastructure/db.js";
import usersRouter from "./api/user.js";
import bookingsRouter from "./api/booking.js";

const app = express();

//Midleware  replce the body parser
app.use(express.json());

connectDB();


app.use("/api/hotels",hotelsRouter)
app.use("/api/users", usersRouter)
app.use("/api/bookings", bookingsRouter)
app.listen(8000,console.log("server is running on 8000")
)
