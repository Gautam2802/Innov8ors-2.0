const express=require("express");
const app=express();
const port=process.env.PORT||8080;
const connectDB=require("./config/connectDB");



connectDB().then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})



app.get("/",(req,res)=>{
    res.json({
        messsage:`server running at ${port}`
    })
})


app.listen(port,()=>{
    console.log(`server running at port ${port}`);
})
