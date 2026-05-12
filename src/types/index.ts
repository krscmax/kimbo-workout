export type ExerciseCategory = 'weights' | 'bodyweight' | 'cardio'
export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export interface Exercise {
  id: string
  nameEn: string
  nameTh: string
  category: ExerciseCategory
  muscleGroup: string
  difficulty: Difficulty
  primaryMuscles: string[]
  secondaryMuscles: string[]
  equipment: string
  steps: string[]
  formTips: string[]
  commonMistakes: string[]
  setsReps: string
  restSeconds: number
  caloriesPerMin?: number
}

export interface WeightEntry {
  date: string
  weight: number
}

export type DayFocus = 'push' | 'pull' | 'legs' | 'cardio' | 'fullbody' | 'rest'

export interface WorkoutDay {
  day: string
  focus: DayFocus
  exerciseIds: string[]
}

export type Page = 'home' | 'exercises' | 'detail' | 'plan' | 'progress' | 'timer'
