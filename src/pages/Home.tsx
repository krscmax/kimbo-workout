import { exercises } from '../data/exercises'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { WorkoutDay, WeightEntry, Page } from '../types'

const defaultPlan: WorkoutDay[] = [
  { day: 'จันทร์', focus: 'push', exerciseIds: ['bench-press', 'ohp', 'tricep-pushdown', 'pushup'] },
  { day: 'อังคาร', focus: 'cardio', exerciseIds: ['hiit', 'jump-rope'] },
  { day: 'พุธ', focus: 'pull', exerciseIds: ['lat-pulldown', 'barbell-row', 'dumbbell-curl', 'rdl'] },
  { day: 'พฤหัส', focus: 'rest', exerciseIds: ['brisk-walk'] },
  { day: 'ศุกร์', focus: 'legs', exerciseIds: ['squat', 'leg-press', 'lunge', 'rdl'] },
  { day: 'เสาร์', focus: 'fullbody', exerciseIds: ['burpee', 'pushup', 'pullup', 'plank', 'mountain-climber'] },
  { day: 'อาทิตย์', focus: 'rest', exerciseIds: [] },
]

const DAYS_OF_WEEK = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์']

const HEIGHT_M = 1.80

interface Props {
  onNavigate: (page: Page, exerciseId?: string) => void
}

export default function Home({ onNavigate }: Props) {
  const [plan] = useLocalStorage<WorkoutDay[]>('workout-plan', defaultPlan)
  const [entries] = useLocalStorage<WeightEntry[]>('weight-log', [])

  const todayName = DAYS_OF_WEEK[new Date().getDay()]
  const todayPlan = plan.find(d => d.day === todayName)
  const todayExercises = (todayPlan?.exerciseIds ?? [])
    .map(id => exercises.find(e => e.id === id))
    .filter(Boolean)

  const latestWeight = entries.length > 0 ? entries[entries.length - 1].weight : null
  const bmi = latestWeight ? (latestWeight / (HEIGHT_M * HEIGHT_M)).toFixed(1) : null
  const targetWeight = (24.9 * HEIGHT_M * HEIGHT_M).toFixed(1)
  const diff = latestWeight ? (latestWeight - 24.9 * HEIGHT_M * HEIGHT_M).toFixed(1) : null

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'อรุณสวัสดิ์ 🌅'
    if (h < 17) return 'สวัสดีตอนบ่าย ☀️'
    return 'สวัสดีตอนเย็น 🌙'
  })()

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 px-4 pt-6 pb-8">
        <p className="text-orange-100 text-sm">{greeting}</p>
        <h1 className="text-white text-2xl font-bold mt-0.5">Workout App 💪</h1>
        <p className="text-orange-100 text-sm mt-1">วัน{todayName} — ออกกำลังกายกันเถอะ!</p>

        {latestWeight && (
          <div className="mt-4 bg-white/20 rounded-2xl px-4 py-3 flex gap-6">
            <div>
              <p className="text-orange-100 text-xs">น้ำหนักล่าสุด</p>
              <p className="text-white text-xl font-bold">{latestWeight} kg</p>
            </div>
            {bmi && (
              <div>
                <p className="text-orange-100 text-xs">BMI</p>
                <p className="text-white text-xl font-bold">{bmi}</p>
              </div>
            )}
            {diff && parseFloat(diff) > 0 && (
              <div>
                <p className="text-orange-100 text-xs">ต้องลด</p>
                <p className="text-white text-xl font-bold">{diff} kg</p>
              </div>
            )}
          </div>
        )}

        {!latestWeight && (
          <button
            onClick={() => onNavigate('progress')}
            className="mt-4 bg-white/20 text-white text-sm px-4 py-2 rounded-xl border border-white/30 active:bg-white/30"
          >
            + บันทึกน้ำหนักวันนี้
          </button>
        )}
      </div>

      {/* Today's Workout */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">วันนี้: {todayPlan?.focus === 'rest' ? 'วันพัก 😴' : `${todayExercises.length} ท่า`}</h2>
            <button
              onClick={() => onNavigate('plan')}
              className="text-orange-500 text-sm font-medium"
            >
              ดูแผนทั้งหมด →
            </button>
          </div>

          {todayExercises.length === 0 ? (
            <p className="text-gray-400 text-sm">วันนี้เป็นวันพัก — ฟื้นฟูร่างกายให้ดีนะครับ 🛌</p>
          ) : (
            <ul className="space-y-2">
              {todayExercises.map(ex => ex && (
                <li key={ex.id}>
                  <button
                    onClick={() => onNavigate('detail', ex.id)}
                    className="w-full flex items-center gap-3 text-left active:bg-gray-50 rounded-xl p-2 -mx-2"
                  >
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-base">
                      {ex.category === 'weights' ? '🏋️' : ex.category === 'bodyweight' ? '🤸' : '🏃'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{ex.nameTh}</p>
                      <p className="text-xs text-gray-400">{ex.setsReps}</p>
                    </div>
                    <span className="text-gray-300">›</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-4">
        <h2 className="font-semibold text-gray-900 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onNavigate('timer')}
            className="bg-orange-50 border border-orange-100 rounded-2xl p-4 text-left active:bg-orange-100"
          >
            <p className="text-2xl">⏱</p>
            <p className="font-semibold text-gray-900 mt-2">Rest Timer</p>
            <p className="text-xs text-gray-500">นับเวลาพักระหว่างเซ็ต</p>
          </button>
          <button
            onClick={() => onNavigate('exercises')}
            className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-left active:bg-blue-100"
          >
            <p className="text-2xl">📚</p>
            <p className="font-semibold text-gray-900 mt-2">ท่าทั้งหมด</p>
            <p className="text-xs text-gray-500">{exercises.length} ท่า พร้อม Form Guide</p>
          </button>
          <button
            onClick={() => onNavigate('progress')}
            className="bg-green-50 border border-green-100 rounded-2xl p-4 text-left active:bg-green-100"
          >
            <p className="text-2xl">📊</p>
            <p className="font-semibold text-gray-900 mt-2">บันทึกน้ำหนัก</p>
            <p className="text-xs text-gray-500">ติดตามความคืบหน้า</p>
          </button>
          <button
            onClick={() => onNavigate('plan')}
            className="bg-purple-50 border border-purple-100 rounded-2xl p-4 text-left active:bg-purple-100"
          >
            <p className="text-2xl">📅</p>
            <p className="font-semibold text-gray-900 mt-2">แผนสัปดาห์</p>
            <p className="text-xs text-gray-500">Push/Pull/Legs/Cardio</p>
          </button>
        </div>
      </div>

      {/* Target */}
      <div className="px-4 mt-4">
        <div className="bg-gray-50 rounded-2xl p-4 text-sm text-gray-600">
          <p className="font-semibold text-gray-800">🎯 เป้าหมาย</p>
          <p className="mt-1">น้ำหนักเป้าหมาย: <strong>{targetWeight} kg</strong> (BMI 24.9)</p>
          <p className="text-xs text-gray-400 mt-1">ส่วนสูง 180cm · น้ำหนักปัจจุบัน {latestWeight ?? 92} kg</p>
        </div>
      </div>
    </div>
  )
}
