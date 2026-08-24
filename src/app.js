import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app=express()
app.use(cors({
    origin:process.env.CORES_ORIGIN,
    credential:true
}))
app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended:true,limit:"40kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import userrouter from "./routes/user.route.js"



//routes declertion
app.use("/api/v1/users",userrouter)
export default app