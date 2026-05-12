import { useState } from 'react'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Exercises from './pages/Exercises'
import ExerciseDetail from './pages/ExerciseDetail'
import WorkoutPlan from './pages/WorkoutPlan'
import Progress from './pages/Progress'
import TimerPage from './pages/TimerPage'
import type { Page } from './types'

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [selectedExercise, setSelectedExercise] = useState<string>('')
  const [timerSeconds, setTimerSeconds] = useState(60)

  const navigate = (target: Page, exerciseId?: string) => {
    if (exerciseId) setSelectedExercise(exerciseId)
    setPage(target)
    window.scrollTo(0, 0)
  }

  const startTimer = (seconds: number) => {
    setTimerSeconds(seconds)
    setPage('timer')
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-lg mx-auto">
      <div className="pb-20">
        {page === 'home' && <Home onNavigate={navigate} />}
        {page === 'exercises' && <Exercises onNavigate={navigate} />}
        {page === 'detail' && (
          <ExerciseDetail
            exerciseId={selectedExercise}
            onNavigate={navigate}
            onStartTimer={startTimer}
          />
        )}
        {page === 'plan' && <WorkoutPlan onNavigate={navigate} />}
        {page === 'progress' && <Progress />}
        {page === 'timer' && <TimerPage initialSeconds={timerSeconds} />}
      </div>
      <BottomNav current={page} onChange={p => navigate(p)} />
    </div>
  )
}
