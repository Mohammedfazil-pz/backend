const express=require("express")
const cors=require('cors')
const Router=require("./routes/userRouter")
const cookieParser=require("cookie-parser")
require("./db/config")

const app=express()

app.use(cors({
    origin:"http://localhost:4200",
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())
app.use(Router)

const PORT=3000

app.listen(PORT,()=>{
    console.log("Server running")
})




// console.log(timer)