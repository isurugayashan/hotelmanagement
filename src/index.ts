import "dotenv/config"
import express from  "express";
import hotelsRouter from "./api/hotel";
import connectDB from "./infrastructure/db";
import bookingsRouter from "./api/booking";
import cors from "cors";
import globalErrorHandlingMiddleware from "./api/middlewares/global-error-handling-middleware";
import { clerkMiddleware } from "@clerk/express";


const app = express();

app.use(clerkMiddleware());

//Midleware  replce the body parser
app.use(express.json());
app.use(cors())

connectDB();

//predefine
// app.use((req, res, next) =>{
//     console.log("Hello World");
//     next();
// })

app.use("/api/hotels",hotelsRouter)
app.use("/api/bookings", bookingsRouter)

app.use(globalErrorHandlingMiddleware)
app.listen(8000,() => console.log("server is running on 8000")
)
