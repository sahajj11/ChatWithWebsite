import express from "express"
import cors from "cors";
import dotenv from "dotenv";
import crawlRouter from "../src/routes/crawl.route.js"
import searchRouter from "../src/routes/search.route.js"
import chatRouter from "../src/routes/chat.route.js"

dotenv.config();



const app=express()

app.use(cors())
app.use(express.json())

app.use("/api/crawl",crawlRouter)
app.use("/api/search",searchRouter)
app.use("/api/chat",chatRouter)

app.get("/",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"ChatWithWebsite API is running..."
    })
})

export default app
