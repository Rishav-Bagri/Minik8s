const express = require("express");
const queue = require("../../queue");
const { processTask } = require("../load balancer");
const metrics = require("../../metrics");
const { runContainer, killContainer } = require("../../docker");
const scalerRouter = express.Router();

const threshold=80;
let container=[]
let lastScaleTime = 0;
const COOLDOWN_MS = 5000; 


async function stopContainer(ID,i){
    const interval=setInterval(async()=>{
        if(metrics.workerReqs[i]==0){
            await killContainer(ID)
            clearInterval(interval)
        }
    },1000)
}

scalerRouter.post("/",async (req, res) => {
    while(queue.getLength()){
        const task=queue.peek();
        queue.dequeue();
        processTask(task)
        if((100*metrics.reqProcessing/(100*metrics.maxContainer))>threshold){
            const port = 3000 + metrics.maxContainer;
            let containerObject=await runContainer(port)
            metrics.maxContainer++;
            container.push(containerObject.id)
        }
        if (Date.now() - lastScaleTime > COOLDOWN_MS) {
            if(metrics.maxContainer>1 && (100*metrics.reqProcessing/(100*(metrics.maxContainer-1)))<threshold){
                lastScaleTime = Date.now();
                metrics.maxContainer--;
                const containerId = container[metrics.maxContainer];
                stopContainer(containerId,metrics.maxContainer)
            }
        }

    }
    return res.json({
        msg:"Scaler executed queue all executed"
    })
});



module.exports = scalerRouter;
