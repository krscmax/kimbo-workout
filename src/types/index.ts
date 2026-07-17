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
  image?: string        // path under /exercises/{id}.jpg  or  https:// url
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

export type Page = 'home' | 'exercises' | 'detail' | 'plan' | 'progress' | 'timer' | 'food'

// ---- Food / calorie tracking ----
export interface MacroVals {
  kcal: number
  protein: number
  carb: number
  fat: number
  sugar: number
}

export type FoodCategory = 'meat' | 'carb' | 'dish' | 'veg' | 'fruit' | 'other' | 'custom'
export type MealKey = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface FoodItem {
  id: string
  name: string
  cat: FoodCategory
  serving: number
  raw?: MacroVals
  cooked?: MacroVals
}

export interface FoodEntry extends MacroVals {
  id: string
  foodId: string
  name: string
  meal: MealKey
  grams: number
  cooked: boolean
  hasState: boolean
}

export interface FoodGoals extends MacroVals {}

export interface TdeeParams {
  sex: 'male' | 'female'
  age: number
  height: number
  weight: number
  activity: 'sedentary' | 'light' | 'moderate' | 'active' | 'vhard'
  aim: 'lose' | 'maintain' | 'gain'
}
