import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { WeightEntry } from '../types'

interface Props {
  data: WeightEntry[]
}

export default function WeightChart({ data }: Props) {
  if (data.length < 2) {
    return (
      <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
        บันทึกน้ำหนักอย่างน้อย 2 วัน เพื่อดูกราฟ
      </div>
    )
  }

  const chartData = data.slice(-30).map(d => ({
    date: d.date.slice(5),
    weight: d.weight,
  }))

  const weights = data.map(d => d.weight)
  const minW = Math.floor(Math.min(...weights)) - 1
  const maxW = Math.ceil(Math.max(...weights)) + 1

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: '#9ca3af' }}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={[minW, maxW]}
          tick={{ fontSize: 10, fill: '#9ca3af' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={v => `${v}`}
        />
        <Tooltip
          formatter={(v: number) => [`${v} kg`, 'น้ำหนัก']}
          labelFormatter={l => `วันที่ ${l}`}
          contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}
        />
        <Line
          type="monotone"
          dataKey="weight"
          stroke="#f97316"
          strokeWidth={2.5}
          dot={{ fill: '#f97316', r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
