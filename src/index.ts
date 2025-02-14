import "dotenv/config"
import express from  "express";
import hotelsRouter from "./api/hotel";
import connectDB from "./infrastructure/db";
import usersRouter from "./api/user";
import bookingsRouter from "./api/booking";
import cors from "cors";
import globalErrorHanflingMiddleware from "./api/middlewares/global-error-handling-middleware";

const app = express();

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
app.use("/api/users", usersRouter)
app.use("/api/bookings", bookingsRouter)

app.use(globalErrorHanflingMiddleware)
app.listen(8000,() => console.log("server is running on 8000")
)
