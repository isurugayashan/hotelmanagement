import mongoose, { Mongoose } from "mongoose";

const bookingSchema = new mongoose.Schema({ 
    //referencing
    hotelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
        required: true,
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    checkIn: {
        type: Date,
        required: true,
    },

    checkOut: {
        type: Date,
        required: true,
    },

    roomNumber: {
        type: Number,
        required: true,
    },
});

export default mongoose.model("Booking", bookingSchema);
