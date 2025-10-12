Minik8s Complete Setup Guide 
Step 1: Install Docker
•	Go to Docker Desktop and download Docker for Windows, Mac, or Linux.
•	Install Docker Desktop.
•	After installation, make sure Docker is running.
________________________________________
Step 2: Install Node.js
•	Go to Node.js official website and download the latest LTS version.
•	Install Node.js on your system.
•	Verify installation:
node -v
npm -v
For Linux (Ubuntu), you can ask GPT: “How to install Node.js on Ubuntu?”
________________________________________
Step 3: Enable HTTP in Docker Desktop (Windows/Mac)
•	Open Docker Desktop → Go to Settings / Preferences
•	Find Resources → Network section
•	Enable: “Expose daemon without TLS” or similar HTTP/Proxy option
•	Click Apply / Save and restart Docker Desktop if needed
________________________________________
Step 4: Clone the Minik8s Repository
cd <your-desired-folder>
git clone <repo-url> Minik8s
cd Minik8s
________________________________________
Step 5: Build Worker Docker Image
•	Navigate to the worker folder:
cd worker
•	Find the Dockerfile and build the image:
docker build -t minik8s-worker .
________________________________________
Step 6: Run Worker Container
docker run -p 3000:3000 minik8s-worker
•	Make sure port 3000 is free. If not, kill the process or change the port in index.js and Dockerfile.
________________________________________
Step 7: Setup Backend
•	Navigate to backend folder:
cd ../backend
npm install
•	Make sure /process-task route exists in index.js. Example:
app.get("/process-task", (req, res) => {
    console.log("Received request at", new Date().toISOString());
    res.json({ msg: "your req is being processed" });
});
•	Start backend server:
node index.js
•	Backend default port: 4000
________________________________________
Step 8: Test Backend → Worker Communication
Open a new terminal and run:
(Invoke-WebRequest http://localhost:4000/process-task).Content
•	Expected response:
{"msg":"your req is being processed"}
•	Worker terminal logs:
Received request at ...
Finished task at ...
________________________________________
Step 9: Dockerize Backend (Optional)
•	Build backend Docker image:
cd backend
docker build -t minik8s-backend .
•	Run backend container:
docker run -p 4000:4000 minik8s-backend
________________________________________
Step 10: Scale Workers (Optional)
•	Run multiple worker containers to simulate multiple pods:
docker run -d -p 3001:3000 minik8s-worker
docker run -d -p 3002:3000 minik8s-worker
•	Update backend to distribute tasks to these ports (manual round-robin or load balancer).
________________________________________
Step 11: Cleanup
•	Stop running containers:
docker ps
docker stop <container_id>
•	Remove images if needed:
docker images
docker rmi <image_id>
________________________________________
Step 12: Troubleshooting
•	If you get an error:
o	Copy the error message
o	Paste it to GPT (or search online) for solution
•	Common issues:
o	EADDRINUSE → port already in use
o	Cannot GET /process-task → route missing in backend

