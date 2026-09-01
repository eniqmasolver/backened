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
    console.log(req.body);

     if(fullname==="" || email==="" || username==="" || password===""){
throw new ApiError(400,"all fields are required");


     }

const existeduser= await user.findOne(
    { 
        $or:[{username},{email}]
    }
)
if(existeduser) throw new ApiError(409,"already user exist");

const avatarLocalPath=req.files?.avatar[0]?.path;
const coverImageLocalPath=req.files?.coverimage?.[0]?.path;

if(!avatarLocalPath){
    throw new ApiError(400,"avatar file required");
    
}

const avatar=await uploadCloudinary(avatarLocalPath)

const coverimage=coverImageLocalPath?await uploadCloudinary(coverImageLocalPath):null



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


if(!createdUser){
    throw new ApiError(500,"something went wrong while regestering a user");
    
}

return res.status(201).json(
    new ApiResponse(200,createdUser,"user registered sucessfully")
)

})

const generateAcessAndRefreshTokens=async(userid)=>{
try {
    const tokenUser=await user.findById(userid)
    const acessToken=tokenUser.generateAccessToken()
    const refreshToken=tokenUser.generatRefreshToken()

    tokenUser.refreshToken=refreshToken
    await tokenUser.save({validateBeforeSave: false})
    return {acessToken,refreshToken}
} catch (error) {
    throw new ApiError(500,"something went wrong while generating refresh and acess token")
}
}
const LoginUser=asynchandler(async(req,res)=>{
//req body
//username or email
//find the user
//password check
//access and refresh tokken
//send cookie
const{email,password,username}=req.body

if(!username || !email){
    throw new ApiError(400,"username or email is required")
}

const foundUser=await user.findOne({
    $or:[{email},{username}]
})

if(!foundUser){
    throw new ApiError(404,"user does not exist")
}

const isPasswordValid=await foundUser.isPasswordCorrect(password)

if(!isPasswordValid){
    throw new ApiError(401,"password is not valid")
}
const{refreshToken,acessToken}=await generateAcessAndRefreshTokens(foundUser._id)

const isloggedin=await user.findById(foundUser._id).select("-password -refreshToken")

const options={
    httpOnly:true,
    secure:true
}
res
.status(200)
.cookie("acessToken",acessToken,options)
.cookie("refreshToken",refreshToken,options)
.json(
    new ApiResponse(
        200,
        {
            foundUser:isloggedin,acessToken,refreshToken
        },
        "user logged in sucessfully"
    ))

}) 
export {registerUser,LoginUser}