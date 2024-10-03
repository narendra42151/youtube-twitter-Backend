import dotenv from 'dotenv'
import { app } from "./app.js"
import connectDB from "./db/index.js"




dotenv.config ( {
    path : './env'
}) 


connectDB()
.then (
    () => {
        app.listen(process.env.PORT || 8080
            , () => {
            console.log(`Server is running on port  ${process.env.PORT}`)  // log the server is running on port 8000
        })
    }
)
.catch(  (error) => {
    console.log("mogogdb connection fail:",  error)
}) 

console.log("Server is starting...");