"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const booking_1 = require("../application/booking");
const authentication_middleware_1 = require("./middlewares/authentication-middleware");
const bookingsRouter = express_1.default.Router();
bookingsRouter.get("/", booking_1.getAllBookings);
bookingsRouter.get("/hotels/:hotelId", authentication_middleware_1.isAuthenticated, booking_1.getBookingForHotel);
bookingsRouter.get("/:userId", authentication_middleware_1.isAuthenticated, booking_1.getBookingForUser);
bookingsRouter.post("/", authentication_middleware_1.isAuthenticated, booking_1.createBooking);
bookingsRouter.delete("/:id", authentication_middleware_1.isAuthenticated, booking_1.deleteBooking);
bookingsRouter.put("/:id", authentication_middleware_1.isAuthenticated, booking_1.updateBooking);
//Aditional method
// hotelsRouter.route("/").get(getAllHotels).post(createHotel);
// hotelsRouter
// .route("/:id")
// .get(getHotelById)
// .put(updateHotel)
// .delete(deleteHotel)
exports.default = bookingsRouter;
//# sourceMappingURL=booking.js.map