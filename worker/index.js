const express = require("express")
const app=express()

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

app.get("/",async(req,res)=>{
    await delay(120000)
    return res.json({
        msg:"chalsssssss bsdk"
    })
})
app.listen(3000)