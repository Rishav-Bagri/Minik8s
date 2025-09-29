const express = require("express")
const metrics = require("./metrics");
const metricRouter = require("./routes/metric");
const app=express()

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

app.use("/metric",metricRouter)

app.get("/", async (req, res) => {
    metrics.tasksProcessed++
    metrics.activeTasks++
    console.log(`Received request at ${new Date().toISOString()}`);
    await delay(120000);
    console.log(`Finished task at ${new Date().toISOString()}`);
    
    return metrics.activeTasks-- && res.json({ msg: "chalsssssss bsdk" });
});
app.listen(3000)