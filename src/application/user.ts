//All the business logic inclde application folder
import { NextFunction, Request, Response } from "express";
import User from "../infrastructure/schemas/User";
import NotFoundError from "../domian/errors/not-found-error";
import ValidationError from "../domian/errors/validation-error";

export const getAllUsers = async (req : Request, res: Response, next: NextFunction) =>{
    
  try {
    
    const Users = await User.find({})
    res.status(200).json(Users);

  } catch (error) {
    next(error);
  }
  
  
}


export const getUserById = async (req : Request, res: Response,  next: NextFunction) =>{
    
    try {
    const UserId = req.params.id;
    const user = await User.findById(UserId);
    if(!user){
        throw new NotFoundError("User not Found");
    }
    res.status(200).json(User);
        
    } catch (error) {
        next(error);
    }
    
   
}

export const createUser = async (req : Request, res: Response,  next: NextFunction) =>{

    try {
        const user = req.body;
    //Validate the request

    if(
        !user.name || !user.email
    ){
        throw new ValidationError("Invalid user data");
    }

    //Add User
    await User.create({
        name: user.name,
        email: user.email,  
    });

    res.status(201).json({
        message: "User added successfully",
    });
        
    } catch (error) {
        next(error);
    }
    
    
}



export const deleteUser = async (req : Request, res: Response,  next: NextFunction) =>{
    
    try {
    const UserId = req.params.id;

    await User.findByIdAndDelete(UserId);
    // Respond with a success message
    res.status(200).json({ message: `User ${UserId}deleted successfully.` });
        
    } catch (error) {
        next(error);
    }
    
   

}


export const updateUser = async(req : Request, res: Response,  next: NextFunction) =>{

    
    try {
        const UserId = req.params.id;
        const updatedUser = req.body;
        //Validate the request
    
        if(
            !updatedUser.name || !updatedUser.location || !updatedUser.rating || !updatedUser.reviews || !updatedUser.image || !updatedUser.price || !updatedUser.description
        ){
            throw new ValidationError("Invalid user data");
        }
    
    
        //update User
        await User.findByIdAndUpdate(UserId, updatedUser)
        res.status(201).json({
            message: `User ${UserId} updated successfully`,
        });
        
    } catch (error) {
        next(error);
    }
   


}