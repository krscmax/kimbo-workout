import { exercises, categoryLabels, difficultyLabels, difficultyColors } from '../data/exercises'
import type { Page } from '../types'

interface Props {
  exerciseId: string
  onNavigate: (page: Page) => void
  onStartTimer: (restSeconds: number) => void
}

export default function ExerciseDetail({ exerciseId, onNavigate, onStartTimer }: Props) {
  const ex = exercises.find(e => e.id === exerciseId)
  if (!ex) return null

  const ytSearch = `https://www.youtube.com/results?search_query=${encodeURIComponent(ex.nameEn + ' form tutorial')}`

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-6">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-4 pt-4 pb-3 border-b border-gray-100">
        <button
          onClick={() => onNavigate('exercises')}
          className="flex items-center gap-1.5 text-orange-500 text-sm font-medium mb-2"
        >
          ← กลับ
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{ex.nameTh}</h1>
        <p className="text-gray-500 text-sm">{ex.nameEn}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="text-xs bg-orange-50 text-orange-600 rounded-full px-2.5 py-1 font-medium">
            {categoryLabels[ex.category]}
          </span>
          <span className={`text-xs rounded-full px-2.5 py-1 font-medium ${difficultyColors[ex.difficulty]}`}>
            {difficultyLabels[ex.difficulty]}
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2.5 py-1">
            🏋️ {ex.equipment}
          </span>
        </div>
      </div>

      <div className="px-4 space-y-5 mt-4">
        {/* Muscles */}
        <section>
          <h2 className="font-semibold text-gray-800 mb-2">กล้ามเนื้อที่ใช้</h2>
          <div className="flex flex-wrap gap-2">
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
          {ex.secondaryMuscles.length > 0 && (
            <p className="text-xs text-gray-400 mt-1.5">
              <span className="inline-block w-3 h-3 bg-orange-100 rounded-full mr-1 align-middle" />หลัก
              <span className="inline-block w-3 h-3 bg-gray-100 rounded-full mx-1 ml-3 align-middle" />รอง
            </p>
          )}
        </section>

        {/* Sets / Reps */}
        <section className="bg-orange-50 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-orange-600 font-medium">แนะนำสำหรับลดน้ำหนัก</p>
            <p className="text-lg font-bold text-gray-900 mt-0.5">{ex.setsReps}</p>
          </div>
          {ex.restSeconds > 0 && (
            <button
              onClick={() => onStartTimer(ex.restSeconds)}
              className="bg-orange-500 text-white text-sm font-medium px-4 py-2 rounded-xl active:bg-orange-600"
            >
              ⏱ {ex.restSeconds}s
            </button>
          )}
        </section>

        {/* Steps */}
        <section>
          <h2 className="font-semibold text-gray-800 mb-3">วิธีทำ</h2>
          <ol className="space-y-3">
            {ex.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 w-6 h-6 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed pt-0.5">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Form Tips */}
        <section>
          <h2 className="font-semibold text-gray-800 mb-3">✅ เทคนิค Form</h2>
          <ul className="space-y-2">
            {ex.formTips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="text-green-500 shrink-0 mt-0.5">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </section>

        {/* Common Mistakes */}
        {ex.commonMistakes.length > 0 && (
          <section>
            <h2 className="font-semibold text-gray-800 mb-3">⚠️ ข้อผิดพลาดที่พบบ่อย</h2>
            <ul className="space-y-2">
              {ex.commonMistakes.map((m, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-red-400 shrink-0 mt-0.5">•</span>
                  {m}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* YouTube */}
        <a
          href={ytSearch}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 font-medium text-sm active:bg-red-100"
        >
          ▶ ดูวิดีโอตัวอย่างบน YouTube
        </a>
      </div>
    </div>
  )
}
