const express=require("express");
const app=express();
const port=process.env.PORT||8080;



app.get("/",(req,res)=>{
    res.json({
        messsage:`server running at ${port}`
    })
})


app.listen(port,()=>{
    console.log(`server running at port ${port}`);
})
