//DTO = Domain Transfer Object

import { z } from "zod";

export const CreateBookinglDTO = z.object({
    hotelId: z.string(),
    checkIn: z.string(),
    checkOut: z.string(),
    roomNumber: z.number(),
    paymentStatus: z.enum(["PENDING", "PAID"]).default("PENDING"),
  paymentMethod: z.enum(["CARD", "BANK_TRANSFER"]).default("CARD")

});

export const UpdateBookinglDTO = z.object({
    hotelId: z.string(),
    userId: z.string(),
    checkIn: z.string(),
    checkOut: z.string(),
    roomNumber: z.number(),

});