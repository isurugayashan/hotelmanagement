//DTO = Domain Transfer Object

import { z } from "zod";

export const CreateBookinglDTO = z.object({
    hotelId: z.string(),
    checkIn: z.string(),
    checkOut: z.string(),
    roomNumber: z.number(),

});

export const UpdateBookinglDTO = z.object({
    hotelId: z.string(),
    userId: z.string(),
    checkIn: z.string(),
    checkOut: z.string(),
    roomNumber: z.number(),

});