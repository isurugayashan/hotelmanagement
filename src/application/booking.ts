//All the business logic inclde application folder
import { NextFunction, Request, Response } from "express";
import Booking from "../infrastructure/schemas/Booking";

export const getAllBookings = async (req : Request, res: Response, next: NextFunction) =>{
    
    try {
        const Bookings = await Booking.find()
        res.status(200).json(Bookings);
        
    } catch (error) {
        next(error);
    }
   
}


export const  getBookingForHotel = async (req : Request, res: Response, next: NextFunction) =>{
   
   try {
    const hotelId = req.params.hotelId;
    const bookings = await Booking.find( {hotelId} ).populate("userId");
    res.status(200).json(bookings);
    
   } catch (error) {
    next(error);
   }

   
}

export const createBooking = async (req : Request, res: Response, next: NextFunction) =>{

  try {
    
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

  } catch (error) {
    next(error);
  }
   
}



export const deleteBooking = async (req : Request, res: Response, next: NextFunction) =>{
   
    try {
    const BookingId = req.params.id;

    await Booking.findByIdAndDelete(BookingId);
    // Respond with a success message
    res.status(200).json({ message: `Booking ${BookingId}deleted successfully.` });

        
    } catch (error) {
        next(error);
    }  
    
  
}


export const updateBooking = async(req : Request, res: Response, next: NextFunction) =>{

   try {
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

    
   } catch (error) {
    next(error);
   }
   
    

}