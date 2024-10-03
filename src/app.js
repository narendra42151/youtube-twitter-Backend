import cookieParser from "cookie-parser"
import cors from "cors"
import express, { urlencoded } from "express"

const app= express()

app.use(cors ({
    origin : process.env.CORS_ORIGIN,
    credentials : true,

}

))

app.use(express.json({
    limit: "10mb"
}))

app.use(urlencoded({
    limit: '16kb',
    extended: true,  
}))
app.use(express.static("public"))
app.use(cookieParser())


//routes 
import commentRouter from './routes/comment.routes.js'
import likeRouter from "./routes/like.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import userRouter from './routes/user.routes.js'
import videoRouter from "./routes/video.routes.js"

//routes deceration
app.use('/api/v1/users', userRouter)
console.log(app.use('/api/v1/users', userRouter))
app.use("/api/v1/comments", commentRouter) 
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/likes", likeRouter)

export { app }
   

console.log("App initialized");