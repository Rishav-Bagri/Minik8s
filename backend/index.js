const express = require("express")
const queueRouter = require("./routes/queue")
const lbRouter = require("./routes/load balancer")
const scalerRouter = require("./routes/autoScaler")
const app=express()


app.use("/queue",queueRouter)
app.use("/process-task",lbRouter.lbRouter)
app.use("/autoscaler",scalerRouter.scalerRouter)

app.get("/",(req,res)=>{
    return res.json({
        msg:"chalsssssss"
    })
})
app.listen(3000)