"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const hotel_1 = __importDefault(require("./api/hotel"));
const db_1 = __importDefault(require("./infrastructure/db"));
const booking_1 = __importDefault(require("./api/booking"));
const cors_1 = __importDefault(require("cors"));
const global_error_handling_middleware_1 = __importDefault(require("./api/middlewares/global-error-handling-middleware"));
const express_2 = require("@clerk/express");
const payment_1 = require("./application/payment");
const body_parser_1 = __importDefault(require("body-parser"));
const payment_2 = __importDefault(require("./api/payment"));
const app = (0, express_1.default)();
app.use((0, express_2.clerkMiddleware)());
// Middleware to parse JSON data in the request body
app.use((0, cors_1.default)({ origin: "https://aidf-horizone-frontend-isuru.netlify.app/" }));
app.post("/api/stripe/webhook", body_parser_1.default.raw({ type: "application/json" }), payment_1.handleWebhook);
//Midleware  replce the body parser
app.use(express_1.default.json());
app.use((0, cors_1.default)());
(0, db_1.default)();
//predefine
// app.use((req, res, next) =>{
//     console.log("Hello World");
//     next();
// })
app.use("/api/hotels", hotel_1.default);
app.use("/api/bookings", booking_1.default);
app.use("/api/payments", payment_2.default);
app.use(global_error_handling_middleware_1.default);
// Define the port to run the server
(0, db_1.default)();
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//# sourceMappingURL=index.js.map