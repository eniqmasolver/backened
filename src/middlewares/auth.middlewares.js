import ApiError from "../utils/apierror.js";
import asynchandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { user } from "../models/user.models.js";

export const verifyJWt=asynchandler(async(req,res,next)=>{
    
        console.log("COOKIES:", req.cookies);
console.log("ACCESS TOKEN:", req.cookies?.acessToken);
        const token=req.cookies?.acessToken || req.header("Authorization")?.replace("Bearer","")
            if(!token){
                throw new ApiError(401,"Unauthrized request")


            }
            const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
            const User=await user.findById(decodedToken?._id).select("-password -refreshToken")

            if(!User){
                throw new ApiError(401,"invalid acess token")
            }
            req.User=User
        next()
    
})