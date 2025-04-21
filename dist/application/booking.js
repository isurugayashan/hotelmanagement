"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBooking = exports.deleteBooking = exports.createBooking = exports.getBookingForUser = exports.getBookingForHotel = exports.getAllBookings = void 0;
const Booking_1 = __importDefault(require("../infrastructure/schemas/Booking"));
const booking_1 = require("../domian/dtos/booking");
const validation_error_1 = __importDefault(require("../domian/errors/validation-error"));
const express_1 = require("@clerk/express");
const Hotel_1 = __importDefault(require("../infrastructure/schemas/Hotel"));
const getAllBookings = async (req, res, next) => {
    try {
        const Bookings = await Booking_1.default.find();
        res.status(200).json(Bookings);
    }
    catch (error) {
        next(error);
    }
};
exports.getAllBookings = getAllBookings;
const getBookingForHotel = async (req, res, next) => {
    try {
        const hotelId = req.params.hotelId;
        const bookings = await Booking_1.default.find({ hotelId });
        const bookingsWithUser = await Promise.all(bookings.map(async (el) => {
            const user = await express_1.clerkClient.users.getUser(el.userId);
            console.log(user);
            //All user details  = ...el
            return { _id: el.id, hotelId: el.hotelId, checkIn: el.checkIn, checkOut: el.checkOut, roomNumber: el.roomNumber, user: { id: user.id, firstName: user.firstName, lastName: user.lastName } };
        }));
        res.status(200).json(bookingsWithUser);
    }
    catch (error) {
        next(error);
    }
};
exports.getBookingForHotel = getBookingForHotel;
const getBookingForUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        // Find all bookings for the given user
        const bookings = await Booking_1.default.find({ userId });
        // Fetch both user and hotel details for each booking
        const bookingsWithDetails = await Promise.all(bookings.map(async (booking) => {
            // Get user details from Clerk
            const user = await express_1.clerkClient.users.getUser(booking.userId);
            // Get hotel details from the Hotel collection
            const hotel = await Hotel_1.default.findById(booking.hotelId).select("name location"); // Select only required fields
            return {
                _id: booking.id,
                checkIn: booking.checkIn,
                checkOut: booking.checkOut,
                roomNumber: booking.roomNumber,
                hotel: hotel ? { id: hotel.id, name: hotel.name, location: hotel.location } : null,
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            };
        }));
        res.status(200).json(bookingsWithDetails);
    }
    catch (error) {
        next(error);
    }
};
exports.getBookingForUser = getBookingForUser;
const createBooking = async (req, res, next) => {
    try {
        const booking = booking_1.CreateBookinglDTO.safeParse(req.body);
        //Validate the request
        if (!booking.success) {
            throw new validation_error_1.default(booking.error.message);
        }
        const user = req.auth;
        //Add Booking
        await Booking_1.default.create({
            hotelId: booking.data.hotelId,
            userId: user.userId,
            checkIn: booking.data.checkIn,
            checkOut: booking.data.checkOut,
            roomNumber: booking.data.roomNumber
        });
        res.status(201).json({
            message: "Booking added successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createBooking = createBooking;
const deleteBooking = async (req, res, next) => {
    try {
        const BookingId = req.params.id;
        await Booking_1.default.findByIdAndDelete(BookingId);
        // Respond with a success message
        res.status(200).json({ message: `Booking ${BookingId}deleted successfully.` });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteBooking = deleteBooking;
const updateBooking = async (req, res, next) => {
    try {
        const BookingId = req.params.id;
        const updatedBooking = req.body;
        //Validate the request
        const booking = booking_1.UpdateBookinglDTO.safeParse(updatedBooking);
        //Validate the request
        if (!booking.success) {
            throw new validation_error_1.default(booking.error.message);
        }
        //update Booking
        await Booking_1.default.findByIdAndUpdate(BookingId, updatedBooking);
        res.status(201).json({
            message: `Booking ${BookingId} updated successfully`,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateBooking = updateBooking;
//# sourceMappingURL=booking.js.map