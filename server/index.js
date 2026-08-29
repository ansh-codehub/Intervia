import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/connectDb.js"
import cookieParser from "cookie-parser"
dotenv.config()
import cors from "cors"
import authRouter from "./routes/auth.rout.js"
import userRouter from "./routes/user.rout.js"
import interviewRouter from "./routes/interview.rout.js"
import paymentRouter from "./routes/payment.rout.js"



const app = express()
app.use(cors({
    origin: [
        "https://intervia.me",
        "https://www.intervia.me"
    ],
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/interview", interviewRouter)
app.use("/api/payment", paymentRouter)

const PORT = process.env.PORT || 6000
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
    connectDb()
})