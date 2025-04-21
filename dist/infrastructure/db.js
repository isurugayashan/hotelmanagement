"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const mongodb_url = process.env.mongodb_url;
        if (!mongodb_url) {
            throw new Error("MongoDB_URL is not et");
        }
        await mongoose_1.default.connect(mongodb_url);
        console.log("Conncetd to the databases");
    }
    catch (error) {
        console.log("Error connecting to the database");
        console.log(error);
    }
};
exports.default = connectDB;
//Mongo Password: znFrQTBWcFkCERam
//# sourceMappingURL=db.js.map