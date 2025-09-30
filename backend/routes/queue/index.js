const express = require("express");
const queueRouter = express.Router();
const queue = require("../../queue");

queueRouter.post("/enqueue", (req, res) => {
  const { task } = req.body;
  if (!task) return res.status(400).json({ error: "Task required" });

  queue.enqueue(task);
  res.json({ message: "Task added", queueLength: queue.getLength() });
});

queueRouter.get("/dequeue", (req, res) => {
  const task = queue.dequeue();
  if (!task) return res.status(404).json({ error: "No tasks in queue" });

  res.json({ task, queueLength: queue.getLength() });
});

queueRouter.get("/length", (req, res) => {
  res.json({ queueLength: queue.getLength() });
});

module.exports = queueRouter;
