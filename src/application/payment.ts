import { Request, Response } from "express";
import util from "util";
import Booking from "../infrastructure/schemas/Booking";
import stripe from "../infrastructure/stripe";
import Hotel from "../infrastructure/schemas/Hotel";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
const FRONTEND_URL = process.env.FRONTEND_URL as string;

// async function fulfillCheckout(sessionId: string) {
//   // Set your secret key. Remember to switch to your live secret key in production.
//   // See your keys here: https://dashboard.stripe.com/apikeys
//   console.log("Fulfilling Checkout Session " + sessionId);

//   // TODO: Make this function safe to run multiple times,
//   // even concurrently, with the same session ID

//   // TODO: Make sure fulfillment hasn't already been
//   // peformed for this Checkout Session

//   // Retrieve the Checkout Session from the API with line_items expanded
//   const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
//     expand: ["line_items"],
//   });
//   console.log(
//     util.inspect(checkoutSession, false, null, true /* enable colors */)
//   );

//   const booking = await Booking.findById(checkoutSession.metadata?.bookingId);
//   if (!booking) {
//     throw new Error("Booking not found");
//   }
//   console.log(booking.paymentStatus);
  

//   if (booking.paymentStatus !== "PENDING") {
//     throw new Error("Payment is not pending");
//   }

//   // Check the Checkout Session's payment_status property
//   // to determine if fulfillment should be peformed
//   if (checkoutSession.payment_status !== "unpaid") {
//     // TODO: Perform fulfillment of the line items
//     // TODO: Record/save fulfillment status for this
//     // Checkout Session
//     await Booking.findByIdAndUpdate(booking._id, {
//       paymentStatus: "PAID",
//     });
//   }
// }

async function fulfillCheckout(sessionId: string) {
  console.log("🔄 Starting fulfillment for Checkout Session ID:", sessionId);

  try {
    // Retrieve session with line items
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    console.log("✅ Checkout Session retrieved:");
    console.log(util.inspect(checkoutSession, false, null, true));

    const bookingId = checkoutSession.metadata?.bookingId;

    if (!bookingId) {
      console.error("❌ Booking ID missing from metadata");
      throw new Error("Booking ID missing in session metadata");
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      console.error("❌ Booking not found for ID:", bookingId);
      throw new Error("Booking not found");
    }

    console.log("🧾 Current booking payment status:", booking.paymentStatus);

    if (booking.paymentStatus === "PAID") {
      console.log("ℹ️ Booking already marked as PAID. Skipping...");
      return; // Already processed
    }

    if (checkoutSession.payment_status !== "paid") {
      console.warn("⚠️ Payment status is not 'paid':", checkoutSession.payment_status);
      return; // Not a completed payment
    }

    // Update booking payment status
    const updatedBooking = await Booking.findByIdAndUpdate(
      booking._id,
      { paymentStatus: "PAID" },
      { new: true }
    );

    console.log("✅ Booking updated successfully:", updatedBooking);
  } catch (error) {
    console.error("❌ Error during fulfillCheckout:", error);
    throw error;
  }
}

// export const handleWebhook = async (req: Request, res: Response) => {
//   const payload = req.body;
//   const sig = req.headers["stripe-signature"] as string;

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
//     if (
//       event.type === "checkout.session.completed" ||
//       event.type === "checkout.session.async_payment_succeeded"
//     ) {
//        console.log("Processing session ID:", event.data.object.id);
//       await fulfillCheckout(event.data.object.id);

//       res.status(200).send();
//       return;
//     }
//   } catch (err) {
//     // @ts-ignore
//     res.status(400).send(`Webhook Error: ${err.message}`);
//     return;
//   }
// };

export const handleWebhook = async (req: Request, res: Response) => {
  const payload = req.body;
  const sig = req.headers["stripe-signature"] as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    console.log("📨 Stripe event received:", event.type);

    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const sessionId = (event.data.object as any).id;
      console.log("🔍 Session ID to fulfill:", sessionId);

      await fulfillCheckout(sessionId);

      res.status(200).send();
      return;
    } else {
      console.log("ℹ️ Ignored event type:", event.type);
    }

    res.status(200).send(); // Acknowledge receipt
  } catch (err) {
    console.error("❌ Webhook error:", err);
    // @ts-ignore
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const bookingId = req.body.bookingId;
    console.log("body", req.body);
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new Error("Booking not found");
    }

    // Find the hotel separately
    const hotel = await Hotel.findById(booking.hotelId);
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

    const session = await stripe.checkout.sessions.create({
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
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ 
      message: "Failed to create checkout session", 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
};

export const retrieveSessionStatus = async (req: Request, res: Response) => {
  const checkoutSession = await stripe.checkout.sessions.retrieve(
    req.query.session_id as string
  );

  const booking = await Booking.findById(checkoutSession.metadata?.bookingId);
  if (!booking) {
    throw new Error("Booking not found");
  }
  const hotel = await Hotel.findById(booking.hotelId);
  if (!hotel) {
    throw new Error("Hotel not found");
  }

  res.status(200).json({
    bookingId: booking._id,
    booking: booking,
    hotel: hotel,
    status: checkoutSession.status,
    customer_email: checkoutSession.customer_details?.email,
    paymentStatus: booking.paymentStatus,
  });
};