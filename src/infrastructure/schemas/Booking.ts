import mongoose, { Mongoose } from "mongoose";

const bookingSchema = new mongoose.Schema({ 
    //referencing
    hotelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
        required: true,
    },

    userId: {
        type: String,
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

    paymentStatus:{
        type: String,
        enum: ["PENDING" , "PAID"],
        default: "PENDING",
    },

    
    paymentMethod:{
        type: String,
        enum: ["CARD" , "BANK_TRANSFER"],
        default: "CARD",
    },
});

export default mongoose.model("Booking", bookingSchema);
