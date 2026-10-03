export type ViewId = 'dashboard' | 'repertoire' | 'exercises' | 'practice' | 'goals' | 'calendar' | 'statistics' | 'settings'
export type ItemType = 'work' | 'exercise'
export type WorkStatus = 'Not started' | 'Learning' | 'Polishing' | 'Performance ready' | 'Maintained' | 'Archived'

export interface Instrument {
  id: string
  name: string
  type: 'keys' | 'strings' | 'voice' | 'percussion' | 'other'
  accent: string
  practiceGoalMinutes: number
}

export interface Work {
  id: string
  instrumentId: string
  composer: string
  title: string
  subtitle?: string
  genre: string
  status: WorkStatus
  lastPracticed?: string
  totalMinutes: number
  tags: string[]
  color: string
  passages: Passage[]
}

export interface Passage {
  id: string
  name: string
  detail: string
  currentBpm?: number
  targetBpm?: number
  practicedCount: number
}

export interface Exercise {
  id: string
  instrumentId: string
  name: string
  category: string
  detail: string
  totalMinutes: number
  lastPracticed?: string
}

export interface PracticeSession {
  id: string
  startedAt: string
  endedAt: string
  durationMinutes: number
  instrumentId: string
  itemType: ItemType
  itemId: string
  itemName: string
  objective?: string
  notes?: string
  result?: string
  confidence?: number
}

export interface Goal {
  id: string
  title: string
  type: 'Practice' | 'Repertoire' | 'Technique'
  instrumentId: string
  targetMinutes?: number
  progressMinutes?: number
  current?: number
  target?: number
  deadline: string
  status: 'On track' | 'Needs attention' | 'Complete'
}

export interface ActiveTimer {
  startedAt: string
  elapsedBeforePause: number
  isPaused: boolean
  instrumentId: string
  itemType: ItemType
  itemId: string
  itemName: string
}

export interface AppState {
  instruments: Instrument[]
  works: Work[]
  exercises: Exercise[]
  sessions: PracticeSession[]
  goals: Goal[]
  activeTimer?: ActiveTimer
}
