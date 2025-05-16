//All the business logic inclde application folder
import { NextFunction, Request, Response } from "express";
import Booking from "../infrastructure/schemas/Booking";
import { CreateBookinglDTO, UpdateBookinglDTO } from "../domian/dtos/booking";
import ValidationError from "../domian/errors/validation-error";
import { clerkClient } from "@clerk/express";
import Hotel from "../infrastructure/schemas/Hotel";

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
    const bookings = await Booking.find( {hotelId} );
    const bookingsWithUser = await Promise.all( bookings.map(async (el) =>{
        const user = await clerkClient.users.getUser(el.userId);
        console.log(user);
        
        //All user details  = ...el
        return {_id:el.id,hotelId: el.hotelId, checkIn:el.checkIn, checkOut: el.checkOut,roomNumber: el.roomNumber, user:{id:user.id, firstName:user.firstName, lastName:user.lastName}}
    }));
    res.status(200).json(bookingsWithUser);
    
   } catch (error) {
    next(error);
   }

   
}

export const getBookingForUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.userId;
  
      // Find all bookings for the given user
      const bookings = await Booking.find({ userId });
  
      // Fetch both user and hotel details for each booking
      const bookingsWithDetails = await Promise.all(
        bookings.map(async (booking) => {
          // Get user details from Clerk
          const user = await clerkClient.users.getUser(booking.userId);
          
          // Get hotel details from the Hotel collection
          const hotel = await Hotel.findById(booking.hotelId).select("name location"); // Select only required fields
  
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
        })
      );
  
      res.status(200).json(bookingsWithDetails);
    } catch (error) {
      next(error);
    }
  };

export const createBooking = async (req : Request, res: Response, next: NextFunction) =>{

  try {
    
    const booking = CreateBookinglDTO.safeParse(req.body);
   
    //Validate the request

    if (!booking.success) {
        throw new ValidationError(booking.error.message);
    }

    const user = req.auth;

    //Add Booking
     const newBooking = await Booking.create({
        hotelId: booking.data.hotelId,
        userId: user.userId,  
        checkIn: booking.data.checkIn, 
        checkOut: booking.data.checkOut, 
        roomNumber: booking.data.roomNumber
    });

      res.status(201).json(newBooking);

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

    const booking = UpdateBookinglDTO.safeParse(updatedBooking);
   
    //Validate the request

    if (!booking.success) {
        throw new ValidationError(booking.error.message);
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