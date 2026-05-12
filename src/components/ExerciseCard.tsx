import type { Exercise } from '../types'
import { categoryLabels, difficultyLabels, difficultyColors } from '../data/exercises'

interface Props {
  exercise: Exercise
  onClick: () => void
}

const categoryBg: Record<string, string> = {
  weights: 'bg-blue-50 border-blue-100',
  bodyweight: 'bg-green-50 border-green-100',
  cardio: 'bg-red-50 border-red-100',
}

export default function ExerciseCard({ exercise, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border p-4 ${categoryBg[exercise.category]} active:scale-[0.98] transition-transform`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">{exercise.nameTh}</p>
          <p className="text-xs text-gray-500 mt-0.5">{exercise.nameEn}</p>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${difficultyColors[exercise.difficulty]}`}>
          {difficultyLabels[exercise.difficulty]}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <span className="text-xs bg-white/80 rounded-full px-2 py-0.5 text-gray-600">
          {categoryLabels[exercise.category]}
        </span>
        {exercise.primaryMuscles.slice(0, 2).map(m => (
          <span key={m} className="text-xs bg-white/80 rounded-full px-2 py-0.5 text-gray-600">
            {m}
          </span>
        ))}
      </div>
      <p className="mt-2 text-xs text-gray-500">{exercise.setsReps}</p>
    </button>
  )
}
