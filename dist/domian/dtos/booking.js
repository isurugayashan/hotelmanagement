"use strict";
//DTO = Domain Transfer Object
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBookinglDTO = exports.CreateBookinglDTO = void 0;
const zod_1 = require("zod");
exports.CreateBookinglDTO = zod_1.z.object({
    hotelId: zod_1.z.string(),
    checkIn: zod_1.z.string(),
    checkOut: zod_1.z.string(),
    roomNumber: zod_1.z.number(),
});
exports.UpdateBookinglDTO = zod_1.z.object({
    hotelId: zod_1.z.string(),
    userId: zod_1.z.string(),
    checkIn: zod_1.z.string(),
    checkOut: zod_1.z.string(),
    roomNumber: zod_1.z.number(),
});
//# sourceMappingURL=booking.js.map