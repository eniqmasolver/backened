import asynchandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apierror.js";
import { user } from "../models/user.models.js";
import uploadCloudinary from "../utils/clodinary.js";
import ApiResponse from "../utils/apiresponse.js";

const registerUser=asynchandler(async (req,res)=>{
    //get user details from frontened
    //validation - not empty
    //check if user already exist:username
    //check for images ,check for avatar
    //upload them to cloudinary,avatar
    //create user object -create entry in db
    //remove password and refresh token field from response
    //check for user creation
    //return respond

    const {fullname,email,username,password} = req.body
    console.log("fullname:",fullname);

     if(fullname==="" || email==="" || username==="" || password===""){
throw new ApiError(400,"all fields are required");


     }

const existeduser=user.findOne(
    { 
        $or:[{username},{email}]
    }
)
if(existeduser) throw new ApiError(409,"already user exist");

const avatarLocalPath=req.files?.avatar[0]?.path;
const coverImageLocalPath=req.files?.coverimage[0]?.path;

if(!avatarLocalPath){
    throw new ApiError(400,"avatar file required");
    
}

const avatar=await uploadCloudinary(avatarLocalPath)
const coverimage=await uploadCloudinary(coverImageLocalPath)

if(!avatarLocalPath){
    throw new ApiError(400,"avatar file required");
    
}

 const userinfo = await user.create({
    fullname,
    avatar:avatar.url,
    coverimage:coverimage?.url || "",
    email,
    password,
    username: username.toLowerCase()
})

const createdUser=await user.findById(userinfo._id).select(
    "-password -refreshToken"
)


if(createdUser){
    throw new ApiError(500,"something went wrong while regestering a user");
    
}

return res.status(201).json(
    new ApiResponse(200,createdUser,"user registered sucessfully")
)

})
export default registerUser;