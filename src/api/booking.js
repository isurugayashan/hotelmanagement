import express from "express";
import { createBooking, getAllBookings, getBookingForHotel, deleteBooking, updateBooking } from "../application/booking.js";

const bookingsRouter = express.Router();

bookingsRouter.get("/", getAllBookings);
bookingsRouter.get("/hotels/:hotelId", getBookingForHotel);
bookingsRouter.post("/",createBooking);
bookingsRouter.delete("/:id", deleteBooking);
bookingsRouter.put("/:id", updateBooking);

//Aditional method

// hotelsRouter.route("/").get(getAllHotels).post(createHotel);
// hotelsRouter
// .route("/:id")
// .get(getHotelById)
// .put(updateHotel)
// .delete(deleteHotel)


export default bookingsRouter; 