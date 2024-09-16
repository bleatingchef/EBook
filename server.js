import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import helmet from "helmet";
import dotenv from "dotenv";
import cookieSession from "cookie-session";
import authRoute from "./routes/authRoute.js"
import userRoute from "./routes/userRoute.js"
import manageRoute from "./routes/manageRoute.js"
import orderRoute from "./routes/orderManageRoute.js"
import categoryRoute from "./routes/categoryRoute.js"
import newOrderRoute from './routes/newOrderRoute.js'
import booksAndAudioRoute from './routes/booksAndAudioRoute.js'

dotenv.config()

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(cookieSession(
    {
        maxAge:24 * 60 * 60 * 1000,
        keys:[process.env.SESSION_SECRET]
    }
))
app.use(helmet());

app.use('/auth',authRoute)
app.use('/user',userRoute)
app.use('/manage',manageRoute)
app.use('/orders',orderRoute)
app.use('/category',categoryRoute)
app.use('/neworders',newOrderRoute)
app.use('/newbooks',booksAndAudioRoute)


const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    app.listen(PORT,'0.0.0.0',()=>{
        console.log(`the server is running on port ${PORT}`)
    })
}).catch((err)=>{console.log(err)});