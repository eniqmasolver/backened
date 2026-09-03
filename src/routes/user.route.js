import { Router} from "express";
import registerUser, { LoginUser, logout } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWt } from "../middlewares/auth.middlewares.js";



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
    
export default router