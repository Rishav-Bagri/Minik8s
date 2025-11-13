import { useEffect, useState } from "react"
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, ReferenceLine
} from "recharts"

function App() {
  const [metrics, setMetrics] = useState({
    totalReq: 0,
    reqProcessed: 0,
    reqProcessing: 0,
    workerReqs: Array(10).fill(0),
    maxContainer: 0,
  })

  const [history, setHistory] = useState([])

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("http://localhost:3000/metric")
      const json = await res.json()
      const data = json.data
      console.log(data)

      setMetrics(data)

      setHistory(h => [
        ...h,
        { time: new Date().toLocaleTimeString(), max: data.maxContainer }
      ].slice(-40))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const workerData = metrics.workerReqs.map((v, i) => ({
    port: 3001 + i,
    load: v,
    active: i < metrics.maxContainer
  }))

  return (
    <div className="p-6 space-y-8 bg-gray-900 min-h-screen text-white">

      {/* top stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Requests" value={metrics.totalReq} />
        <StatCard label="Processing" value={metrics.reqProcessing} />
        <StatCard label="Processed" value={metrics.reqProcessed} />
      </div>

      {/* active containers */}
      <div className="text-xl font-semibold">
        Active Containers: {metrics.maxContainer}
      </div>

      {/* max container graph */}
      <div className="bg-gray-800 p-4 rounded-xl shadow">
        <div className="text-lg mb-2 font-semibold">maxContainer over time</div>

        <LineChart width={900} height={250} data={history}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />

          {/* natural numbers only */}
          <YAxis
            allowDecimals={false}
            tickFormatter={v => Math.floor(v)}
            domain={[0, "dataMax"]}
          />

          <Tooltip />

          {/* middle line */}
          <ReferenceLine
            y={Math.ceil(metrics.maxContainer / 2)}
            stroke="#8884d8"
            strokeDasharray="4 4"
          />

          <Line type="monotone" dataKey="max" stroke="#82ca9d" strokeWidth={2} />
        </LineChart>
      </div>

      {/* worker load graph */}
      <div className="bg-gray-800 p-4 rounded-xl shadow">
        <div className="text-lg mb-2 font-semibold">Worker Load</div>
        <BarChart width={900} height={300} data={workerData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="port" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="load" />
        </BarChart>
      </div>

      {/* worker status grid */}
      <div className="grid grid-cols-5 gap-4">
        {workerData.map((w, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl text-center ${
              w.active ? "bg-green-700" : "bg-gray-700"
            }`}
          >
            <div className="font-bold">port {w.port}</div>
            <div>load: {w.load}</div>
            <div>{w.active ? "active" : "inactive"}</div>
          </div>
        ))}
      </div>

    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow">
      <div className="text-sm opacity-70">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
}

export default App
