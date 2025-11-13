const express = require("express");
const queue = require("../queue");
const metrics = require("../metrics");
const { runContainer, killContainer } = require("../docker");
const { processTask } = require("./loadbalancer");
const scalerRouter = express.Router();

const THRESHOLD_UP = 80;
const THRESHOLD_DOWN = 20;  
const MAX_CONTAINERS = 10;
const MIN_CONTAINERS = 1;
const COOLDOWN_MS = 50000;

let containers = [];
let lastScaleTime = 0;
let isScaling = false;

function calculateLoad() {
    if (metrics.maxContainer === 0) return 0;
    const maxCapacityPerContainer = 50;
    const totalCapacity = metrics.maxContainer * maxCapacityPerContainer;
    const currentLoad = (metrics.reqProcessing * 100)/ totalCapacity ;
    return currentLoad;
}

function shouldScaleUp() {
    const currentLoad = calculateLoad();
    const queueLength = queue.getLength();
    
    console.log(`=== SCALING DEBUG ===`);
    console.log(`reqProcessing: ${metrics.reqProcessing}`);
    console.log(`queueLength: ${queueLength}`);
    console.log(`maxContainer: ${metrics.maxContainer}`);
    console.log(`currentLoad: ${currentLoad.toFixed(2)}%`);
    
    const shouldScale = (currentLoad > THRESHOLD_UP) && (metrics.maxContainer < MAX_CONTAINERS);
    
    console.log(`Should scale up: ${shouldScale}`);
    return shouldScale;
}

function shouldScaleDown() {
    const currentLoad = calculateLoad();
    const queueLength = queue.getLength();
    
    const shouldScale = (Date.now() - lastScaleTime > COOLDOWN_MS) && 
                       (metrics.maxContainer > MIN_CONTAINERS) && 
                       (currentLoad < THRESHOLD_DOWN) && 
                       (queueLength === 0);

    
    console.log((Date.now() - lastScaleTime > COOLDOWN_MS) +" "+ 
                       (metrics.maxContainer > MIN_CONTAINERS) +" "+  
                       (currentLoad < THRESHOLD_DOWN) +" "+  
                       (queueLength === 0));
    
    console.log(`Should scale down: ${shouldScale}`);
    return shouldScale;
}
async function scaleUp() {
    console.log("1")
    if (metrics.maxContainer >= 10) {
        console.log("10 contaienre already there");
        return false;
    }
    console.log("2")
    if(isScaling===true){
        return
    }
    console.log("3")
    if(!shouldScaleUp())return
    console.log("4")


    console.log('🔄 Attempting to scale up...');
    isScaling = true;
    
    try {
        console.log("🔼 Scaling UP - Creating new container");
        console.log(metrics.maxContainer);
        const port = 3000 + metrics.maxContainer + 1;
        const container = await runContainer(port.toString());
        containers.push(container.id);
        metrics.maxContainer++;
        lastScaleTime = Date.now();
        
        console.log(`✅ Scaled up to ${metrics.maxContainer} containers on port ${port}`);
        return true;
    } catch (error) {
        console.error("❌ Scale up failed:", error);
        return false;
    } finally {
        isScaling = false;
    }
}

async function scaleDown() {
    if (metrics.maxContainer <= MIN_CONTAINERS) {
        console.log("Cannot scale down - already at min or scaling in progress");
        return false;
    }
    
    isScaling = true;
    
    try {
        console.log("🔽 Scaling DOWN - Removing container");
        const containerId = containers[containers.length - 1];
        await killContainer(containerId);
        metrics.maxContainer--;
        containers.pop();
        lastScaleTime = Date.now();
        
        console.log(`✅ Scaled down to ${metrics.maxContainer} containers`);
        return true;
    } catch (error) {
        console.error("❌ Scale down failed:", error);
        return false;
    } finally {
        isScaling = false;
    }
}

const autoScaler = async () => {
    // ⭐⭐⭐ SCALING PHASE ⭐⭐⭐
    if (shouldScaleUp()) {
        console.log("🔼 Scaling up...");
        await scaleUp();
    } else if (shouldScaleDown()) {
        console.log("🔽 Scaling down...");
        await scaleDown();
    } else {
        console.log("⚖️  No scaling needed");
    }
    
    // ⭐⭐⭐ PROCESSING PHASE ⭐⭐⭐
    let processedCount = 0;
    const MAX_BATCH_SIZE = 30;
    
    while (queue.getLength() > 0 && processedCount < MAX_BATCH_SIZE) {
        const task = queue.dequeue();
        if (task) {
            processTask(task);
            processedCount++;
        }
    }
    
    console.log(`✅ Processed ${processedCount} tasks, ${queue.getLength()} remaining`);
    
    // Continue if there's more work
    if (queue.getLength() > 0) {
        console.log("🔄 Continuing processing...");
        await new Promise(resolve => setTimeout(resolve, 2000));
        await autoScaler();
    }
};

// Routes and initialization remain the same
scalerRouter.post("/", async (req, res) => {
    await autoScaler();
    return res.json({
        msg: "Scaler executed",
        currentContainers: metrics.maxContainer
    });
});

// Initialize with one container
let initialized = false;
(function initializeContainers() {
    if (initialized) return;
    initialized = true;
    
    setTimeout(async () => {
        console.log("Initializing with one container...");
        try {
            const container = await runContainer("3001");
            containers.push(container.id);
            metrics.maxContainer = 1;
            console.log("✅ Initial container started on port 3001" + metrics.maxContainer);
        } catch (error) {
            console.error("❌ Failed to start initial container:", error);
        }
    }, 2000);
})();


setInterval(async () => {
    console.log("🔍 Checking for scale down...");
    console.log(metrics.maxContainer +" "+metrics.reqProcessing);
    if(queue.getLength()!==0)autoScaler()
    else if (shouldScaleDown()) {
        let i=metrics.maxContainer
        while(i--&&shouldScaleDown)
            await scaleDown();
        console.log("🔽 Scaling down...");
    } else {
        console.log("⚖️ No scale down needed");
    }
}, 20000);

module.exports = { scalerRouter, autoScaler, scaleUp, scaleDown };