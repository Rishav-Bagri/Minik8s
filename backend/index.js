const express = require("express")
const app=express()
app.get("/",(req,res)=>{
    return res.json({
        msg:"chalsssssss bsdk"
    })
})
app.listen(3000)