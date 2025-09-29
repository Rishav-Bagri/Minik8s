const express = require("express")
const metrics = require("../../metrics");
const metricRouter=express.Router()



metricRouter.get("/", async (req, res) => {
    res.json({
        msg:"tasks information",
        data:metrics
    })
});

module.exports = metricRouter
