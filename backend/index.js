const express = require("express")
const queueRouter = require("./routes/queue")
const app=express()


app.use("/queue",queueRouter)

app.get("/",(req,res)=>{
    return res.json({
        msg:"chalsssssss bsdk"
    })
})
app.listen(3000)