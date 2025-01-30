//All the business logic inclde application folder
import Booking from "../infrastructure/schemas/Booking.js";

export const getAllBookings = async (req, res) =>{
    
    const Bookings = await Booking.find()
    res.status(200).json(Bookings);
}


export const  getBookingForHotel = async (req, res) =>{
    const hotelId = req.params.hotelId;
    const bookings = await Booking.find( {hotelId} ).populate({
        path :"userId", model : "User" , as : "user"
    })
    res.status(200).json(bookings);
    // console.log(hotelID);
    
    // ;
    // res.status(200).json (bookings);
    // return;
}

export const createBooking = async (req, res) =>{

    const booking = req.body;
   
    //Validate the request

    if(
        !booking.hotelId || !booking.userId || !booking.checkIn || !booking.checkOut || !booking.roomNumber
    ){
        res.status(400).json({
            message: "Please enter all required fields",
        });
        return;
    }

    //Add Booking
    await Booking.create({
        hotelId: booking.hotelId,
        userId: booking.userId,  
        checkIn: booking.checkIn, 
        checkOut: booking.checkOut, 
        roomNumber: booking.roomNumber
    });

    res.status(201).json({
        message: "Booking added successfully",
    });
}



export const deleteBooking = async (req, res) =>{
        const BookingId = req.params.id;

        await Booking.findByIdAndDelete(BookingId);
    // Respond with a success message
    res.status(200).json({ message: `Booking ${BookingId}deleted successfully.` });

}


export const updateBooking = async(req, res) =>{

    const BookingId = req.params.id;
    const updatedBooking = req.body;
    //Validate the request

    if(
        !updatedBooking.name || !updatedBooking.location || !updatedBooking.rating || !updatedBooking.reviews || !updatedBooking.image || !updatedBooking.price || !updatedBooking.description
    ){
        res.status(400).json({
            message: "Please enter all required fields",
        });
        return;
    }


    //update Booking
    await Booking.findByIdAndUpdate(BookingId, updatedBooking)
    res.status(201).json({
        message: `Booking ${BookingId} updated successfully`,
    });


}