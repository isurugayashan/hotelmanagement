//All the business logic inclde application folder

import User from "../infrastructure/schemas/User.js";

export const getAllUsers = async (req, res) =>{
    
    const Users = await User.find({})
    res.status(200).json(Users);
}


export const getUserById = async (req, res) =>{
    const UserId = req.params.id;
    const User = await User.findById(UserId);
    if(!User){
        res.status(404).json({
            message: "User not found",
        });
        return;
    }
    res.status(200).json(User);
}

export const createUser = async (req, res) =>{

    const user = req.body;
    //Validate the request

    if(
        !user.name || !user.email
    ){
        res.status(400).json({
            message: "Please enter all required fields",
        });
        return;
    }

    //Add User
    await User.create({
        name: user.name,
        email: user.email,  
    });

    res.status(201).json({
        message: "User added successfully",
    });
}



export const deleteUser = async (req, res) =>{
        const UserId = req.params.id;

        await User.findByIdAndDelete(UserId);
    // Respond with a success message
    res.status(200).json({ message: `User ${UserId}deleted successfully.` });

}


export const updateUser = async(req, res) =>{

    const UserId = req.params.id;
    const updatedUser = req.body;
    //Validate the request

    if(
        !updatedUser.name || !updatedUser.location || !updatedUser.rating || !updatedUser.reviews || !updatedUser.image || !updatedUser.price || !updatedUser.description
    ){
        res.status(400).json({
            message: "Please enter all required fields",
        });
        return;
    }


    //update User
    await User.findByIdAndUpdate(UserId, updatedUser)
    res.status(201).json({
        message: `User ${UserId} updated successfully`,
    });


}