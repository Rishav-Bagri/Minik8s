const Docker = require('dockerode');
const docker = new Docker({
  host: 'http://localhost',   
  port: 2375                 
});



const allContainer=async()=> {
    const container=await docker.listContainers({all:false})
    console.log(container);
    return container   
}

const runContainer=async(ports)=>{
    const container=await docker.createContainer({
        Image:"os-worker",
        ExposedPorts:{
            "3000/tcp":{}
        },
        HostConfig: {
            PortBindings:{
                "3000/tcp":[{
                    HostPort:`${ports}`
                }]
            }
        }
    })
    console.log("contaienr created "+container.id);
    
    await container.start()
    console.log("contaienr started "+container.id);
    return container
}
const killContainer=async(containerID)=>{
    await docker.getContainer(containerID).kill()
    console.log("container killed "+containerID);
    
}

// allContainer()
// runContainer(   )
// killContainer("bc9ab8c2203fc0f6cbd8e8bb6586139d38075800297a1b42d4e30ef8d56f52bc")



module.exports={allContainer,runContainer,killContainer}