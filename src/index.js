// import mongoose from "mongoose"
// import {DB_NAME} from "./constants"
import connectDB from "./db/index.js"
import dotenv from "dotenv"
dotenv.configDotenv({
    path:'./.env'
})

connectDB();










// import express from "express"
// const app=express()
// (async ()=>{
//     try {
//        await mongoose.connect(`${process.env.MONGODB_UR}/${DB_NAME}`)
//         app.on("error",()=>{
//             console.log("err",error);
//             throw error
//         })
//         app.listen(process.env.PORT,()=>{
//             console.log(`app is listening on port${process.env.PORT}`);
            
//         })
//     } catch (error) {
//         console.log("error occured:",error);
//         throw error
        
//     }
// }) ()