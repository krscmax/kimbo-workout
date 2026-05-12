const BASE = '#e5e7eb'
const PRIMARY = '#f97316'
const SECONDARY = '#fdba74'

const MUSCLE_GROUPS: Record<string, string[]> = {
  chest:        ['อกบน', 'อกล่าง', 'อก'],
  shoulders:    ['หัวไหล่หน้า', 'หัวไหล่กลาง', 'หัวไหล่', 'Rear Delt'],
  biceps:       ['Biceps'],
  triceps:      ['ไทรเซ็ป'],
  forearms:     ['Brachialis', 'Brachioradialis'],
  abs:          ['Core', 'Abs', 'แกนกลาง (Core)', 'แกนกลาง'],
  lats:         ['กล้ามหลังกว้าง (Lats)', 'กล้ามหลังกว้าง'],
  'upper-back': ['กล้ามหลังกลาง', 'หลังบน', 'Trap'],
  'lower-back': ['หลังล่าง'],
  glutes:       ['กล้ามก้น', 'กล้ามก้น (Glutes)'],
  quads:        ['ต้นขาหน้า', 'ต้นขาหน้า (Quads)'],
  hamstrings:   ['ต้นขาหลัง', 'ต้นขาหลัง (Hamstrings)'],
  calves:       ['น่อง'],
}

function activation(primary: string[], secondary: string[]) {
  const map = new Map<string, 'primary' | 'secondary'>()
  for (const [group, names] of Object.entries(MUSCLE_GROUPS)) {
    if (primary.some(m => names.includes(m))) map.set(group, 'primary')
    else if (secondary.some(m => names.includes(m))) map.set(group, 'secondary')
  }
  return map
}

function c(map: Map<string, 'primary' | 'secondary'>, muscle: string) {
  const s = map.get(muscle)
  return s === 'primary' ? PRIMARY : s === 'secondary' ? SECONDARY : BASE
}

interface Props {
  primaryMuscles: string[]
  secondaryMuscles: string[]
}

export default function MuscleDiagram({ primaryMuscles, secondaryMuscles }: Props) {
  const isFullBody = primaryMuscles.some(m => m.includes('Full Body') || m.includes('Cardio'))
  const act = activation(primaryMuscles, secondaryMuscles)
  const f = (m: string) => c(act, m)

  if (isFullBody) {
    return (
      <div className="flex items-center justify-center h-40 rounded-2xl bg-orange-50 text-orange-500 font-semibold text-sm">
        🔥 Full Body — ใช้กล้ามเนื้อทั้งตัว
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-center gap-6">
        {/* FRONT */}
        <div className="flex flex-col items-center gap-1">
          <svg viewBox="0 0 120 270" className="h-52 w-auto">
            {/* body backgrounds */}
            <circle cx="60" cy="18" r="14" fill={BASE} />
            <rect x="53" y="32" width="14" height="12" rx="4" fill={BASE} />
            <rect x="35" y="44" width="50" height="94" rx="8" fill={BASE} />
            <rect x="37" y="136" width="46" height="16" rx="4" fill={BASE} />
            <rect x="13" y="54" width="14" height="84" rx="6" fill={BASE} />
            <rect x="93" y="54" width="14" height="84" rx="6" fill={BASE} />
            <rect x="37" y="150" width="46" height="116" rx="8" fill={BASE} />

            {/* shoulders */}
            <ellipse cx="24" cy="60" rx="16" ry="10" fill={f('shoulders')} />
            <ellipse cx="96" cy="60" rx="16" ry="10" fill={f('shoulders')} />

            {/* chest */}
            <rect x="36" y="48" width="24" height="36" rx="4" fill={f('chest')} />
            <rect x="60" y="48" width="24" height="36" rx="4" fill={f('chest')} />

            {/* abs */}
            {[86, 101, 116].map(y => (
              <>
                <rect key={`al${y}`} x="38" y={y} width="10" height="12" rx="3" fill={f('abs')} />
                <rect key={`ar${y}`} x="52" y={y} width="10" height="12" rx="3" fill={f('abs')} />
              </>
            ))}

            {/* biceps */}
            <rect x="13" y="54" width="14" height="44" rx="6" fill={f('biceps')} />
            <rect x="93" y="54" width="14" height="44" rx="6" fill={f('biceps')} />

            {/* forearms */}
            <rect x="7" y="100" width="12" height="36" rx="5" fill={f('forearms')} />
            <rect x="101" y="100" width="12" height="36" rx="5" fill={f('forearms')} />

            {/* quads */}
            <rect x="37" y="152" width="22" height="62" rx="8" fill={f('quads')} />
            <rect x="61" y="152" width="22" height="62" rx="8" fill={f('quads')} />

            {/* calves */}
            <rect x="39" y="216" width="18" height="50" rx="7" fill={f('calves')} />
            <rect x="63" y="216" width="18" height="50" rx="7" fill={f('calves')} />
          </svg>
          <span className="text-xs text-gray-400">ด้านหน้า</span>
        </div>

        {/* BACK */}
        <div className="flex flex-col items-center gap-1">
          <svg viewBox="0 0 120 270" className="h-52 w-auto">
            {/* body backgrounds */}
            <circle cx="60" cy="18" r="14" fill={BASE} />
            <rect x="53" y="32" width="14" height="12" rx="4" fill={BASE} />
            <rect x="35" y="44" width="50" height="94" rx="8" fill={BASE} />
            <rect x="37" y="136" width="46" height="16" rx="4" fill={BASE} />
            <rect x="13" y="54" width="14" height="84" rx="6" fill={BASE} />
            <rect x="93" y="54" width="14" height="84" rx="6" fill={BASE} />
            <rect x="37" y="150" width="46" height="116" rx="8" fill={BASE} />

            {/* rear delts / shoulders */}
            <ellipse cx="24" cy="60" rx="16" ry="10" fill={f('shoulders')} />
            <ellipse cx="96" cy="60" rx="16" ry="10" fill={f('shoulders')} />

            {/* traps + upper back */}
            <rect x="38" y="44" width="44" height="22" rx="4" fill={f('upper-back')} />
            <rect x="40" y="68" width="40" height="22" rx="4" fill={f('upper-back')} />

            {/* lats */}
            <path d="M36,70 L17,102 L18,134 L36,132 Z" fill={f('lats')} />
            <path d="M84,70 L103,102 L102,134 L84,132 Z" fill={f('lats')} />

            {/* lower back */}
            <rect x="40" y="92" width="40" height="40" rx="4" fill={f('lower-back')} />

            {/* triceps */}
            <rect x="13" y="54" width="14" height="44" rx="6" fill={f('triceps')} />
            <rect x="93" y="54" width="14" height="44" rx="6" fill={f('triceps')} />

            {/* forearms */}
            <rect x="7" y="100" width="12" height="36" rx="5" fill={f('forearms')} />
            <rect x="101" y="100" width="12" height="36" rx="5" fill={f('forearms')} />

            {/* glutes */}
            <rect x="37" y="152" width="23" height="22" rx="8" fill={f('glutes')} />
            <rect x="60" y="152" width="23" height="22" rx="8" fill={f('glutes')} />

            {/* hamstrings */}
            <rect x="37" y="176" width="22" height="40" rx="8" fill={f('hamstrings')} />
            <rect x="61" y="176" width="22" height="40" rx="8" fill={f('hamstrings')} />

            {/* calves */}
            <rect x="39" y="218" width="18" height="48" rx="7" fill={f('calves')} />
            <rect x="63" y="218" width="18" height="48" rx="7" fill={f('calves')} />
          </svg>
          <span className="text-xs text-gray-400">ด้านหลัง</span>
        </div>
      </div>

      {/* legend */}
      <div className="flex justify-center gap-5 mt-2">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <div className="w-3 h-3 rounded bg-orange-500" />
          กล้ามเนื้อหลัก
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <div className="w-3 h-3 rounded bg-orange-300" />
          กล้ามเนื้อรอง
        </div>
      </div>
    </div>
  )
}
