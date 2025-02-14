
import mongoose from "mongoose";

const  connectDB = async () => {
    try{
        const mongodb_url = process.env.mongodb_url;
        if(!mongodb_url){
            throw new Error("MongoDB_URL is not et")
        }
            await mongoose.connect(mongodb_url);
            console.log("Conncetd to the databases");
    } catch(error){ 
            console.log("Error connecting to the database");
            console.log(error);        
    }
};   
 
export default connectDB;
//Mongo Password: znFrQTBWcFkCERam
