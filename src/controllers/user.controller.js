import asynchandler from "../utils/asyncHandler.js";

const registerUser=asynchandler(async (req,res)=>{
    res.status(201).json({
        message:"jai shree ram"
    })
})
export default registerUser;