// backend/queue.js
class TaskQueue {
  constructor() {
    this.tasks = [];
  }

  enqueue(task) {
    this.tasks.push(task);
  }

  dequeue() {
    return this.tasks.shift();
  }

  getLength() {
    return this.tasks.length;
  }

  peek() {
    return this.tasks[0];
  }
}

const queue = new TaskQueue();
module.exports = queue;
