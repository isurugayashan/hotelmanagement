import "dotenv/config"
import express from  "express";
import hotelsRouter from "./api/hotel.js";
import connectDB from "./infrastructure/db.js";

const app = express();

//Midleware  replce the body parser
app.use(express.json());

connectDB();


app.use("/api/hotels",hotelsRouter)


const bookings = [
    {
        id: "1",
        hotelId: "hotel-001",
        userId: "user-101",
        date: "2025-01-25",
        time: "14:00",
        notes: "Prefer a room with a city view."
    },
    {
        id: "002",
        hotelId: "hotel-002",
        userId: "user-102",
        date: "2025-02-01",
        time: "10:30",
        notes: "Allergic to feathers, please provide hypoallergenic bedding."
    },
    {
        id: "003",
        hotelId: "hotel-003",
        userId: "user-103",
        date: "2025-01-28",
        time: "16:00",
        notes: "Need a wheelchair-accessible room."
    },
    {
        id: "004",
        hotelId: "hotel-004",
        userId: "user-104",
        date: "2025-02-05",
        time: "12:00",
        notes: "Early check-in requested, if possible."
    },
    {
        id: "005",
        hotelId: "hotel-005",
        userId: "user-105",
        date: "2025-01-30",
        time: "15:00",
        notes: "Please arrange for extra towels and toiletries."
    }
];



// app.get("/bookings", (req, res ) =>{
//     res.status(200).json({bookings});
// })

// app.post("/booking", (req, res ) =>{
//     const booking = req.body;
//     res.status(200).json({booking});
// })

// app.get("/:bookingid", (req, res ) =>{
//     const bookingId = req.params.bookingid;
//     const booking = bookings.filter((hotel) => hotel.id === bookingId);
//     res.status(200).json({booking});
// })

// app.delete("/bookings/:bookingId", (req, res) => {
//     const bookingId = req.params.bookingId;

//     // Find the index of the booking with the given ID
//     const bookingIndex = bookings.findIndex((booking) => booking.id === bookingId);

//     bookings.splice(bookings.findIndex((booking) => booking.id === bookingId),1);

//     // Respond with a success message
//     res.status(200).json({ message: "Booking deleted successfully." });
// });




app.listen(8000,console.log("server is running on 8000")
)
