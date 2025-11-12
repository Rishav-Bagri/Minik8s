const express = require("express")
const queueRouter = require("./routes/queue")
const lbRouter = require("./routes/loadbalancer")
const scalerRouter = require("./routes/autoscaler")
const app = express()

app.use(express.json()) // Don't forget this!
app.use("/queue", queueRouter)
app.use("/process-task", lbRouter.lbRouter)
app.use("/autoscaler", scalerRouter.scalerRouter)

app.get("/", (req, res) => {
    return res.json({
        msg: "Server running"
    })
})

app.listen(3000, () => {
    console.log("Server started on port 3000")
})