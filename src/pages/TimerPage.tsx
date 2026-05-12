import { useState, useEffect, useRef } from 'react'

interface Props {
  initialSeconds?: number
}

function beep(ctx: AudioContext, freq: number, duration: number) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.frequency.value = freq
  osc.type = 'sine'
  gain.gain.setValueAtTime(0.4, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + duration)
}

function playDone(ctx: AudioContext) {
  beep(ctx, 880, 0.15)
  setTimeout(() => beep(ctx, 1100, 0.25), 150)
}

const PRESETS = [30, 45, 60, 90, 120, 180]

export default function TimerPage({ initialSeconds = 60 }: Props) {
  const [duration, setDuration] = useState(initialSeconds)
  const [remaining, setRemaining] = useState(initialSeconds)
  const [running, setRunning] = useState(false)
  const [sets, setSets] = useState(0)
  const audioRef = useRef<AudioContext | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setRemaining(duration)
    setRunning(false)
  }, [duration])

  useEffect(() => {
    if (initialSeconds !== 60) {
      setDuration(initialSeconds)
    }
  }, [initialSeconds])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            setRunning(false)
            setSets(s => s + 1)
            if (!audioRef.current) audioRef.current = new AudioContext()
            playDone(audioRef.current)
            return duration
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running, duration])

  const pct = remaining / duration
  const circumference = 2 * Math.PI * 90
  const strokeDash = circumference * pct
  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60

  const handleToggle = () => {
    if (!audioRef.current) audioRef.current = new AudioContext()
    setRunning(r => !r)
  }

  const handleReset = () => {
    setRunning(false)
    setRemaining(duration)
  }

  return (
    <div className="flex flex-col h-full items-center px-4 pt-4 pb-4">
      <h1 className="text-xl font-bold text-gray-900 self-start">Rest Timer</h1>

      {/* Presets */}
      <div className="flex gap-2 mt-4 flex-wrap justify-center">
        {PRESETS.map(s => (
          <button
            key={s}
            onClick={() => setDuration(s)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              duration === s
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 active:bg-gray-200'
            }`}
          >
            {s >= 60 ? `${s / 60}m` : `${s}s`}
          </button>
        ))}
      </div>

      {/* Circular Timer */}
      <div className="relative mt-8 mb-6">
        <svg width={220} height={220} viewBox="0 0 220 220">
          <circle
            cx={110} cy={110} r={90}
            fill="none" stroke="#f3f4f6" strokeWidth={12}
          />
          <circle
            cx={110} cy={110} r={90}
            fill="none"
            stroke={remaining < 10 ? '#ef4444' : '#f97316'}
            strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray={`${strokeDash} ${circumference}`}
            transform="rotate(-90 110 110)"
            style={{ transition: 'stroke-dasharray 0.8s linear, stroke 0.3s' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl font-bold tabular-nums ${remaining < 10 ? 'text-red-500' : 'text-gray-900'}`}>
            {mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : secs.toString()}
          </span>
          <span className="text-sm text-gray-400 mt-1">วินาที</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={handleReset}
          className="w-14 h-14 rounded-full bg-gray-100 text-gray-600 text-xl active:bg-gray-200 flex items-center justify-center"
        >
          ↺
        </button>
        <button
          onClick={handleToggle}
          className={`w-20 h-20 rounded-full text-white text-2xl font-bold active:scale-95 transition-transform flex items-center justify-center ${
            running ? 'bg-gray-700' : 'bg-orange-500'
          }`}
        >
          {running ? '⏸' : '▶'}
        </button>
        <button
          onClick={() => setSets(0)}
          className="w-14 h-14 rounded-full bg-gray-100 text-gray-600 text-sm font-medium active:bg-gray-200 flex flex-col items-center justify-center"
        >
          <span className="text-lg font-bold text-orange-500">{sets}</span>
          <span className="text-[10px]">เซ็ต</span>
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-6 text-center">
        กด ▶ เพื่อเริ่มนับเวลาพัก · จะดังเสียงเมื่อหมด
      </p>

      {/* Set Counter */}
      <div className="mt-6 w-full bg-orange-50 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-orange-600 font-medium">เซ็ตที่ทำแล้ว</p>
          <p className="text-3xl font-bold text-gray-900">{sets}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSets(s => Math.max(0, s - 1))}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-600 text-xl active:bg-gray-50 flex items-center justify-center"
          >
            −
          </button>
          <button
            onClick={() => setSets(s => s + 1)}
            className="w-10 h-10 rounded-full bg-orange-500 text-white text-xl active:bg-orange-600 flex items-center justify-center"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}
