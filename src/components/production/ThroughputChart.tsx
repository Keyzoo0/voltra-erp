'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ThroughputChartProps {
  data: { date: string; completed: number; rejected: number }[]
}

export function ThroughputChart({ data }: ThroughputChartProps) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="completed"
            stroke="#2563eb"
            strokeWidth={2}
            name="Completed"
          />
          <Line
            type="monotone"
            dataKey="rejected"
            stroke="#dc2626"
            strokeWidth={2}
            name="Rejected"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
