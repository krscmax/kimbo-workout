import type { Page } from '../types'

interface Props {
  current: Page
  onChange: (p: Page) => void
}

const items: { page: Page; icon: string; label: string }[] = [
  { page: 'home', icon: '🏠', label: 'หน้าหลัก' },
  { page: 'exercises', icon: '💪', label: 'ท่า' },
  { page: 'food', icon: '🍚', label: 'อาหาร' },
  { page: 'plan', icon: '📅', label: 'แผน' },
  { page: 'progress', icon: '📊', label: 'Progress' },
  { page: 'timer', icon: '⏱', label: 'Timer' },
]

export default function BottomNav({ current, onChange }: Props) {
  const active = current === 'detail' ? 'exercises' : current

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom z-50">
      <div className="flex max-w-lg mx-auto">
        {items.map(({ page, icon, label }) => (
          <button
            key={page}
            onClick={() => onChange(page)}
            className={`flex-1 flex flex-col items-center py-2 gap-0.5 transition-colors ${
              active === page
                ? 'text-orange-500'
                : 'text-gray-400 active:text-orange-400'
            }`}
          >
            <span className="text-xl leading-none">{icon}</span>
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
