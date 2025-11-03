const express = require("express")
const state = require("../../metrics") // using state object instead of destructured imports
const { date } = require("zod")
const queue = require("../../queue")
const lbRouter = express.Router()

/*
What to improve later

Max retry count → prevents infinite retries for failing tasks

Optional: backoff strategy → retry after a delay to avoid hammering workers

Optional: task ID + status tracking → so client can poll /result/:taskId
*/


// FLOW OF THE CODE
/*
Client → POST /dispatch-task → Load Balancer
Load Balancer:
  - Pick least-loaded worker
  - If worker free:
      - Increment workerReqs
      - Forward task async
      - On success/failure → decrement workerReqs
      - On failure → enqueue task
  - Else (all busy) → enqueue task
  - Respond immediately to client
Worker:
  - Processes task
  - Stores result
Client:
  - Polls /result/:taskId → gets output
*/

const LIMIT = 100
let urls = ["3001","3002","3003","3004","3005","3006","3007","3008","3009","3010"]

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function processTask(data) {
  let index = 0
  for (let i = 0; i < state.maxContainer; i++) {
    if (state.workerReqs[i] < state.workerReqs[index]) {
      index = i
    }
  }

  // if the chosen worker is below its processing limit
  if (state.workerReqs[index] < LIMIT) {
    state.reqProcessing++
    state.workerReqs[index]++

    fetch("http://localhost:" + urls[index], {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(() => {
        state.workerReqs[index]--
        state.reqProcessing--
      })
      .catch(e => {
        state.workerReqs[index]--
        state.reqProcessing--
        queue.enqueue(data)
      })
  } 
  // else if all workers are busy, push back to queue
  else {
    queue.enqueue(data)
  }
}

lbRouter.post("/", async (req, res) => {
  let body = req.body
  processTask(body)
  res.json({ msg: "your req is being processed" })
})

module.exports = { lbRouter, processTask }
