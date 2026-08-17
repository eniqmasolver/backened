import express from "express"
import cookieParser from "cookie-parser"

const app=express()
app.use(cors({
    origin:process.env.CORES_ORIGIN,
    credential:true
}))
app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended:true,limit:"40kb"}))
app.use(express.static("public"))
app.use(cookieParser())


export default app