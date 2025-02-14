import express from "express";
import { createHotel, getAllHotels, getHotelById, deleteHotel, updateHotel } from "../application/hotel";

const hotelsRouter = express.Router();

hotelsRouter.get("/", 
    (req, res, next) =>{
    next();
},getAllHotels);
hotelsRouter.get("/:id", getHotelById);
hotelsRouter.post("/", createHotel);
hotelsRouter.delete("/:id", deleteHotel);
hotelsRouter.put("/:id", updateHotel);

//Aditional method

// hotelsRouter.route("/").get(getAllHotels).post(createHotel);
// hotelsRouter
// .route("/:id")
// .get(getHotelById)
// .put(updateHotel)
// .delete(deleteHotel)


export default hotelsRouter; 