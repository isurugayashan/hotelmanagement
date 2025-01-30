import express from "express";
import { createUser, getAllUsers, getUserById, deleteUser, updateUser } from "../application/user.js";

const usersRouter = express.Router();

usersRouter.get("/", getAllUsers);
usersRouter.get("/:id", getUserById);
usersRouter.post("/",createUser);
usersRouter.delete("/:id", deleteUser);
usersRouter.put("/:id", updateUser);

//Aditional method

// hotelsRouter.route("/").get(getAllHotels).post(createHotel);
// hotelsRouter
// .route("/:id")
// .get(getHotelById)
// .put(updateHotel)
// .delete(deleteHotel)


export default usersRouter; 