import { exercises, categoryLabels, difficultyLabels, difficultyColors } from '../data/exercises'
import MuscleDiagram from '../components/MuscleDiagram'
import type { Page } from '../types'

interface Props {
  exerciseId: string
  onNavigate: (page: Page) => void
  onStartTimer: (restSeconds: number) => void
}

const categoryGradient: Record<string, string> = {
  weights:     'from-blue-500 to-blue-700',
  bodyweight:  'from-green-500 to-green-700',
  cardio:      'from-red-500 to-red-700',
}

const categoryIcon: Record<string, string> = {
  weights:    '🏋️',
  bodyweight: '🤸',
  cardio:     '🏃',
}

export default function ExerciseDetail({ exerciseId, onNavigate, onStartTimer }: Props) {
  const ex = exercises.find(e => e.id === exerciseId)
  if (!ex) return null

  const ytSearch = `https://www.youtube.com/results?search_query=${encodeURIComponent(ex.nameEn + ' proper form tutorial')}`

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-6">

      {/* ── Hero ─────────────────────────────────────────── */}
      <div className={`relative bg-gradient-to-br ${categoryGradient[ex.category]} px-4 pt-4 pb-6`}>
        <button
          onClick={() => onNavigate('exercises')}
          className="flex items-center gap-1 text-white/80 text-sm font-medium mb-4 active:text-white"
        >
          ← กลับ
        </button>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                {categoryLabels[ex.category]}
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium bg-white/20 text-white`}>
                {difficultyLabels[ex.difficulty]}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white leading-tight">{ex.nameTh}</h1>
            <p className="text-white/70 text-sm mt-0.5">{ex.nameEn}</p>
            <p className="text-white/80 text-xs mt-2">🏋️ {ex.equipment}</p>
          </div>
          <span className="text-6xl opacity-80">{categoryIcon[ex.category]}</span>
        </div>
      </div>

      {/* ── Sets card ────────────────────────────────────── */}
      <div className="px-4 -mt-4 z-10 relative">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">แนะนำสำหรับลดน้ำหนัก</p>
            <p className="text-lg font-bold text-gray-900 mt-0.5">{ex.setsReps}</p>
          </div>
          {ex.restSeconds > 0 && (
            <button
              onClick={() => onStartTimer(ex.restSeconds)}
              className="flex items-center gap-2 bg-orange-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl active:bg-orange-600"
            >
              ⏱ พัก {ex.restSeconds}s
            </button>
          )}
        </div>
      </div>

      <div className="px-4 space-y-5 mt-4">

        {/* ── Exercise Illustration ────────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{}}>
          <img
            src={ex.image?.startsWith('http') ? ex.image : `/exercises/${ex.id}.jpg`}
            alt={ex.nameEn}
            className="w-full object-cover max-h-56"
            onError={e => {
              const section = (e.currentTarget as HTMLImageElement).parentElement!
              section.style.display = 'none'
            }}
          />
        </section>

        {/* ── Muscle Diagram ───────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-100 p-4">
          <h2 className="font-semibold text-gray-800 mb-4">กล้ามเนื้อที่ใช้</h2>
          <MuscleDiagram
            primaryMuscles={ex.primaryMuscles}
            secondaryMuscles={ex.secondaryMuscles}
          />
          <div className="flex flex-wrap gap-2 mt-4">
            {ex.primaryMuscles.map(m => (
              <span key={m} className="bg-orange-100 text-orange-700 text-xs rounded-full px-3 py-1 font-medium">
                {m}
              </span>
            ))}
            {ex.secondaryMuscles.map(m => (
              <span key={m} className="bg-gray-100 text-gray-600 text-xs rounded-full px-3 py-1">
                {m}
              </span>
            ))}
          </div>
        </section>

        {/* ── Steps ────────────────────────────────────────── */}
        <section>
          <h2 className="font-semibold text-gray-800 mb-3">วิธีทำ</h2>
          <div className="space-y-3">
            {ex.steps.map((step, i) => (
              <div key={i} className="flex gap-3 bg-white rounded-2xl border border-gray-100 p-3.5">
                <span className="shrink-0 w-7 h-7 bg-orange-500 text-white text-sm font-bold rounded-full flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Form Tips ────────────────────────────────────── */}
        <section className="bg-green-50 rounded-2xl border border-green-100 p-4">
          <h2 className="font-semibold text-green-800 mb-3">✅ เทคนิค Form</h2>
          <ul className="space-y-2.5">
            {ex.formTips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="text-green-500 shrink-0 mt-0.5 font-bold">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </section>

        {/* ── Mistakes ─────────────────────────────────────── */}
        {ex.commonMistakes.length > 0 && (
          <section className="bg-red-50 rounded-2xl border border-red-100 p-4">
            <h2 className="font-semibold text-red-800 mb-3">⚠️ ข้อผิดพลาดที่พบบ่อย</h2>
            <ul className="space-y-2.5">
              {ex.commonMistakes.map((m, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-red-400 shrink-0 mt-0.5 font-bold">•</span>
                  {m}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── YouTube ──────────────────────────────────────── */}
        <a
          href={ytSearch}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-red-600 text-white font-semibold text-sm active:bg-red-700"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.8 15.5V8.5l6.2 3.5-6.2 3.5z"/>
          </svg>
          ดูวิดีโอสาธิตบน YouTube
        </a>

      </div>
    </div>
  )
}
