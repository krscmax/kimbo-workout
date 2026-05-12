import { exercises } from '../data/exercises'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { WorkoutDay, DayFocus, Page } from '../types'

interface Props {
  onNavigate: (page: Page, exerciseId?: string) => void
}

const defaultPlan: WorkoutDay[] = [
  { day: 'จันทร์', focus: 'push', exerciseIds: ['bench-press', 'ohp', 'tricep-pushdown', 'pushup'] },
  { day: 'อังคาร', focus: 'cardio', exerciseIds: ['hiit', 'jump-rope'] },
  { day: 'พุธ', focus: 'pull', exerciseIds: ['lat-pulldown', 'barbell-row', 'dumbbell-curl', 'rdl'] },
  { day: 'พฤหัส', focus: 'rest', exerciseIds: ['brisk-walk'] },
  { day: 'ศุกร์', focus: 'legs', exerciseIds: ['squat', 'leg-press', 'lunge', 'rdl'] },
  { day: 'เสาร์', focus: 'fullbody', exerciseIds: ['burpee', 'pushup', 'pullup', 'plank', 'mountain-climber'] },
  { day: 'อาทิตย์', focus: 'rest', exerciseIds: [] },
]

const focusConfig: Record<DayFocus, { label: string; color: string; bg: string }> = {
  push: { label: 'Push 💪', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  pull: { label: 'Pull 🔙', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
  legs: { label: 'Legs 🦵', color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
  cardio: { label: 'Cardio 🏃', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
  fullbody: { label: 'Full Body 🔥', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200' },
  rest: { label: 'พัก / เดิน 😴', color: 'text-gray-600', bg: 'bg-gray-50 border-gray-200' },
}

const DAYS_OF_WEEK = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์']

export default function WorkoutPlan({ onNavigate }: Props) {
  const [plan] = useLocalStorage<WorkoutDay[]>('workout-plan', defaultPlan)
  const todayName = DAYS_OF_WEEK[new Date().getDay()]

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-4">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold text-gray-900">แผนออกกำลังกาย</h1>
        <p className="text-sm text-gray-500 mt-0.5">วันนี้: {todayName}</p>
      </div>

      <div className="px-4 space-y-3">
        {plan.map((dayPlan) => {
          const cfg = focusConfig[dayPlan.focus]
          const isToday = dayPlan.day === todayName
          const dayExercises = dayPlan.exerciseIds
            .map(id => exercises.find(e => e.id === id))
            .filter(Boolean)

          return (
            <div
              key={dayPlan.day}
              className={`rounded-2xl border p-4 ${cfg.bg} ${isToday ? 'ring-2 ring-orange-400' : ''}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {isToday && (
                    <span className="text-xs bg-orange-500 text-white rounded-full px-2 py-0.5 font-medium">
                      วันนี้
                    </span>
                  )}
                  <span className="font-semibold text-gray-900">{dayPlan.day}</span>
                </div>
                <span className={`text-sm font-medium ${cfg.color}`}>{cfg.label}</span>
              </div>

              {dayExercises.length === 0 ? (
                <p className="text-sm text-gray-400">วันพัก — ฟื้นฟูร่างกาย</p>
              ) : (
                <ul className="space-y-1.5">
                  {dayExercises.map(ex => ex && (
                    <li key={ex.id}>
                      <button
                        onClick={() => onNavigate('detail', ex.id)}
                        className="text-sm text-left text-gray-700 hover:text-orange-600 active:text-orange-600 flex items-center gap-1.5"
                      >
                        <span className="text-gray-400">•</span>
                        <span>{ex.nameTh}</span>
                        <span className="text-gray-400 text-xs">({ex.setsReps})</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>

      <div className="px-4 mt-4">
        <div className="bg-orange-50 rounded-2xl p-4 text-sm text-gray-700 space-y-1">
          <p className="font-semibold text-orange-700">💡 เทิปสำหรับลดน้ำหนัก</p>
          <p>• ออกกำลังกาย 4-5 วัน/สัปดาห์</p>
          <p>• Cardio 2 วัน + Strength 3 วัน</p>
          <p>• กิน Protein 1.6-2g/kg (≈148-184g/วัน)</p>
          <p>• นอนหลับ 7-8 ชม./วัน</p>
        </div>
      </div>
    </div>
  )
}
