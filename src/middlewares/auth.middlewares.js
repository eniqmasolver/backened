import ApiError from "../utils/apierror";
import asynchandler from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { user } from "../models/user.models";

export const verifyJWt=asynchandler(async(req,res,next)=>{
    try {
        const token=req.cookies?.acessToken || req.header("Authorization")?.replace("bearer","")
            if(!token){
                throw new ApiError(401,"Unauthrized request")


            }
            const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
            const User=await user.findById(decodedToken?._id).select("-password -refreshToken")

            if(!user){
                throw new ApiError(401,"invalid acess token")
            }
            req.User=User
        next()
    } catch (error) {
        throw new ApiError(401,"invalid acess token")
    }
})