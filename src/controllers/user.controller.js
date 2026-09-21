import asynchandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apierror.js";
import { user, user } from "../models/user.models.js";
import uploadCloudinary from "../utils/clodinary.js";
import ApiResponse from "../utils/apiresponse.js";
import jwt from "jsonwebtoken"
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

if(!(username || email)){
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
             isloggedin,acessToken,refreshToken
        },
        "user logged in sucessfully"
    ))

}) 


const logout=asynchandler(async(req,res)=>{

    await user.findByIdAndUpdate(
        req.User._id,
        {
            $unset:{
                refreshToken:true
            }
        },
            {
                new:true
            }
        
    )
    
const options={
    httpOnly:true,
    secure:true
}
res
.status(201)
.clearCookie("acessToken",options)
.clearCookie("refreshToken",options)
.json(new ApiResponse(200,{},"logout succesfully"))
})



const AcessRefreshToken=asynchandler(async(req,res)=>{

  const incommingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if(!incommingRefreshToken){
    throw new ApiError(401,"unauthorized request")

  }
  const decodedToken=jwt.verify(incommingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
  
  const User=await user.findById(decodedToken?._id)
  if(!user){
    throw new ApiError(401,"invalid refresh token")
  }

  if(incommingRefreshToken!==user.refreshToken){
    throw new ApiError(401,"refresh token is epired and used")

  }
 const {acessToken,newrefreshToken}=await generateAcessAndRefreshTokens(User._id)
 const options={
    http:true,
    secure:true
 }
 res.status(200)
 .cookie("acessToken",acessToken,options)
 .cookie("refreshToken",newrefreshToken,options)
 .json(
   new ApiResponse(
    200,{acessToken,newrefreshToken},"acess token refreshed succesfully"
   ) 
 )
})




const ChangeCurrentPassword=asynchandler(async(req,res)=>{
    const {oldPassword,newPassword}=req.body

    const User=await user.findById(req.User?._id)
    if(!user){
        throw new ApiError(400,"user not found")
    }
   const isPasswordCorrect=await User.isPasswordCorrect(oldPassword)

    
    if(!isPasswordCorrect){
        throw new ApiError(400,"Invalid old Password")
    }
    User.password=newPassword
   await User.save({validateBeforeSave:false})

   return res.status(200)
   .json(
    new ApiResponse(
        200,{},"succesfully pasword is changed"
    )
   )

})





const getcurrentuser=asynchandler(async(req,res)=>{
    return res.status(200)
    .json(
        new ApiResponse(200,req.User,"current user fetched sucessfully")
    )
})





const updateinfo=asynchandler(async(req,res)=>{
    const {fullname,email}=req.body
    if(!fullname || !email){
        throw new ApiError(400,"all field are required")

    }
    const User=await user.findByIdAndUpdate(
        req.User,
        {
            $set:{
                fullname,
                email:email
            }
        },{
            new:true
        }
    ).select("-password")

return res.status(200)
.json(
    new ApiResponse(200,{fullname,email},"account details updated succesfully"
))


})


const UpdateUseravatar=asynchandler(async(req,res)=>{
    const avatarLocalPath=req.file?.path
    if(!avatarLocalPath){
        throw new ApiError(400,"avatar file is missing")
    }
    const AvatarUpload= await uploadCloudinary(avatarLocalPath)
    if(!AvatarUpload.url){
        throw new ApiError(400,"error while uploading")
    }
const User =await user.findByIdAndUpdate(
    req.User?._id,
    {
        $set:{
            avatar:avatar.url
        }
    },
    {
        new:true
    }
).select("-password")
 return res.status(200)
 .json(new ApiResponse(
    200,{user},"avatar image uploaded succesfully"
 ))   
})


const getUserChannelProfile=asynchandler(async(req,res)=>{
    const{username}=req.params
    if(!username){
        throw new ApiError(400,"username not found")
    }
    const channel=await user.aggregate([
        {
            $match:{
                username:username.toLowerCase()
            }
        },
        {
            $lookup:{
                from:"Subscription",
                localField:"_id",
                foreignField:"channel",
                as:"subscribers"
            }
        },
        {
            $lookup:{
                from:"Subscription",
                localField:"_id",
                foreignField:"subscriber",
                as:"subscribedTo"
            }
        },
        {
            $addFields:{
                subscriberCount:{
                    $size:"$subscribers"
                },
               subscribedToCount: {
                    $size:"$subscribedTo"
                },
                isSubscribedTo:{
                    $cond:{
                        if:{$in: [req.user?._id,"$subscribers.subsciber"]},
                        then:true,
                        else:false
                    }
                }
        }
        },
        {
            $project:{
                fullname:1,
                username:1,
                avatar:1,
                coverimage:1,
                 subscriberCount:1,
                  subscribedToCount:1,
                  isSubscribedTo:1,
                  email:1



            }

        }
    ])
    if(!channel?.length){
        throw new ApiError(404,"channel does not exist")
    }
    return res.status(200)
    .json(new ApiResponse(
        200,channel[0],"user channel fetched succesfully"
    ))

})

export {registerUser,LoginUser,logout,AcessRefreshToken,ChangeCurrentPassword,getcurrentuser,UpdateUseravatar}