const express=require('express')
const app=express()
require('dotenv').config();
const main = require('./config/db')
const cookieParser = require('cookie-parser')
const authRouter=require('./routes/userauthentication');
const redisClient = require('./config/redis');
const problemRouter=require("./routes/problemcreator");
const submitRouter=require("./routes/submit")
const cors =require('cors')
const aiRouter=require("./routes/aichatting")

app.use(cors({
    origin:'https://coding-platform-ull7.vercel.app',
    credentials:true
}))

app.use(express.json());
app.use(cookieParser());

app.use('/user',authRouter);
app.use('/problem',problemRouter);
app.use('/submission',submitRouter);
app.use('/ai',aiRouter);

const IntializeConnection=async()=>{
    try
    {
        await Promise.all([main(),redisClient.connect()]);
        console.log("DB connected")
       app.listen(process.env.PORT,() => {
       console.log("server listening at port no:"+ process.env.PORT);
     });
    }
    catch(err){
       console.log("Error:"+err);
    }
}

IntializeConnection();



// main()
// .then(async ()=>{
// app.listen(process.env.PORT,()=>{
//     console.log("server listening at port no:"+process.env.PORT);
// })
// })
// .catch(err=>console.log("Error Occured:"+err));   
