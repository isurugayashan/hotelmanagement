import express from "express";
import { createBooking, getAllBookings, getBookingForHotel, deleteBooking, updateBooking, getBookingForUser } from "../application/booking";
import { isAuthenticated } from "./middlewares/authentication-middleware";

const bookingsRouter = express.Router();

bookingsRouter.get("/", getAllBookings);
bookingsRouter.get("/hotels/:hotelId", isAuthenticated,getBookingForHotel);
bookingsRouter.get("/:userId", isAuthenticated,getBookingForUser);
bookingsRouter.post("/",isAuthenticated, createBooking);
bookingsRouter.delete("/:id",isAuthenticated, deleteBooking);
bookingsRouter.put("/:id", isAuthenticated, updateBooking);

//Aditional method

// hotelsRouter.route("/").get(getAllHotels).post(createHotel);
// hotelsRouter
// .route("/:id")
// .get(getHotelById)
// .put(updateHotel)
// .delete(deleteHotel)


export default bookingsRouter; 