const express = require("express")
const queueRouter = require("./routes/queue")
const lbRouter = require("./routes/load balancer")
const app=express()


app.use("/queue",queueRouter)
app.use("/process-task",lbRouter)

app.get("/",(req,res)=>{
    return res.json({
        msg:"chalsssssss bsdk"
    })
})
app.listen(3000)