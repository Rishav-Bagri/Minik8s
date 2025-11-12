const { scaleUp, scaleDown } = require("./routes/autoscaler");

async function test() {
    for (let i = 0; i < 3; i++) {
        const success = await scaleUp();
        if (!success) {
            console.log(`Scale up ${i+1} failed, stopping.`);
            break;
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
    
    }
    for (let i = 0; i < 3; i++) {
        const success = await scaleDown();
        if (!success) {
            console.log(`Scale up ${i+1} failed, stopping.`);
            break;
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
    
    }
    for (let i = 0; i < 3; i++) {
        const success = await scaleUp();
        if (!success) {
            console.log(`Scale up ${i+1} failed, stopping.`);
            break;
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
    
    }
    for (let i = 0; i < 3; i++) {
        const success = await scaleDown();
        if (!success) {
            console.log(`Scale up ${i+1} failed, stopping.`);
            break;
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
    
    }

}

test().catch(console.error);