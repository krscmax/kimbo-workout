import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import WeightChart from '../components/WeightChart'
import type { WeightEntry } from '../types'

const HEIGHT_M = 1.80

function calcBmi(weight: number) {
  return (weight / (HEIGHT_M * HEIGHT_M)).toFixed(1)
}

function bmiCategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: 'น้ำหนักน้อย', color: 'text-blue-600' }
  if (bmi < 25) return { label: 'ปกติ ✅', color: 'text-green-600' }
  if (bmi < 30) return { label: 'น้ำหนักเกิน', color: 'text-yellow-600' }
  return { label: 'อ้วน', color: 'text-red-600' }
}

function idealWeight(): string {
  const low = (18.5 * HEIGHT_M * HEIGHT_M).toFixed(1)
  const high = (24.9 * HEIGHT_M * HEIGHT_M).toFixed(1)
  return `${low}–${high} kg`
}

export default function Progress() {
  const [entries, setEntries] = useLocalStorage<WeightEntry[]>('weight-log', [])
  const [input, setInput] = useState('')

  const today = new Date().toISOString().slice(0, 10)
  const latestWeight = entries.length > 0 ? entries[entries.length - 1].weight : null
  const bmi = latestWeight ? parseFloat(calcBmi(latestWeight)) : null
  const bmiInfo = bmi ? bmiCategory(bmi) : null

  const handleAdd = () => {
    const w = parseFloat(input)
    if (isNaN(w) || w < 30 || w > 250) return
    const existing = entries.findIndex(e => e.date === today)
    if (existing >= 0) {
      const updated = [...entries]
      updated[existing] = { date: today, weight: w }
      setEntries(updated)
    } else {
      setEntries([...entries, { date: today, weight: w }])
    }
    setInput('')
  }

  const handleDelete = (date: string) => {
    setEntries(entries.filter(e => e.date !== date))
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-4">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold text-gray-900">ความคืบหน้า</h1>
      </div>

      {/* BMI Card */}
      <div className="px-4">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 text-white">
          <p className="text-sm opacity-80">น้ำหนักล่าสุด</p>
          <p className="text-4xl font-bold mt-1">
            {latestWeight ? `${latestWeight} kg` : '— kg'}
          </p>
          {bmi && bmiInfo && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm opacity-90">BMI {bmi}</span>
              <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                {bmiInfo.label}
              </span>
            </div>
          )}
          <p className="text-xs opacity-70 mt-2">เป้าหมาย BMI 18.5–24.9 · น้ำหนักที่เหมาะ {idealWeight()}</p>
        </div>
      </div>

      {/* Input */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">บันทึกน้ำหนักวันนี้</p>
          <div className="flex gap-2">
            <input
              type="number"
              inputMode="decimal"
              placeholder="เช่น 91.5"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              className="flex-1 rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              onClick={handleAdd}
              className="bg-orange-500 text-white px-4 py-2.5 rounded-xl font-medium text-sm active:bg-orange-600"
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">กราฟน้ำหนัก (30 วันล่าสุด)</p>
          <WeightChart data={entries} />
        </div>
      </div>

      {/* History */}
      {entries.length > 0 && (
        <div className="px-4 mt-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">ประวัติ</p>
          <div className="space-y-2">
            {[...entries].reverse().slice(0, 14).map(entry => (
              <div key={entry.date} className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-4 py-2.5">
                <span className="text-sm text-gray-600">{entry.date}</span>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900">{entry.weight} kg</span>
                  <button
                    onClick={() => handleDelete(entry.date)}
                    className="text-gray-300 active:text-red-400 text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
