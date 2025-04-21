"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bookingSchema = new mongoose_1.default.Schema({
    //referencing
    hotelId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
    paymentStatus: {
        type: String,
        enum: ["PENDING", "PAID"],
        default: "PENDING",
    },
    paymentMethod: {
        type: String,
        enum: ["CARD", "BANK_TRANSFER"],
        default: "CARD",
    },
});
exports.default = mongoose_1.default.model("Booking", bookingSchema);
//# sourceMappingURL=Booking.js.map