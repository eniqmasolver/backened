import { Router} from "express";
import  {registerUser, LoginUser, logout } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWt } from "../middlewares/auth.middlewares.js";
import { AcessRefreshToken } from "../controllers/user.controller.js";



const router=Router()
router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverimage",
            maxCount:1
        }
        
    ]),
    
    registerUser)

    router.route("/login").post(LoginUser)
    
    router.route("/logout").post(verifyJWt,logout)

    router.route("/refreshtoken").post(AcessRefreshToken)
    
export default router