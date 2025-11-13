# Minik8s Complete Setup Guide

---

## Step 1: Install Docker
- Go to Docker Desktop and download Docker for Windows, Mac, or Linux.
- Install Docker Desktop.
- After installation, make sure Docker is running.

---

## Step 2: Install Node.js
- Go to Node.js official website and download the latest LTS version.
- Install Node.js on your system.
- Verify installation:

```bash
node -v
npm -v
```

For Linux (Ubuntu), you can ask GPT: “How to install Node.js on Ubuntu?”

---

## Step 3: Enable HTTP in Docker Desktop (Windows/Mac)
- Open Docker Desktop → Settings / Preferences
- Go to **Resources → Network**
- Enable: **Expose daemon without TLS**
- Click Apply / Save and restart Docker Desktop if needed.

---

## Step 4: Clone the Minik8s Repository

```bash
cd <your-desired-folder>
git clone https://github.com/Rishav-Bagri/Minik8s.git
cd Minik8s
```

---

## Step 5: Build Worker Docker Image

Navigate to worker folder:

```bash
cd worker
```

Build the Docker image:

```bash
docker build -t os-worker .
```

---

## Step 6: Run Worker Container (Testing)

```bash
docker run -p 3000:3000 os-worker
```

### Test URLs:
- `http://localhost:3000/` → should show **server is running**
- `http://localhost:3000/process-task` → wait 1 minute for output

Ensure port **3000** is free.

---

## Step 7: Setup Backend

```bash
cd ../backend
npm install
nodemon index.js
```

Backend default port → **3000**

---

## Step 8: Setup Frontend (New Terminal)

```bash
cd ./frontend/
npm i
npm run dev
```

Open browser:
`http://localhost:5173/`

---

## Step 9: Final Test (New Terminal)

```bash
cd ./ok/
node a.js
```

Output should show:
- Sent batches
- Final: **"all batches complete"**

Then check UI dashboard.

---

## Step 10: Kill All Docker Containers After Finishing

---

## Run Again With a New Batch

Before starting:
- Open Docker
- Check containers **3001–3010**
- If missing → kill all containers

### Terminal 1:
```bash
cd backend
node index.js
```

### Terminal 2:
```bash
cd frontend
npm run dev
```

### Terminal 3:
```bash
cd ok
node a.js
```
