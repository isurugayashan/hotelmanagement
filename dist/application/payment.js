"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveSessionStatus = exports.createCheckoutSession = exports.handleWebhook = void 0;
const util_1 = __importDefault(require("util"));
const Booking_1 = __importDefault(require("../infrastructure/schemas/Booking"));
const stripe_1 = __importDefault(require("../infrastructure/stripe"));
const Hotel_1 = __importDefault(require("../infrastructure/schemas/Hotel"));
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;
async function fulfillCheckout(sessionId) {
    var _a;
    // Set your secret key. Remember to switch to your live secret key in production.
    // See your keys here: https://dashboard.stripe.com/apikeys
    console.log("Fulfilling Checkout Session " + sessionId);
    // TODO: Make this function safe to run multiple times,
    // even concurrently, with the same session ID
    // TODO: Make sure fulfillment hasn't already been
    // peformed for this Checkout Session
    // Retrieve the Checkout Session from the API with line_items expanded
    const checkoutSession = await stripe_1.default.checkout.sessions.retrieve(sessionId, {
        expand: ["line_items"],
    });
    console.log(util_1.default.inspect(checkoutSession, false, null, true /* enable colors */));
    const booking = await Booking_1.default.findById((_a = checkoutSession.metadata) === null || _a === void 0 ? void 0 : _a.bookingId);
    if (!booking) {
        throw new Error("Booking not found");
    }
    if (booking.paymentStatus !== "PENDING") {
        throw new Error("Payment is not pending");
    }
    // Check the Checkout Session's payment_status property
    // to determine if fulfillment should be peformed
    if (checkoutSession.payment_status !== "unpaid") {
        // TODO: Perform fulfillment of the line items
        // TODO: Record/save fulfillment status for this
        // Checkout Session
        await Booking_1.default.findByIdAndUpdate(booking._id, {
            paymentStatus: "PAID",
        });
    }
}
const handleWebhook = async (req, res) => {
    const payload = req.body;
    const sig = req.headers["stripe-signature"];
    let event;
    try {
        event = stripe_1.default.webhooks.constructEvent(payload, sig, endpointSecret);
        if (event.type === "checkout.session.completed" ||
            event.type === "checkout.session.async_payment_succeeded") {
            await fulfillCheckout(event.data.object.id);
            res.status(200).send();
            return;
        }
    }
    catch (err) {
        // @ts-ignore
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
};
exports.handleWebhook = handleWebhook;
const createCheckoutSession = async (req, res) => {
    try {
        const bookingId = req.body.bookingId;
        console.log("body", req.body);
        const booking = await Booking_1.default.findById(bookingId);
        if (!booking) {
            throw new Error("Booking not found");
        }
        // Find the hotel separately
        const hotel = await Hotel_1.default.findById(booking.hotelId);
        if (!hotel) {
            throw new Error("Hotel not found");
        }
        // Calculate number of nights
        const checkIn = new Date(booking.checkIn);
        const checkOut = new Date(booking.checkOut);
        const numberOfNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
        if (!hotel.stripePriceId) {
            throw new Error("Stripe price ID is missing for this hotel");
        }
        const session = await stripe_1.default.checkout.sessions.create({
            ui_mode: "embedded",
            line_items: [{
                    price: hotel.stripePriceId,
                    quantity: numberOfNights,
                }],
            mode: "payment",
            return_url: `${FRONTEND_URL}/booking/complete?session_id={CHECKOUT_SESSION_ID}`,
            metadata: {
                bookingId: req.body.bookingId,
            },
        });
        res.send({ clientSecret: session.client_secret });
    }
    catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({
            message: "Failed to create checkout session",
            error: error instanceof Error ? error.message : String(error)
        });
    }
};
exports.createCheckoutSession = createCheckoutSession;
const retrieveSessionStatus = async (req, res) => {
    var _a, _b;
    const checkoutSession = await stripe_1.default.checkout.sessions.retrieve(req.query.session_id);
    const booking = await Booking_1.default.findById((_a = checkoutSession.metadata) === null || _a === void 0 ? void 0 : _a.bookingId);
    if (!booking) {
        throw new Error("Booking not found");
    }
    const hotel = await Hotel_1.default.findById(booking.hotelId);
    if (!hotel) {
        throw new Error("Hotel not found");
    }
    res.status(200).json({
        bookingId: booking._id,
        booking: booking,
        hotel: hotel,
        status: checkoutSession.status,
        customer_email: (_b = checkoutSession.customer_details) === null || _b === void 0 ? void 0 : _b.email,
        paymentStatus: booking.paymentStatus,
    });
};
exports.retrieveSessionStatus = retrieveSessionStatus;
//# sourceMappingURL=payment.js.map