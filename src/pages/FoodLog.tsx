import { useState } from 'react'
import { foods as baseFoods } from '../data/foods'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { FoodItem, FoodEntry, FoodGoals, MacroVals, MealKey, TdeeParams } from '../types'

type Screen = 'home' | 'search' | 'portion' | 'custom' | 'settings' | 'tdee'

const TH_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
const TH_DOW = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์']

const MEALS: { key: MealKey; label: string }[] = [
  { key: 'breakfast', label: 'มื้อเช้า' },
  { key: 'lunch', label: 'มื้อกลางวัน' },
  { key: 'dinner', label: 'มื้อเย็น' },
  { key: 'snack', label: 'ของว่าง' },
]

const CATS = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'meat', label: 'เนื้อสัตว์' },
  { key: 'carb', label: 'แป้ง/ข้าว' },
  { key: 'dish', label: 'อาหารจานเดียว' },
  { key: 'veg', label: 'ผัก' },
  { key: 'fruit', label: 'ผลไม้' },
  { key: 'other', label: 'อื่นๆ' },
]

const MACRO_DEFS = [
  { key: 'protein', label: 'โปรตีน', color: '#3a7d55' },
  { key: 'carb', label: 'คาร์บ', color: '#c99a3b' },
  { key: 'fat', label: 'ไขมัน', color: '#c0553f' },
  { key: 'sugar', label: 'น้ำตาล', color: '#a65a9c' },
] as const

const ACTIVITIES: { key: TdeeParams['activity']; label: string; sub: string; factor: number }[] = [
  { key: 'sedentary', label: 'แทบไม่ออกกำลัง', sub: 'นั่งทำงานเป็นหลัก', factor: 1.2 },
  { key: 'light', label: 'เบา', sub: 'ออกกำลัง 1–3 วัน/สัปดาห์', factor: 1.375 },
  { key: 'moderate', label: 'ปานกลาง', sub: 'ออกกำลัง 3–5 วัน/สัปดาห์', factor: 1.55 },
  { key: 'active', label: 'หนัก', sub: 'ออกกำลัง 6–7 วัน/สัปดาห์', factor: 1.725 },
  { key: 'vhard', label: 'หนักมาก', sub: 'ออกกำลังหนัก/นักกีฬา', factor: 1.9 },
]

const AIMS: { key: TdeeParams['aim']; label: string; delta: number }[] = [
  { key: 'lose', label: 'ลดน้ำหนัก', delta: -500 },
  { key: 'maintain', label: 'คงที่', delta: 0 },
  { key: 'gain', label: 'เพิ่มกล้าม', delta: 300 },
]

const dateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

const r = (n: number) => Math.round(n)
const r1 = (n: number) => Math.round(n * 10) / 10

const emptyCustom = { name: '', kcal: '', protein: '', carb: '', fat: '', sugar: '' }

export default function FoodLog() {
  const [screen, setScreen] = useState<Screen>('home')
  const [date, setDate] = useState(() => dateKey(new Date()))
  const [goals, setGoals] = useLocalStorage<FoodGoals>('calcal_goal_v1', {
    kcal: 1800,
    protein: 120,
    carb: 180,
    fat: 55,
    sugar: 36,
  })
  const [entries, setEntries] = useLocalStorage<Record<string, FoodEntry[]>>('calcal_entries_v1', {})
  const [customFoods, setCustomFoods] = useLocalStorage<FoodItem[]>('calcal_custom_v1', [])
  const [tdee, setTdee] = useLocalStorage<TdeeParams>('calcal_tdee_v1', {
    sex: 'male',
    age: 30,
    height: 170,
    weight: 65,
    activity: 'moderate',
    aim: 'lose',
  })

  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('all')
  const [sel, setSel] = useState<FoodItem | null>(null)
  const [grams, setGrams] = useState('100')
  const [cooked, setCooked] = useState(true)
  const [meal, setMeal] = useState<MealKey>('lunch')
  const [custom, setCustom] = useState(emptyCustom)

  const foods = [...customFoods, ...baseFoods]
  const todayEntries = entries[date] || []

  // ---- portion helpers ----
  const source = (): MacroVals => {
    if (!sel) return { kcal: 0, protein: 0, carb: 0, fat: 0, sugar: 0 }
    return (cooked && sel.cooked ? sel.cooked : sel.raw || sel.cooked) as MacroVals
  }
  const portion = (): MacroVals => {
    const s = source()
    const k = (Number(grams) || 0) / 100
    return { kcal: s.kcal * k, protein: s.protein * k, carb: s.carb * k, fat: s.fat * k, sugar: s.sugar * k }
  }

  const openFood = (f: FoodItem, m?: MealKey) => {
    setSel(f)
    setGrams(String(f.serving || 100))
    setCooked(true)
    if (m) setMeal(m)
    setScreen('portion')
  }

  const addEntry = () => {
    if (!sel) return
    const p = portion()
    const entry: FoodEntry = {
      id: Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      foodId: sel.id,
      name: sel.name,
      meal,
      grams: Number(grams) || 0,
      cooked: !!(cooked && sel.cooked),
      hasState: !!(sel.raw && sel.cooked),
      ...p,
    }
    setEntries(prev => ({ ...prev, [date]: [...(prev[date] || []), entry] }))
    setScreen('home')
    setQuery('')
    setCat('all')
  }

  const removeEntry = (id: string) => {
    setEntries(prev => ({ ...prev, [date]: (prev[date] || []).filter(e => e.id !== id) }))
  }

  const saveCustom = () => {
    if (!custom.name.trim()) return
    const num = (v: string) => Number(v) || 0
    const f: FoodItem = {
      id: 'custom_' + Date.now(),
      name: custom.name.trim(),
      cat: 'custom',
      serving: 100,
      cooked: {
        kcal: num(custom.kcal),
        protein: num(custom.protein),
        carb: num(custom.carb),
        fat: num(custom.fat),
        sugar: num(custom.sugar),
      },
    }
    setCustomFoods(prev => [f, ...prev])
    setCustom(emptyCustom)
    setSel(f)
    setGrams('100')
    setCooked(true)
    setScreen('portion')
  }

  const shiftDay = (delta: number) => {
    const [y, m, d] = date.split('-').map(Number)
    setDate(dateKey(new Date(y, m - 1, d + delta)))
  }

  // ---- derived (home) ----
  const sum = todayEntries.reduce(
    (a, e) => ({
      kcal: a.kcal + e.kcal,
      protein: a.protein + e.protein,
      carb: a.carb + e.carb,
      fat: a.fat + e.fat,
      sugar: a.sugar + e.sugar,
    }),
    { kcal: 0, protein: 0, carb: 0, fat: 0, sugar: 0 }
  )
  const eaten = r(sum.kcal)
  const remain = goals.kcal - eaten
  const pct = Math.max(0, Math.min(1, goals.kcal ? eaten / goals.kcal : 0))
  const over = remain < 0
  const ringColor = over ? '#c0553f' : pct > 0.85 ? '#c99a3b' : '#2f6d3f'

  const [yy, mm, dd] = date.split('-').map(Number)
  const dt = new Date(yy, mm - 1, dd)
  const isToday = date === dateKey(new Date())

  // ---- derived (tdee) ----
  const tw = Number(tdee.weight) || 0
  const th = Number(tdee.height) || 0
  const tage = Number(tdee.age) || 0
  const bmr = Math.max(0, Math.round(10 * tw + 6.25 * th - 5 * tage + (tdee.sex === 'male' ? 5 : -161)))
  const tdeeVal = Math.round(bmr * (ACTIVITIES.find(a => a.key === tdee.activity)?.factor || 1.55))
  const targetKcal = Math.max(0, tdeeVal + (AIMS.find(a => a.key === tdee.aim)?.delta || 0))
  const tProtein = Math.round(tw * 1.8)
  const tFat = Math.round((targetKcal * 0.25) / 9)
  const tCarb = Math.max(0, Math.round((targetKcal - tProtein * 4 - tFat * 9) / 4))

  const applyTdee = () => {
    setGoals({
      kcal: targetKcal,
      protein: tProtein,
      carb: tCarb,
      fat: tFat,
      sugar: Math.round((targetKcal * 0.08) / 4),
    })
    setScreen('settings')
  }

  // ---- shared bits ----
  const BackBtn = ({ to }: { to: Screen }) => (
    <button
      onClick={() => setScreen(to)}
      className="w-10 h-10 rounded-xl border border-[#e3e4df] bg-white text-lg text-[#5b5f56] flex-none"
    >
      ‹
    </button>
  )

  const segBtn = (active: boolean) =>
    `flex-1 py-3 rounded-xl text-[13.5px] font-semibold transition-colors ${
      active ? 'bg-white text-[#2f6d3f] shadow' : 'text-[#8a9083]'
    }`

  const chipBtn = (active: boolean) =>
    `px-3.5 py-2 rounded-xl border text-[12.5px] font-medium ${
      active ? 'bg-[#2f6d3f] border-[#2f6d3f] text-white' : 'bg-white border-[#e3e4df] text-[#5b5f56]'
    }`

  const mealChip = (active: boolean) =>
    `py-3 rounded-xl border text-[12.5px] font-semibold ${
      active ? 'bg-[#eaf3ec] border-[#2f6d3f] text-[#2f6d3f]' : 'bg-white border-[#e3e4df] text-[#5b5f56]'
    }`

  // ============ SEARCH ============
  if (screen === 'search') {
    const q = query.trim().toLowerCase()
    const filtered = foods.filter(f => (cat === 'all' || f.cat === cat) && (!q || f.name.toLowerCase().includes(q)))
    return (
      <div className="min-h-screen bg-[#fbfbf9] flex flex-col">
        <div className="px-5 pt-6 pb-3">
          <div className="flex items-center gap-3 mb-3.5">
            <BackBtn to="home" />
            <span className="text-lg font-bold">เพิ่มอาหาร</span>
          </div>
          <div className="flex items-center gap-2 bg-white border border-[#e3e4df] rounded-2xl px-3.5">
            <span className="text-[#adb2a6]">⌕</span>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="ค้นหาอาหาร เช่น หมู, ข้าว, กะเพรา"
              className="flex-1 border-none outline-none bg-transparent py-3 text-sm"
            />
          </div>
        </div>
        <div className="flex-1 px-5 pb-6">
          <div className="flex gap-1.5 flex-wrap mb-3.5">
            {CATS.map(c => (
              <button key={c.key} onClick={() => setCat(c.key)} className={chipBtn(cat === c.key)}>
                {c.label}
              </button>
            ))}
          </div>
          {filtered.length > 0 ? (
            <div className="flex flex-col gap-2">
              {filtered.map(f => {
                const base = (f.cooked || f.raw)!
                const both = !!(f.raw && f.cooked)
                return (
                  <button
                    key={f.id}
                    onClick={() => openFood(f)}
                    className="flex items-center gap-3 p-3.5 bg-white border border-[#eceded] rounded-2xl text-left w-full"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold">{f.name}</div>
                      <div className="text-[11.5px] text-[#9aa093] mt-0.5">
                        {both ? 'สลับดิบ/สุกได้ · ' : ''}P{base.protein} C{base.carb} F{base.fat}
                      </div>
                    </div>
                    <div className="text-right flex-none">
                      <div className="text-[15px] font-bold tabular-nums">{r(base.kcal)}</div>
                      <div className="text-[10px] text-[#adb2a6]">kcal /100ก.</div>
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-[#adb2a6]">
              <div className="text-sm">ไม่พบ “{query}”</div>
              <button
                onClick={() => setScreen('custom')}
                className="mt-4 px-5 py-3 rounded-xl border border-[#d7d9d3] bg-white text-[13.5px] text-[#3c4038]"
              >
                + เพิ่มอาหารเอง
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ============ PORTION ============
  if (screen === 'portion') {
    const pv = portion()
    const canToggle = !!(sel && sel.raw && sel.cooked)
    const pMacros = [
      { label: 'โปรตีน', color: '#3a7d55', val: r1(pv.protein) },
      { label: 'คาร์บ', color: '#c99a3b', val: r1(pv.carb) },
      { label: 'ไขมัน', color: '#c0553f', val: r1(pv.fat) },
      { label: 'น้ำตาล', color: '#a65a9c', val: r1(pv.sugar) },
    ]
    return (
      <div className="min-h-screen bg-[#fbfbf9] flex flex-col">
        <div className="flex items-center gap-3 px-5 pt-6 pb-3.5">
          <BackBtn to="search" />
          <span className="text-[17px] font-bold truncate">{sel?.name ?? ''}</span>
        </div>
        <div className="flex-1 px-5 pb-5">
          <div className="bg-white border border-[#eceded] rounded-3xl p-5 text-center">
            <div className="text-xs text-[#9aa093] font-medium">แคลอรี่ในส่วนนี้</div>
            <div className="text-5xl font-extrabold leading-tight text-[#2f6d3f] tabular-nums">{r(pv.kcal)}</div>
            <div className="text-xs text-[#adb2a6]">kcal</div>
            <div className="flex justify-center gap-2 mt-4">
              {pMacros.map(pm => (
                <div key={pm.label} className="flex-1 bg-[#f8f8f5] rounded-2xl py-2 px-1">
                  <div className="text-base font-bold tabular-nums" style={{ color: pm.color }}>
                    {pm.val}
                  </div>
                  <div className="text-[10px] text-[#9aa093] mt-0.5">{pm.label}</div>
                </div>
              ))}
            </div>
          </div>

          {canToggle && (
            <div className="mt-4">
              <div className="text-[12.5px] text-[#5b5f56] font-semibold mb-2">สภาพอาหาร</div>
              <div className="flex bg-[#f0f1ee] rounded-2xl p-1">
                <button onClick={() => setCooked(false)} className={segBtn(!cooked)}>
                  ดิบ
                </button>
                <button onClick={() => setCooked(true)} className={segBtn(cooked)}>
                  สุกแล้ว
                </button>
              </div>
              <div className="text-[11.5px] text-[#adb2a6] mt-1.5">
                {cooked ? 'ค่านี้คือน้ำหนักหลังปรุงสุกแล้ว' : 'ค่านี้คือน้ำหนักตอนดิบ (ก่อนปรุง)'}
              </div>
            </div>
          )}

          <div className="mt-4">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-[12.5px] text-[#5b5f56] font-semibold">น้ำหนัก</span>
              <span className="text-[11.5px] text-[#adb2a6]">ปกติ ~{sel?.serving ?? 100} ก.</span>
            </div>
            <div className="flex items-center gap-3 bg-white border border-[#e3e4df] rounded-2xl px-3 py-2">
              <button
                onClick={() => setGrams(String(Math.max(0, (Number(grams) || 0) - 10)))}
                className="w-11 h-11 rounded-xl bg-[#f0f1ee] text-xl text-[#3c4038] flex-none"
              >
                −
              </button>
              <div className="flex-1 text-center">
                <input
                  type="number"
                  value={grams}
                  onChange={e => setGrams(e.target.value)}
                  className="w-full border-none outline-none text-center text-[28px] font-extrabold bg-transparent tabular-nums"
                />
                <div className="text-[11px] text-[#adb2a6] -mt-0.5">กรัม</div>
              </div>
              <button
                onClick={() => setGrams(String((Number(grams) || 0) + 10))}
                className="w-11 h-11 rounded-xl bg-[#f0f1ee] text-xl text-[#3c4038] flex-none"
              >
                +
              </button>
            </div>
            <div className="flex gap-1.5 mt-2">
              {[50, 100, 150, 200].map(v => (
                <button
                  key={v}
                  onClick={() => setGrams(String(v))}
                  className="flex-1 py-2 rounded-xl border border-[#e3e4df] bg-white text-[12.5px] text-[#5b5f56]"
                >
                  {v}ก.
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <div className="text-[12.5px] text-[#5b5f56] font-semibold mb-2">มื้ออาหาร</div>
            <div className="grid grid-cols-4 gap-1.5">
              {MEALS.map(md => (
                <button key={md.key} onClick={() => setMeal(md.key)} className={mealChip(meal === md.key)}>
                  {md.label.replace('มื้อ', '').replace('ของ', '')}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="px-5 pt-3 pb-6 border-t border-[#f0f1ee] bg-[#fbfbf9]">
          <button
            onClick={addEntry}
            className="w-full py-4 rounded-2xl bg-[#2f6d3f] text-white text-[15.5px] font-bold"
          >
            เพิ่มลงบันทึก · {r(pv.kcal)} kcal
          </button>
        </div>
      </div>
    )
  }

  // ============ CUSTOM FOOD ============
  if (screen === 'custom') {
    const fields = [
      { key: 'kcal', label: 'แคลอรี่ (kcal)' },
      { key: 'protein', label: 'โปรตีน (ก.)' },
      { key: 'carb', label: 'คาร์บ (ก.)' },
      { key: 'fat', label: 'ไขมัน (ก.)' },
      { key: 'sugar', label: 'น้ำตาล (ก.)' },
    ] as const
    return (
      <div className="min-h-screen bg-[#fbfbf9] flex flex-col">
        <div className="flex items-center gap-3 px-5 pt-6 pb-3.5">
          <BackBtn to="search" />
          <span className="text-lg font-bold">เพิ่มอาหารเอง</span>
        </div>
        <div className="flex-1 px-5 pb-5 flex flex-col gap-3.5">
          <div>
            <div className="text-[12.5px] text-[#5b5f56] font-semibold mb-1.5">ชื่ออาหาร</div>
            <input
              value={custom.name}
              onChange={e => setCustom({ ...custom, name: e.target.value })}
              placeholder="เช่น ก๋วยเตี๋ยวเรือ"
              className="w-full border border-[#e3e4df] rounded-2xl px-3.5 py-3 text-sm outline-none bg-white"
            />
          </div>
          <div className="text-[11.5px] text-[#adb2a6] -mt-1">ใส่ค่าต่อ 100 กรัม (เว้นว่างได้ถ้าไม่มี)</div>
          <div className="grid grid-cols-2 gap-2.5">
            {fields.map(f => (
              <div key={f.key}>
                <div className="text-xs text-[#5b5f56] font-semibold mb-1">{f.label}</div>
                <input
                  type="number"
                  value={custom[f.key]}
                  onChange={e => setCustom({ ...custom, [f.key]: e.target.value })}
                  placeholder="0"
                  className="w-full border border-[#e3e4df] rounded-xl px-3 py-2.5 text-[15px] outline-none bg-white tabular-nums"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="px-5 pt-3 pb-6 border-t border-[#f0f1ee]">
          <button
            onClick={saveCustom}
            className="w-full py-4 rounded-2xl bg-[#2f6d3f] text-white text-[15.5px] font-bold disabled:opacity-40"
            disabled={!custom.name.trim()}
          >
            ถัดไป · ระบุน้ำหนัก
          </button>
        </div>
      </div>
    )
  }

  // ============ SETTINGS ============
  if (screen === 'settings') {
    const goalDefs = [
      { key: 'kcal', label: 'แคลอรี่', unit: 'kcal', color: '#2f6d3f' },
      { key: 'protein', label: 'โปรตีน', unit: 'ก.', color: '#3a7d55' },
      { key: 'carb', label: 'คาร์บ', unit: 'ก.', color: '#c99a3b' },
      { key: 'fat', label: 'ไขมัน', unit: 'ก.', color: '#c0553f' },
      { key: 'sugar', label: 'น้ำตาล', unit: 'ก.', color: '#a65a9c' },
    ] as const
    return (
      <div className="min-h-screen bg-[#fbfbf9] flex flex-col">
        <div className="flex items-center gap-3 px-5 pt-6 pb-3.5">
          <BackBtn to="home" />
          <span className="text-lg font-bold">เป้าหมายรายวัน</span>
        </div>
        <div className="flex-1 px-5 pb-5 flex flex-col gap-3.5">
          <button
            onClick={() => setScreen('tdee')}
            className="flex items-center justify-between w-full bg-[#eaf3ec] border border-[#cfe4d5] rounded-2xl px-4 py-3.5 text-left"
          >
            <span>
              <span className="block text-sm font-bold text-[#2f6d3f]">คำนวณ TDEE อัตโนมัติ</span>
              <span className="block text-[11.5px] text-[#5b8a68] mt-0.5">
                หาแคลที่ควรกินจากเพศ อายุ น้ำหนัก กิจกรรม
              </span>
            </span>
            <span className="text-lg text-[#2f6d3f]">›</span>
          </button>
          {goalDefs.map(gd => (
            <div
              key={gd.key}
              className="flex items-center justify-between bg-white border border-[#eceded] rounded-2xl px-4 py-3.5"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded" style={{ background: gd.color }} />
                <span className="text-sm font-medium">{gd.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  value={goals[gd.key]}
                  onChange={e => setGoals({ ...goals, [gd.key]: Number(e.target.value) || 0 })}
                  className="w-20 border border-[#e3e4df] rounded-xl px-2.5 py-2 text-base font-bold text-right outline-none bg-[#fbfbf9] tabular-nums"
                />
                <span className="text-xs text-[#adb2a6] w-7">{gd.unit}</span>
              </div>
            </div>
          ))}
          <div className="text-[11.5px] text-[#adb2a6] leading-relaxed mt-0.5">
            ค่าเหล่านี้ใช้คำนวณ “แคลเหลือ” และแถบมาโครในหน้าหลัก · ข้อมูลทั้งหมดถูกเก็บไว้ในเครื่องนี้เท่านั้น
          </div>
        </div>
      </div>
    )
  }

  // ============ TDEE ============
  if (screen === 'tdee') {
    const tFields = [
      { key: 'age', label: 'อายุ', unit: 'ปี' },
      { key: 'height', label: 'ส่วนสูง', unit: 'ซม.' },
      { key: 'weight', label: 'น้ำหนัก', unit: 'กก.' },
    ] as const
    return (
      <div className="min-h-screen bg-[#fbfbf9] flex flex-col">
        <div className="flex items-center gap-3 px-5 pt-6 pb-3.5">
          <BackBtn to="settings" />
          <span className="text-lg font-bold">คำนวณแคลที่ควรกิน (TDEE)</span>
        </div>
        <div className="flex-1 px-5 pb-5 flex flex-col gap-4">
          <div className="bg-white border border-[#eceded] rounded-3xl p-5 text-center">
            <div className="text-xs text-[#9aa093] font-medium">แนะนำต่อวันตามเป้าหมาย</div>
            <div className="text-5xl font-extrabold leading-tight text-[#2f6d3f] tabular-nums">{targetKcal}</div>
            <div className="text-xs text-[#adb2a6]">kcal / วัน</div>
            <div className="flex justify-center gap-5 mt-3.5">
              <div className="text-center">
                <div className="text-[17px] font-bold tabular-nums">{bmr}</div>
                <div className="text-[10.5px] text-[#9aa093] mt-0.5">BMR</div>
              </div>
              <div className="w-px bg-[#eceded]" />
              <div className="text-center">
                <div className="text-[17px] font-bold tabular-nums">{tdeeVal}</div>
                <div className="text-[10.5px] text-[#9aa093] mt-0.5">TDEE</div>
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-3.5">
              <div className="flex-1 bg-[#f8f8f5] rounded-2xl py-2 px-1">
                <div className="text-[15px] font-bold text-[#3a7d55] tabular-nums">{tProtein}</div>
                <div className="text-[10px] text-[#9aa093]">โปรตีน ก.</div>
              </div>
              <div className="flex-1 bg-[#f8f8f5] rounded-2xl py-2 px-1">
                <div className="text-[15px] font-bold text-[#c99a3b] tabular-nums">{tCarb}</div>
                <div className="text-[10px] text-[#9aa093]">คาร์บ ก.</div>
              </div>
              <div className="flex-1 bg-[#f8f8f5] rounded-2xl py-2 px-1">
                <div className="text-[15px] font-bold text-[#c0553f] tabular-nums">{tFat}</div>
                <div className="text-[10px] text-[#9aa093]">ไขมัน ก.</div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-[12.5px] text-[#5b5f56] font-semibold mb-2">เพศ</div>
            <div className="flex bg-[#f0f1ee] rounded-2xl p-1">
              <button onClick={() => setTdee({ ...tdee, sex: 'male' })} className={segBtn(tdee.sex === 'male')}>
                ชาย
              </button>
              <button onClick={() => setTdee({ ...tdee, sex: 'female' })} className={segBtn(tdee.sex === 'female')}>
                หญิง
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {tFields.map(tf => (
              <div key={tf.key}>
                <div className="text-xs text-[#5b5f56] font-semibold mb-1">{tf.label}</div>
                <input
                  type="number"
                  value={tdee[tf.key]}
                  onChange={e => setTdee({ ...tdee, [tf.key]: Number(e.target.value) || 0 })}
                  className="w-full border border-[#e3e4df] rounded-xl px-2.5 py-2.5 text-[17px] font-bold text-center outline-none bg-white tabular-nums"
                />
                <div className="text-[10.5px] text-[#adb2a6] text-center mt-1">{tf.unit}</div>
              </div>
            ))}
          </div>

          <div>
            <div className="text-[12.5px] text-[#5b5f56] font-semibold mb-2">ระดับกิจกรรม</div>
            <div className="flex flex-col gap-1.5">
              {ACTIVITIES.map(a => {
                const active = tdee.activity === a.key
                return (
                  <button
                    key={a.key}
                    onClick={() => setTdee({ ...tdee, activity: a.key })}
                    className={`flex flex-col gap-0.5 text-left px-3.5 py-3 rounded-2xl border ${
                      active ? 'border-[#2f6d3f] bg-[#eaf3ec] text-[#2f6d3f]' : 'border-[#e3e4df] bg-white text-[#3c4038]'
                    }`}
                  >
                    <span className="font-semibold text-[13.5px]">{a.label}</span>
                    <span className="text-[11.5px] opacity-70">{a.sub}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <div className="text-[12.5px] text-[#5b5f56] font-semibold mb-2">เป้าหมาย</div>
            <div className="grid grid-cols-3 gap-1.5">
              {AIMS.map(a => (
                <button key={a.key} onClick={() => setTdee({ ...tdee, aim: a.key })} className={mealChip(tdee.aim === a.key)}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
          <div className="text-[11.5px] text-[#adb2a6] leading-relaxed">
            ใช้สูตร Mifflin-St Jeor · เป็นค่าประมาณ ใช้เป็นจุดเริ่มต้นแล้วปรับตามผลจริงได้
          </div>
        </div>
        <div className="px-5 pt-3 pb-6 border-t border-[#f0f1ee]">
          <button
            onClick={applyTdee}
            className="w-full py-4 rounded-2xl bg-[#2f6d3f] text-white text-[15.5px] font-bold"
          >
            ใช้ค่านี้เป็นเป้าหมายรายวัน
          </button>
        </div>
      </div>
    )
  }

  // ============ HOME ============
  return (
    <div className="min-h-screen bg-[#fbfbf9] px-5 pt-6 pb-28">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs tracking-widest uppercase text-[#9aa093] font-semibold">
            {isToday ? 'วันนี้' : TH_DOW[dt.getDay()]}
          </div>
          <div className="text-[22px] font-bold mt-0.5">
            {dt.getDate()} {TH_MONTHS[dt.getMonth()]}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => shiftDay(-1)} className="w-10 h-10 rounded-xl border border-[#e3e4df] bg-white text-lg text-[#5b5f56]">
            ‹
          </button>
          <button onClick={() => shiftDay(1)} className="w-10 h-10 rounded-xl border border-[#e3e4df] bg-white text-lg text-[#5b5f56]">
            ›
          </button>
          <button onClick={() => setScreen('settings')} className="w-10 h-10 rounded-xl border border-[#e3e4df] bg-white text-[15px] text-[#5b5f56]">
            ⚙
          </button>
        </div>
      </div>

      {/* Calorie ring */}
      <div className="bg-white border border-[#eceded] rounded-[26px] px-5 pt-6 pb-5 shadow-sm">
        <div className="relative w-[212px] h-[212px] mx-auto mb-1.5">
          <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
            <circle cx="100" cy="100" r="88" fill="none" stroke="#f0f1ee" strokeWidth="15" />
            <circle
              cx="100"
              cy="100"
              r="88"
              fill="none"
              stroke={ringColor}
              strokeWidth="15"
              strokeLinecap="round"
              strokeDasharray="552.9"
              strokeDashoffset={552.9 * (1 - pct)}
              style={{ transition: 'stroke-dashoffset .5s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div
              className="text-[52px] font-extrabold leading-none tracking-tight tabular-nums"
              style={{ color: over ? '#c0553f' : '#1c1e1b' }}
            >
              {Math.abs(remain)}
            </div>
            <div className="text-[13px] text-[#9aa093] mt-1.5 font-medium">
              {over ? 'เกินเป้าหมาย' : 'แคลที่เหลือ'}
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-6 mt-1.5">
          <div className="text-center">
            <div className="text-[19px] font-bold tabular-nums">{eaten}</div>
            <div className="text-[11px] text-[#9aa093] mt-0.5">กินแล้ว</div>
          </div>
          <div className="w-px bg-[#eceded]" />
          <div className="text-center">
            <div className="text-[19px] font-bold tabular-nums">{goals.kcal}</div>
            <div className="text-[11px] text-[#9aa093] mt-0.5">เป้าหมาย</div>
          </div>
        </div>
      </div>

      {/* Macro cards */}
      <div className="grid grid-cols-2 gap-2.5 mt-3.5">
        {MACRO_DEFS.map(m => {
          const e = sum[m.key]
          const goal = goals[m.key] || 0
          const mp = goal ? Math.max(0, Math.min(100, (e / goal) * 100)) : 0
          return (
            <div key={m.key} className="bg-white border border-[#eceded] rounded-2xl px-3.5 py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-[12.5px] text-[#5b5f56] font-medium">
                  <span className="w-2 h-2 rounded" style={{ background: m.color }} />
                  {m.label}
                </span>
                <span className="text-[11px] text-[#adb2a6] tabular-nums">/ {goal}ก.</span>
              </div>
              <div className="text-xl font-bold leading-none tabular-nums">
                {r(e)}
                <span className="text-xs text-[#adb2a6] font-medium"> ก.</span>
              </div>
              <div className="h-1.5 bg-[#f0f1ee] rounded mt-2 overflow-hidden">
                <div
                  className="h-full rounded transition-all"
                  style={{ background: m.color, width: `${mp}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Meals */}
      <div className="mt-5 flex flex-col gap-3.5">
        {MEALS.map(md => {
          const items = todayEntries.filter(e => e.meal === md.key)
          const mealKcal = r(items.reduce((a, e) => a + e.kcal, 0))
          return (
            <div key={md.key}>
              <div className="flex items-baseline justify-between mx-1 mb-2">
                <span className="text-[15px] font-bold">{md.label}</span>
                <span className="text-[13px] text-[#9aa093] font-semibold tabular-nums">
                  {mealKcal} <span className="font-normal">kcal</span>
                </span>
              </div>
              <div className="bg-white border border-[#eceded] rounded-2xl overflow-hidden">
                {items.length === 0 && (
                  <button
                    onClick={() => {
                      setMeal(md.key)
                      setScreen('search')
                    }}
                    className="w-full p-4 text-left text-[#adb2a6] text-[13.5px]"
                  >
                    + เพิ่มรายการ
                  </button>
                )}
                {items.map(e => (
                  <div key={e.id} className="flex items-center gap-3 px-3.5 py-3 border-t first:border-t-0 border-[#f4f5f2]">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{e.name}</div>
                      <div className="text-[11.5px] text-[#9aa093] mt-0.5">
                        {r(e.grams)} ก.{e.hasState ? ` · ${e.cooked ? 'สุก' : 'ดิบ'}` : ''} · P{r(e.protein)} C
                        {r(e.carb)} F{r(e.fat)}
                      </div>
                    </div>
                    <span className="text-sm font-bold tabular-nums">{r(e.kcal)}</span>
                    <button
                      onClick={() => removeEntry(e.id)}
                      className="w-7 h-7 rounded-lg bg-[#f6f2f2] text-[#c58d84] text-[13px] flex-none"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* FAB */}
      <button
        onClick={() => setScreen('search')}
        className="fixed left-1/2 -translate-x-1/2 w-14 h-14 rounded-[20px] bg-[#2f6d3f] text-white text-3xl font-light shadow-lg shadow-[#2f6d3f]/40 z-40 flex items-center justify-center pb-1"
        style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 76px)' }}
      >
        +
      </button>
    </div>
  )
}
