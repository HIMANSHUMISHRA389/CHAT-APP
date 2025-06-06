import express from "express"
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/messsage.route.js'
import cors from "cors"
import dotenv from "dotenv"
import {connectDB} from './lib/db.js'
import cookieParser from "cookie-parser"

dotenv.config()
const app=express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true, 
}))
app.use('/api/auth',authRoutes)
app.use('/api/auth',messageRoutes)


const PORT=process.env.PORT

app.listen(PORT,()=>{
    console.log("server is running on PORT",PORT)

connectDB()
})