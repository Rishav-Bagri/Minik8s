# Autoscaler + Load Balancer + Workers + Queue Backend Roadmap

## 1. Setup & Boilerplate
- [✅] Initialize project folder
- [✅] Setup Node.js / Python backend with REST APIs
- [✅] Add Dockerfile for worker containers
- [✅] Setup basic logging system (console + optional file)

## 2. Worker Container
- [✅] Make a containerized worker server
- [✅] Expose endpoint `/process-task` that:
  - [✅] Accepts a task
  - [✅] Simulates work (2-min delay or configurable)
- [✅] Expose `/metrics` endpoint:
  - [✅] Tasks processed
  - [✅] Active / current task count

## 3. Queue System
- [✅] Implement a task queue (in-memory or Redis)
- [✅] API endpoint `/enqueue-task` to add tasks
- [✅] API endpoint `/dequeue-task` for workers to fetch tasks
- [✅] Track queue length in real-time

## 4. Load Balancer
- [⬜] Implement REST API endpoint `/dispatch-task`
- [⬜] Logic for dispatching tasks:
  - [⬜] Round-robin / least-connections worker selection
  - [⬜] Forward task from queue to selected worker
- [⬜] Track worker status:
  - [⬜] Active / idle
  - [⬜] Tasks in progress
- [⬜] Optional: simulate incoming traffic for testing

## 5. Autoscaler
- [⬜] Monitor:
  - [⬜] Queue length
  - [⬜] Worker utilization (tasks in progress)
- [⬜] Scaling rules:
  - [⬜] If queue length > threshold → start new worker container
  - [⬜] If queue length = 0 & workers idle → stop container
- [⬜] Use Docker SDK / CLI to start/stop worker containers programmatically
- [⬜] Expose `/autoscaler-status` endpoint for frontend

## 6. Metrics API
- [⬜] Aggregate metrics from:
  - [⬜] Queue
  - [⬜] Workers
  - [⬜] Autoscaler
- [⬜] Expose endpoints for frontend:
  - [⬜] `/containers-status`
  - [⬜] `/queue-length`
  - [⬜] `/requests-processed`
  - [⬜] `/scaling-events`

## 7. Testing & Simulation
- [⬜] Script to simulate incoming requests (traffic generator)
- [⬜] Test:
  - [⬜] Load balancing
  - [⬜] Autoscaling triggers
  - [⬜] Queue handling
- [⬜] Log everything for verification

## Next Step After Backend
- [⬜] Frontend dashboard to visualize:
  - [⬜] Active containers & load
  - [⬜] Queue length
  - [⬜] Requests processed per container
  - [⬜] Autoscaling events over time
