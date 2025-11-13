const express = require("express")
const queueRouter = require("./routes/queue")
const lbRouter = require("./routes/loadbalancer")
const scalerRouter = require("./routes/autoscaler")
const data = require("./metrics")
const app = express()
const cors = require('cors');
app.use(express.json()) // Don't forget this!
app.use(cors())
app.use("/queue", queueRouter)
app.use("/process-task", lbRouter.lbRouter)
app.use("/autoscaler", scalerRouter.scalerRouter)

app.get("/", (req, res) => {
    return res.json({
        msg: "Server running"
    })
})
app.get("/metric", (req, res) => {
    return res.json({
        msg: "Server running",
        data
    })
})

app.listen(3000, () => {
    console.log("Server started on port 3000")
})