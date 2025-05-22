const express = require('express')

const dotenv = require('dotenv')
dotenv.config()


const connectToDB = require('./config/db')
connectToDB();
 const cookieParser = require('cookie-parser')
 const indexRouter = require('./routes/index-route')
 const userRouter = require('./routes/user-router')
 const uploadRouter = require('./routes/upload-route'); 
const app = express()



app.set('view engine','ejs')
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/',indexRouter)
app.use('/user',userRouter)
app.use('/upload', uploadRouter);

app.listen(500,()=>{
    console.log("server running on port 500")
})