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

// Shared base body silhouette paths (same for front and back views)
function BodyBase() {
  return (
    <>
      {/* Head */}
      <circle cx="60" cy="14" r="12" fill={BASE} />
      {/* Neck */}
      <rect x="55" y="26" width="10" height="11" rx="3" fill={BASE} />
      {/* Torso: wide shoulders → waist taper → slight hip flare */}
      <path d="M 28 40 C 16 54 16 82 20 104 C 23 116 32 124 38 126 L 82 126 C 88 124 97 116 100 104 C 104 82 104 54 92 40 C 80 34 40 34 28 40 Z" fill={BASE} />
      {/* Left upper arm */}
      <path d="M 12 44 C 5 58 3 82 6 102 C 8 110 18 112 22 106 C 26 100 26 78 24 58 C 22 46 16 40 12 44 Z" fill={BASE} />
      {/* Right upper arm */}
      <path d="M 108 44 C 115 58 117 82 114 102 C 112 110 102 112 98 106 C 94 100 94 78 96 58 C 98 46 104 40 108 44 Z" fill={BASE} />
      {/* Left forearm */}
      <path d="M 5 104 C 0 118 0 142 2 160 C 4 168 14 170 18 166 C 22 162 22 140 20 120 C 18 108 12 104 Z" fill={BASE} />
      {/* Right forearm */}
      <path d="M 115 104 C 120 118 120 142 118 160 C 116 168 106 170 102 166 C 98 162 98 140 100 120 C 102 108 108 104 Z" fill={BASE} />
      {/* Left thigh */}
      <path d="M 36 128 C 28 148 26 176 28 200 C 30 212 40 218 50 216 C 58 214 62 208 62 200 C 62 180 62 154 60 130 Z" fill={BASE} />
      {/* Right thigh */}
      <path d="M 84 128 C 92 148 94 176 92 200 C 90 212 80 218 70 216 C 62 214 58 208 58 200 C 58 180 58 154 60 130 Z" fill={BASE} />
      {/* Left calf */}
      <path d="M 27 202 C 22 218 21 244 23 262 C 25 272 35 276 42 274 C 50 272 53 264 53 254 C 54 238 52 216 48 202 Z" fill={BASE} />
      {/* Right calf */}
      <path d="M 93 202 C 98 218 99 244 97 262 C 95 272 85 276 78 274 C 70 272 67 264 67 254 C 66 238 68 216 72 202 Z" fill={BASE} />
    </>
  )
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

        {/* ── FRONT ───────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-1">
          <svg viewBox="0 0 120 280" className="h-52 w-auto">
            <BodyBase />

            {/* Shoulders (front delts) */}
            <ellipse cx="15" cy="56" rx="13" ry="9" fill={f('shoulders')} />
            <ellipse cx="105" cy="56" rx="13" ry="9" fill={f('shoulders')} />

            {/* Chest — left pec */}
            <path d="M 30 44 C 30 42 46 38 60 41 L 60 78 C 52 82 38 78 30 70 Z" fill={f('chest')} />
            {/* Chest — right pec */}
            <path d="M 90 44 C 90 42 74 38 60 41 L 60 78 C 68 82 82 78 90 70 Z" fill={f('chest')} />

            {/* Biceps */}
            <path d="M 7 50 C 3 64 3 86 6 100 C 10 110 22 110 24 102 C 26 92 24 68 20 52 Z" fill={f('biceps')} />
            <path d="M 113 50 C 117 64 117 86 114 100 C 110 110 98 110 96 102 C 94 92 96 68 100 52 Z" fill={f('biceps')} />

            {/* Forearms */}
            <path d="M 4 106 C 0 120 0 142 2 160 C 4 168 16 170 20 162 C 22 150 20 126 18 108 Z" fill={f('forearms')} />
            <path d="M 116 106 C 120 120 120 142 118 160 C 116 168 104 170 100 162 C 98 150 100 126 102 108 Z" fill={f('forearms')} />

            {/* Abs — 6 sections */}
            {[82, 98, 114].map(y => (
              <g key={y}>
                <rect x="42" y={y} width="12" height="13" rx="4" fill={f('abs')} />
                <rect x="66" y={y} width="12" height="13" rx="4" fill={f('abs')} />
              </g>
            ))}

            {/* Quads */}
            <path d="M 36 130 C 28 150 26 178 28 202 C 32 212 44 218 52 214 C 58 210 62 202 62 194 C 62 174 60 148 58 130 Z" fill={f('quads')} />
            <path d="M 84 130 C 92 150 94 178 92 202 C 88 212 76 218 68 214 C 62 210 58 202 58 194 C 58 174 60 148 62 130 Z" fill={f('quads')} />

            {/* Calves */}
            <path d="M 26 204 C 21 220 20 246 22 262 C 24 272 36 276 43 274 C 50 272 54 264 53 252 C 52 236 50 212 46 204 Z" fill={f('calves')} />
            <path d="M 94 204 C 99 220 100 246 98 262 C 96 272 84 276 77 274 C 70 272 66 264 67 252 C 68 236 70 212 74 204 Z" fill={f('calves')} />
          </svg>
          <span className="text-xs text-gray-400">ด้านหน้า</span>
        </div>

        {/* ── BACK ────────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-1">
          <svg viewBox="0 0 120 280" className="h-52 w-auto">
            <BodyBase />

            {/* Rear delts */}
            <ellipse cx="15" cy="56" rx="13" ry="9" fill={f('shoulders')} />
            <ellipse cx="105" cy="56" rx="13" ry="9" fill={f('shoulders')} />

            {/* Traps + upper back */}
            <path d="M 30 42 C 44 37 76 37 90 42 L 88 72 C 74 78 46 78 32 72 Z" fill={f('upper-back')} />

            {/* Lats */}
            <path d="M 24 70 C 18 88 18 112 24 128 C 30 136 40 138 46 132 C 50 126 50 104 50 84 C 50 70 42 62 36 62 Z" fill={f('lats')} />
            <path d="M 96 70 C 102 88 102 112 96 128 C 90 136 80 138 74 132 C 70 126 70 104 70 84 C 70 70 78 62 84 62 Z" fill={f('lats')} />

            {/* Lower back */}
            <path d="M 42 98 C 38 112 38 122 44 126 C 52 130 68 130 76 126 C 82 122 82 112 78 98 Z" fill={f('lower-back')} />

            {/* Triceps */}
            <path d="M 7 50 C 3 64 3 86 6 100 C 10 110 22 110 24 102 C 26 92 24 68 20 52 Z" fill={f('triceps')} />
            <path d="M 113 50 C 117 64 117 86 114 100 C 110 110 98 110 96 102 C 94 92 96 68 100 52 Z" fill={f('triceps')} />

            {/* Forearms */}
            <path d="M 4 106 C 0 120 0 142 2 160 C 4 168 16 170 20 162 C 22 150 20 126 18 108 Z" fill={f('forearms')} />
            <path d="M 116 106 C 120 120 120 142 118 160 C 116 168 104 170 100 162 C 98 150 100 126 102 108 Z" fill={f('forearms')} />

            {/* Glutes */}
            <path d="M 36 128 C 28 142 28 158 36 166 C 46 172 60 174 60 170 L 60 128 Z" fill={f('glutes')} />
            <path d="M 84 128 C 92 142 92 158 84 166 C 74 172 60 174 60 170 L 60 128 Z" fill={f('glutes')} />

            {/* Hamstrings */}
            <path d="M 35 168 C 28 186 26 208 28 224 C 31 234 42 238 51 234 C 57 230 62 220 62 212 C 62 196 60 174 58 170 Z" fill={f('hamstrings')} />
            <path d="M 85 168 C 92 186 94 208 92 224 C 89 234 78 238 69 234 C 63 230 58 220 58 212 C 58 196 60 174 62 170 Z" fill={f('hamstrings')} />

            {/* Calves */}
            <path d="M 26 226 C 21 242 20 260 22 272 C 24 278 36 280 43 278 C 50 276 54 268 53 256 C 52 242 50 228 46 226 Z" fill={f('calves')} />
            <path d="M 94 226 C 99 242 100 260 98 272 C 96 278 84 280 77 278 C 70 276 66 268 67 256 C 68 242 70 228 74 226 Z" fill={f('calves')} />
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
