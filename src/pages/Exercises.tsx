import { useState } from 'react'
import { exercises, categoryLabels, categorySubGroups } from '../data/exercises'
import ExerciseCard from '../components/ExerciseCard'
import type { ExerciseCategory, Page } from '../types'

interface Props {
  onNavigate: (page: Page, exerciseId?: string) => void
}

const categories: { value: ExerciseCategory | 'all'; label: string }[] = [
  { value: 'all', label: '🔥 ทั้งหมด' },
  { value: 'weights', label: categoryLabels.weights },
  { value: 'bodyweight', label: categoryLabels.bodyweight },
  { value: 'cardio', label: categoryLabels.cardio },
]

export default function Exercises({ onNavigate }: Props) {
  const [filter, setFilter] = useState<ExerciseCategory | 'all'>('all')
  const [subFilter, setSubFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  function handleCategoryChange(val: ExerciseCategory | 'all') {
    setFilter(val)
    setSubFilter('all')
  }

  const subGroups = filter !== 'all' ? categorySubGroups[filter] : null

  const filtered = exercises.filter(ex => {
    const matchCat = filter === 'all' || ex.category === filter
    const matchSub = subFilter === 'all' || ex.muscleGroup === subFilter
    const q = search.toLowerCase()
    const matchSearch = !q || ex.nameTh.includes(q) || ex.nameEn.toLowerCase().includes(q)
    return matchCat && matchSub && matchSearch
  })

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 bg-gray-50 z-10 pt-4 pb-2 px-4 space-y-3">
        <h1 className="text-xl font-bold text-gray-900">ท่าออกกำลังกาย</h1>
        <input
          type="search"
          placeholder="ค้นหาท่า..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        {/* Main category filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(c => (
            <button
              key={c.value}
              onClick={() => handleCategoryChange(c.value)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === c.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Sub-category filter (shown when a main category is selected) */}
        {subGroups && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {subGroups.map(sg => (
              <button
                key={sg.value}
                onClick={() => setSubFilter(sg.value)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  subFilter === sg.value
                    ? 'bg-gray-800 text-white'
                    : 'bg-white text-gray-500 border border-gray-200'
                }`}
              >
                {sg.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 pt-2">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 mt-12">ไม่พบท่าที่ค้นหา</p>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-gray-400">{filtered.length} ท่า</p>
            {filtered.map(ex => (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                onClick={() => onNavigate('detail', ex.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
