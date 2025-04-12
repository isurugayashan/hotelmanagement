//All the business logic inclde application folder
import { NextFunction, Request, Response } from "express";
import Hotel from "../infrastructure/schemas/Hotel";
import NotFoundError from "../domian/errors/not-found-error";
import ValidationError from "../domian/errors/validation-error";
import { CreateHotelDTO } from "../domian/dtos/hotel";
import OpenAI from "openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import mongoose from "mongoose";
import stripe from "../infrastructure/stripe";


// const hotels = [
//     {
       
//             "_id": "1",
//             "name": "Montmartre Majesty Hotel",
//             "location": "Paris, France",
//             "rating": 4.7,
//             "reviews": 2578,
//             "image": "https://cf.bstatic.com/xdata/images/hotel/max1280x900/297840629.jpg?k=d20e005d5404a7bea91cb5fe624842f72b27867139c5d65700ab7f69396026ce&o=&hp=1",
//             "price": 160,
//             "description": "Stay in the heart of Paris, France, at the Montmartre Majesty Hotel, where elegance meets charm. Perfect for exploring iconic landmarks like the Eiffel Tower and the Louvre, this hotel offers a tranquil escape from the bustling city. With luxurious rooms starting at $160 per night, enjoy breathtaking rooftop views, exquisite French cuisine, and the romantic ambiance of Montmartre. Ideal for a dreamy city getaway.",
           
//            },
       
//         {
//             "_id": "2",
//             "name": "Loire Luxury Lodge",
//             "location": "Sydney, Australia",
//             "rating": 4.9,
//             "reviews": 985,
//             "image": "https://cf.bstatic.com/xdata/images/hotel/max1280x900/596257607.jpg?k=0b513d8fca0734c02a83d558cbad7f792ef3ac900fd42c7d783f31ab94b4062c&o=&hp=1",
//             "price": 350,
//             "description": "Overlooking Sydney Harbour, Loire Luxury Lodge provides unmatched waterfront views and a vibrant city experience. From $350 per night, relax in modern luxury while enjoying proximity to Sydney Opera House and Bondi Beach. Whether you’re seeking adventure or relaxation, this hotel offers a harmonious blend of urban excitement and tranquil sophistication.",
        
//         },
//      {
//             "_id": "3",
//             "name": "Tokyo Tower Inn",
//             "location": "Tokyo, Japan",
//             "rating": 4.6,
//             "reviews": 875,
//             "image": "https://cf.bstatic.com/xdata/images/hotel/max1280x900/308797093.jpg?k=3a35a30f15d40ced28afacf4b6ae81ea597a43c90c274194a08738f6e760b596&o=&hp=1",
//             "price": 180,
//             "description": "Discover the vibrant energy of Tokyo at Tokyo Tower Inn, located in the heart of Japan’s bustling capital. For $180 per night, guests can enjoy modern comforts, panoramic city views, and access to iconic attractions like Shibuya Crossing and the Imperial Palace. Ideal for foodies, tech enthusiasts, and urban explorers.",
           
//         },
        
//     {
//             "_id": "4",
//             "name": "Sydney Harbour Hotel",
//             "location": "Sydney, Australia",
//             "rating": 4.8,
//             "reviews": 1023,
//             "image": "https://cf.bstatic.com/xdata/images/hotel/max1280x900/84555265.jpg?k=ce7c3c699dc591b8fbac1a329b5f57247cfa4d13f809c718069f948a4df78b54&o=&hp=1",
//             "price": 200,
//             "description": "Stay at Sydney Harbour Hotel and wake up to stunning harbour views in one of Australia’s most iconic destinations. Starting at $200 per night, enjoy rooftop dining, modern facilities, and close proximity to Darling Harbour and Sydney’s vibrant nightlife. Ideal for couples and city adventurers.",
            
//         },
        
//      {
//             "_id": "5",
//             "name": "Milan Central Suites",
//             "location": "Milan, Italy",
//             "rating": 4.5,
//             "reviews": 670,
//             "image": "https://cf.bstatic.com/xdata/images/hotel/max1280x900/608273980.jpg?k=c7df20ffb25ae52b6a17037dc13f5e15b94a0fe253a9b9d0b656f6376eabec7d&o=&hp=1",
//             "price": 140,
//             "description": "Nestled in the fashion capital of Milan, Italy, Milan Central Suites combines style and comfort for an unforgettable stay. At $140 per night, enjoy proximity to the Duomo and Galleria Vittorio Emanuele II, making it perfect for shoppers and culture enthusiasts alike.",
           
//         },
//      {
//             "_id": "6",
//             "name": "Elysée Retreat",
//             "location": "Kyoto, Japan",
//             "rating": 4.8,
//             "reviews": 1236,
//             "image": "https://cf.bstatic.com/xdata/images/hotel/max1280x900/606303798.jpg?k=514943d0025704b27396faf82af167468d8b50b98f311668f206f79ca36cb53d&o=&hp=1",
//             "price": 150,
//             "description": "Immerse yourself in Kyoto’s serene beauty at Elysée Retreat, a sanctuary of peace and tradition. Discover the charm of Japanese gardens, historic temples, and tea ceremonies, all just steps away. For $150 per night, indulge in authentic Kyoto hospitality, minimalistic elegance, and an unforgettable cultural experience tailored for nature lovers and tranquility seekers.",
           
//         },

//      {
//             "_id": "7",
//             "name": "Versailles Vista Inn",
//             "location": "Rome, Italy",
//             "rating": 4.7,
//             "reviews": 1356,
//             "image": "https://cf.bstatic.com/xdata/images/hotel/max1280x900/60307464.jpg?k=67ae35316203e2ec82d8e02e0cef883217cce9c436da581528b94ad6dee8e393&o=&hp=1",
//             "price": 220,
//             "description": "Located in the historic heart of Rome, Italy, Versailles Vista Inn offers a touch of Renaissance luxury. Explore the Colosseum and Vatican City by day and retreat to opulent comfort at night. Starting at $220 per night, guests enjoy fine Italian dining, elegant interiors, and a prime location for experiencing Rome’s timeless culture. Ideal for history buffs and luxury seekers.",
           
//         },
        
//        {
//             "_id": "8",
//             "name": "Parisian Palace",
//             "location": "Paris, France",
//             "rating": 4.9,
//             "reviews": 2135,
//             "image": "https://cf.bstatic.com/xdata/images/hotel/max1280x900/308794596.jpg?k=76bbd047a4f3773844efb15819a637f10fb98671244760fcd69cf26d1073b797&o=&hp=1",
//             "price": 320,
//             "description": "Experience ultimate luxury at Parisian Palace, a gem in the heart of Paris, France. For $320 per night, immerse yourself in timeless elegance with grand interiors, Michelin-star dining, and breathtaking views of the Seine. Perfect for a romantic escape or a refined city retreat.",
            
//         },
        
// ];
 

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve , ms));

export const getAllHotels = async (req : Request, res: Response, next: NextFunction) =>{
    
    try {
        
    const hotels = await Hotel.find({})
    // await sleep(5000);
    res.status(200).json(hotels);

    } catch (error) {
        next(error);
    }
}


export const getHotelById = async (req : Request, res: Response , next: NextFunction) =>{

    try {
        const hotelId = req.params.id;
        const hotel = await Hotel.findById(hotelId);
        if(!hotel){
            throw new NotFoundError("Hotel not Found");
        }
        res.status(200).json(hotel);
        
    } catch (error) {
        next(error);
    }
}

export const createHotel = async (req : Request, res: Response, next: NextFunction) =>{

try {
    const hotel = CreateHotelDTO.safeParse(req.body);

    
    //Validate the request
        
    if(!hotel.success){
        throw new ValidationError(hotel.error.message);
    }

     // Create a product in Stripe
     const stripeProduct = await stripe.products.create({
        name: hotel.data.name,
        description: hotel.data.description,
        default_price_data: {
          unit_amount: Math.round((hotel.data.price) * 100), // Convert to cents
          currency: "usd",
        },
      });

    const sharedId = new mongoose.Types.ObjectId();

    //Add hotel
    await Hotel.create({
        _id: sharedId,
        name: hotel.data.name,
        location: hotel.data.location,
        image: hotel.data.image,
        price: hotel.data.price,
        description: hotel.data.description,
        stripePriceId: stripeProduct.default_price,
    }); 
    
    const embeddingsModel = new OpenAIEmbeddings({
        model: "text-embedding-ada-002",
        apiKey: process.env.OPENAI_API_KEY,
    });

    const vectorIndex = new MongoDBAtlasVectorSearch(embeddingsModel, {
        collection: mongoose.connection.collection("hotelVectors"),
        indexName: "vector_index"
    });

    // Create documents in the format expected by addDocuments
    const documents = [{
        pageContent: `${hotel.data.name} ${hotel.data.location} ${hotel.data.description}`,
        metadata: {
            _id: sharedId,   
        }
    }];
    
    // Now pass the properly formatted documents array
    await vectorIndex.addDocuments(documents);

    res.status(201).json({
        message: "Hotel added successfully",
    });
    
} catch (error) {
    next(error);
}   
}



export const deleteHotel = async (req : Request, res: Response, next: NextFunction) =>{
        try {
      const hotelId = req.params.id;

        await Hotel.findByIdAndDelete(hotelId);
    // Respond with a success message
    res.status(200).json({ message: `Hotel ${hotelId}deleted successfully.` });
            
        } catch (error) {
            next(error);
        }
}


export const updateHotel = async(req : Request, res: Response, next: NextFunction) =>{

    try {
        const hotelId = req.params.id;

    //Validate the request
    const updatedHotel = CreateHotelDTO.safeParse(req.body);
    //Validate the request
        
    if(!updatedHotel.success){
        throw new ValidationError(updatedHotel.error.message);
    }


    //update hotel
    await Hotel.findByIdAndUpdate(hotelId, updatedHotel)
    res.status(201).json({
        message: `Hotel ${hotelId} updated successfully`,
    });
        
    } catch (error) {
        next(error);
    }

}

export const generateResponse = async(
    req: Request,
    res: Response,
    next: NextFunction

) =>{
    const {prompt} =req.body;
    
    const client = new OpenAI({
       apiKey: process.env.OPENAI_API_KEY,
    });

     const completion = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
        {
            role: "user",
            content: prompt,
        },
    ],
    store: true,
});

console.log(completion.choices[0].message);
res.status(200).json({message: completion.choices[0].message});
return;

}