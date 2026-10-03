import { useEffect, useMemo, useState, type ComponentType, type FormEvent } from 'react'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleAlert,
  CircleDot,
  Clock3,
  Download,
  ExternalLink,
  FileJson,
  Filter,
  Flame,
  FolderOpen,
  Guitar,
  Headphones,
  HelpCircle,
  LayoutDashboard,
  ListMusic,
  Menu,
  Mic2,
  MoreHorizontal,
  Music2,
  NotebookPen,
  Pause,
  Piano,
  Play,
  Plus,
  RotateCcw,
  Save,
  Search,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  Square,
  Target,
  TimerReset,
  Trash2,
  Trophy,
  Upload,
  X,
} from './icons'
import { seedState } from './data'
import type { ActiveTimer, AppState, Exercise, Goal, Instrument, ItemType, PracticeSession, ViewId, Work, WorkStatus } from './types'

const STORAGE_KEY = 'cadenza-state-v1'

const viewMeta: Record<ViewId, { label: string; eyebrow: string }> = {
  dashboard: { label: 'Dashboard', eyebrow: 'Your practice, in focus' },
  repertoire: { label: 'Repertoire', eyebrow: 'The pieces worth returning to' },
  exercises: { label: 'Exercises', eyebrow: 'Small repetitions, lasting gains' },
  practice: { label: 'Practice log', eyebrow: 'A record of the work' },
  goals: { label: 'Goals', eyebrow: 'Intent made visible' },
  calendar: { label: 'Calendar', eyebrow: 'Your musical rhythm' },
  statistics: { label: 'Statistics', eyebrow: 'Patterns worth noticing' },
  settings: { label: 'Settings', eyebrow: 'Shape your workspace' },
}

const navItems: Array<{ id: ViewId; label: string; icon: ComponentType<{ size?: number; strokeWidth?: number }> }> = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'repertoire', label: 'Repertoire', icon: ListMusic },
  { id: 'exercises', label: 'Exercises', icon: SlidersHorizontal },
  { id: 'practice', label: 'Practice log', icon: NotebookPen },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'statistics', label: 'Statistics', icon: BarChart3 },
]

const formatMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = Math.round(minutes % 60)
  if (!hours) return `${mins}m`
  return `${hours}h ${String(mins).padStart(2, '0')}m`
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

const formatDate = (date?: string, options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }) =>
  date ? new Intl.DateTimeFormat('en-US', options).format(new Date(date)) : 'Not yet practiced'

const isoDay = (date: Date | string) => {
  const parsed = new Date(date)
  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}-${String(parsed.getDate()).padStart(2, '0')}`
}

const cloneSeed = () => JSON.parse(JSON.stringify(seedState)) as AppState

function useAppState() {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? (JSON.parse(saved) as AppState) : cloneSeed()
    } catch {
      return cloneSeed()
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  return [state, setState] as const
}

function App() {
  const [state, setState] = useAppState()
  const [view, setView] = useState<ViewId>('dashboard')
  const [activeInstrumentId, setActiveInstrumentId] = useState('all')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showStartModal, setShowStartModal] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [showWorkModal, setShowWorkModal] = useState(false)
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [reviewTimer, setReviewTimer] = useState<{ timer: ActiveTimer; durationSeconds: number } | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [tick, setTick] = useState(Date.now())

  useEffect(() => {
    if (!state.activeTimer || state.activeTimer.isPaused) return
    const interval = window.setInterval(() => setTick(Date.now()), 1000)
    return () => window.clearInterval(interval)
  }, [state.activeTimer])

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const activeTimerSeconds = useMemo(() => {
    const timer = state.activeTimer
    if (!timer) return 0
    if (timer.isPaused) return timer.elapsedBeforePause
    return timer.elapsedBeforePause + Math.max(0, (tick - new Date(timer.startedAt).getTime()) / 1000)
  }, [state.activeTimer, tick])

  const filteredWorks = activeInstrumentId === 'all' ? state.works : state.works.filter((work) => work.instrumentId === activeInstrumentId)
  const filteredExercises = activeInstrumentId === 'all' ? state.exercises : state.exercises.filter((exercise) => exercise.instrumentId === activeInstrumentId)
  const filteredSessions = activeInstrumentId === 'all' ? state.sessions : state.sessions.filter((session) => session.instrumentId === activeInstrumentId)

  const showToast = (message: string) => setToast(message)

  const startTimer = (instrumentId: string, itemType: ItemType, itemId: string, itemName: string) => {
    setState((current) => ({ ...current, activeTimer: { startedAt: new Date().toISOString(), elapsedBeforePause: 0, isPaused: false, instrumentId, itemType, itemId, itemName } }))
    setShowStartModal(false)
    showToast('Practice timer started')
  }

  const pauseTimer = () => {
    if (!state.activeTimer || state.activeTimer.isPaused) return
    setState((current) => current.activeTimer ? { ...current, activeTimer: { ...current.activeTimer, elapsedBeforePause: activeTimerSeconds, isPaused: true } } : current)
  }

  const resumeTimer = () => {
    if (!state.activeTimer || !state.activeTimer.isPaused) return
    setState((current) => current.activeTimer ? { ...current, activeTimer: { ...current.activeTimer, startedAt: new Date().toISOString(), isPaused: false } } : current)
  }

  const cancelTimer = () => {
    setState((current) => ({ ...current, activeTimer: undefined }))
    showToast('Timer cancelled')
  }

  const stopTimer = () => {
    if (!state.activeTimer) return
    setReviewTimer({ timer: state.activeTimer, durationSeconds: activeTimerSeconds })
    setShowReviewModal(true)
  }

  const saveSession = (details: { notes: string; objective: string; result: string; confidence: number }) => {
    if (!reviewTimer) return
    const timer = reviewTimer.timer
    const durationMinutes = Math.max(1, Math.round(reviewTimer.durationSeconds / 60))
    const endedAt = new Date().toISOString()
    const session: PracticeSession = {
      id: `session-${Date.now()}`,
      startedAt: timer.startedAt,
      endedAt,
      durationMinutes,
      instrumentId: timer.instrumentId,
      itemType: timer.itemType,
      itemId: timer.itemId,
      itemName: timer.itemName,
      objective: details.objective || undefined,
      notes: details.notes || undefined,
      result: details.result || undefined,
      confidence: details.confidence || undefined,
    }
    setState((current) => ({
      ...current,
      activeTimer: undefined,
      sessions: [session, ...current.sessions],
      works: current.works.map((work) => work.id === timer.itemId && timer.itemType === 'work' ? { ...work, totalMinutes: work.totalMinutes + durationMinutes, lastPracticed: endedAt } : work),
      exercises: current.exercises.map((exercise) => exercise.id === timer.itemId && timer.itemType === 'exercise' ? { ...exercise, totalMinutes: exercise.totalMinutes + durationMinutes, lastPracticed: endedAt } : exercise),
    }))
    setShowReviewModal(false)
    setReviewTimer(null)
    showToast(`Session saved · ${formatMinutes(durationMinutes)}`)
  }

  const addWork = (work: Omit<Work, 'id' | 'totalMinutes' | 'passages' | 'lastPracticed'>) => {
    const created: Work = { ...work, id: `work-${Date.now()}`, totalMinutes: 0, passages: [] }
    setState((current) => ({ ...current, works: [created, ...current.works] }))
    setShowWorkModal(false)
    showToast('Work added to your repertoire')
  }

  const addGoal = (goal: Omit<Goal, 'id' | 'status'>) => {
    setState((current) => ({ ...current, goals: [{ ...goal, id: `goal-${Date.now()}`, status: 'On track' }, ...current.goals] }))
    setShowGoalModal(false)
    showToast('Goal created')
  }

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ app: 'Cadenza', version: 1, exportedAt: new Date().toISOString(), data: state }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `cadenza-backup-${isoDay(new Date())}.json`
    anchor.click()
    URL.revokeObjectURL(url)
    showToast('Backup exported')
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as { data?: AppState }
        if (!parsed.data?.instruments || !parsed.data?.sessions) throw new Error('Invalid backup')
        setState(parsed.data)
        showToast('Backup restored')
      } catch {
        showToast('That file is not a valid Cadenza backup')
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  const navigate = (nextView: ViewId) => {
    setView(nextView)
    setMobileMenuOpen(false)
    setSearchQuery('')
  }

  return (
    <div className="app-shell">
      <Sidebar view={view} navigate={navigate} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <div className="app-main">
        <header className="topbar">
          <button className="mobile-menu-button icon-button" aria-label="Open navigation" onClick={() => setMobileMenuOpen(true)}><Menu size={20} /></button>
          <div className="breadcrumbs"><span className="breadcrumb-muted">Workspace</span><ChevronRight size={14} /><strong>{viewMeta[view].label}</strong></div>
          <div className="topbar-actions">
            <div className="search-wrap">
              <Search size={16} />
              <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search your practice" aria-label="Search your practice" />
              <span className="shortcut">⌘ K</span>
              {searchQuery.length > 1 && <SearchResults query={searchQuery} works={state.works} exercises={state.exercises} sessions={state.sessions} onNavigate={(next) => { navigate(next); setSearchQuery('') }} />}
            </div>
            <button className="icon-button desktop-only" aria-label="Notifications"><Bell size={18} /></button>
            <div className="avatar">FA</div>
          </div>
        </header>

        <main className="page-content">
          <div className="page-heading-row">
            <div><p className="eyebrow">{viewMeta[view].eyebrow}</p><h1>{viewMeta[view].label}</h1></div>
            <div className="heading-actions">
              {view === 'repertoire' && <button className="button button-primary" onClick={() => setShowWorkModal(true)}><Plus size={16} /> Add work</button>}
              {view === 'goals' && <button className="button button-primary" onClick={() => setShowGoalModal(true)}><Plus size={16} /> New goal</button>}
              {view !== 'settings' && <button className="button button-soft" onClick={() => setShowStartModal(true)}><Play size={15} fill="currentColor" /> Start practice</button>}
            </div>
          </div>

          {view === 'dashboard' && <Dashboard state={state} works={filteredWorks} sessions={filteredSessions} goals={state.goals} instruments={state.instruments} activeInstrumentId={activeInstrumentId} setActiveInstrumentId={setActiveInstrumentId} navigate={navigate} onStart={() => setShowStartModal(true)} />}
          {view === 'repertoire' && <RepertoireView works={filteredWorks} instruments={state.instruments} onStart={(work) => startTimer(work.instrumentId, 'work', work.id, work.title)} onAdd={() => setShowWorkModal(true)} />}
          {view === 'exercises' && <ExercisesView exercises={filteredExercises} instruments={state.instruments} onStart={(exercise) => startTimer(exercise.instrumentId, 'exercise', exercise.id, exercise.name)} />}
          {view === 'practice' && <PracticeView sessions={filteredSessions} instruments={state.instruments} onStart={() => setShowStartModal(true)} />}
          {view === 'goals' && <GoalsView goals={state.goals} instruments={state.instruments} onAdd={() => setShowGoalModal(true)} />}
          {view === 'calendar' && <CalendarView sessions={filteredSessions} instruments={state.instruments} />}
          {view === 'statistics' && <StatisticsView state={state} sessions={filteredSessions} works={filteredWorks} instruments={state.instruments} />}
          {view === 'settings' && <SettingsView state={state} onExport={exportData} onImport={importData} onReset={() => { localStorage.removeItem(STORAGE_KEY); setState(cloneSeed()); showToast('Sample workspace restored') }} />}
        </main>
      </div>

      {state.activeTimer && <TimerDock timer={state.activeTimer} seconds={activeTimerSeconds} onPause={pauseTimer} onResume={resumeTimer} onStop={stopTimer} onCancel={cancelTimer} instruments={state.instruments} />}
      {showStartModal && <StartPracticeModal instruments={state.instruments} works={state.works} exercises={state.exercises} onClose={() => setShowStartModal(false)} onStart={startTimer} />}
      {showReviewModal && reviewTimer && <SessionReviewModal timer={reviewTimer.timer} durationSeconds={reviewTimer.durationSeconds} onClose={() => { setShowReviewModal(false); setReviewTimer(null) }} onSave={saveSession} />}
      {showWorkModal && <AddWorkModal instruments={state.instruments} onClose={() => setShowWorkModal(false)} onSave={addWork} />}
      {showGoalModal && <AddGoalModal instruments={state.instruments} works={state.works} onClose={() => setShowGoalModal(false)} onSave={addGoal} />}
      {toast && <div className="toast"><CheckCircle2 size={17} /> {toast}</div>}
    </div>
  )
}

function Sidebar({ view, navigate, mobileMenuOpen, setMobileMenuOpen }: { view: ViewId; navigate: (view: ViewId) => void; mobileMenuOpen: boolean; setMobileMenuOpen: (open: boolean) => void }) {
  return (
    <>
      {mobileMenuOpen && <div className="mobile-scrim" onClick={() => setMobileMenuOpen(false)} />}
      <aside className={`sidebar ${mobileMenuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-row"><div className="brand-mark"><Music2 size={18} /></div><span className="brand-name">Cadenza</span><button className="sidebar-close icon-button" onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation"><X size={18} /></button></div>
        <div className="workspace-switcher"><div className="workspace-icon"><Music2 size={16} /></div><div><span className="workspace-label">Current workspace</span><strong>All instruments</strong></div><ChevronDown size={15} className="muted-icon" /></div>
        <nav className="primary-nav" aria-label="Main navigation">
          <p className="nav-label">Workspace</p>
          {navItems.map(({ id, label, icon: Icon }) => <button key={id} className={`nav-item ${view === id ? 'nav-item-active' : ''}`} onClick={() => navigate(id)}><Icon size={17} strokeWidth={view === id ? 2.3 : 1.8} /><span>{label}</span>{id === 'goals' && <span className="nav-count">3</span>}</button>)}
        </nav>
        <div className="sidebar-bottom">
          <button className={`nav-item ${view === 'settings' ? 'nav-item-active' : ''}`} onClick={() => navigate('settings')}><Settings2 size={17} /><span>Settings</span></button>
          <div className="help-card"><div className="help-icon"><Sparkles size={16} /></div><div><strong>Make it a ritual</strong><p>Small, focused reps add up.</p></div><ArrowUpRight size={15} /></div>
          <div className="profile-row"><div className="avatar avatar-small">FA</div><div><strong>Furaha Aswan</strong><span>Personal workspace</span></div><MoreHorizontal size={18} className="muted-icon" /></div>
        </div>
      </aside>
    </>
  )
}

function Dashboard({ state, works, sessions, goals, instruments, activeInstrumentId, setActiveInstrumentId, navigate, onStart }: { state: AppState; works: Work[]; sessions: PracticeSession[]; goals: Goal[]; instruments: Instrument[]; activeInstrumentId: string; setActiveInstrumentId: (id: string) => void; navigate: (view: ViewId) => void; onStart: () => void }) {
  const weekStart = new Date()
  weekStart.setHours(0, 0, 0, 0)
  weekStart.setDate(weekStart.getDate() - 6)
  const weekSessions = sessions.filter((session) => new Date(session.startedAt) >= weekStart)
  const weekMinutes = weekSessions.reduce((sum, session) => sum + session.durationMinutes, 0)
  const streak = calculateStreak(sessions)
  const activeWorks = works.filter((work) => work.status !== 'Archived')
  const dailyMinutes = getDailyMinutes(sessions, 7)
  const maxDay = Math.max(...dailyMinutes.map((day) => day.minutes), 45)
  const recent = [...sessions].sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()).slice(0, 4)
  const focusWork = activeWorks.find((work) => work.status === 'Polishing') ?? activeWorks[0]

  return (
    <>
      <div className="dashboard-greeting"><div><h2>Good {getTimeOfDay()}, musician.</h2><p>Keep the thread going. You’re building something with every focused minute.</p></div><div className="instrument-filter"><span className="filter-caption">Viewing</span><select value={activeInstrumentId} onChange={(event) => setActiveInstrumentId(event.target.value)} aria-label="Filter workspace by instrument"><option value="all">All instruments</option>{instruments.map((instrument) => <option key={instrument.id} value={instrument.id}>{instrument.name}</option>)}</select><ChevronDown size={14} /></div></div>
      <section className="metric-grid">
        <MetricCard icon={<Clock3 size={18} />} label="This week" value={formatMinutes(weekMinutes)} detail={`${weekSessions.length} sessions`} trend="+18%" trendUp tone="violet" />
        <MetricCard icon={<Flame size={18} />} label="Current streak" value={`${streak} days`} detail="Best: 21 days" trend="Keep it up" trendUp tone="coral" />
        <MetricCard icon={<ListMusic size={18} />} label="In rotation" value={String(activeWorks.length)} detail="Across your library" trend={`${activeWorks.filter((work) => work.status === 'Polishing').length} polishing`} tone="gold" />
        <MetricCard icon={<Target size={18} />} label="Active goals" value={String(goals.filter((goal) => goal.status !== 'Complete').length)} detail="1 needs attention" trend="View goals" tone="mint" onClick={() => navigate('goals')} />
      </section>

      <section className="dashboard-grid dashboard-grid-main">
        <Card className="practice-chart-card"><SectionHeader title="Practice rhythm" meta="Last 7 days" action={<button className="text-button" onClick={() => navigate('statistics')}>View statistics <ArrowRight size={14} /></button>} /><div className="chart-summary"><div><span className="chart-total">{formatMinutes(weekMinutes)}</span><span className="chart-caption"> total practice</span></div><span className="trend-badge"><ArrowUpRight size={13} /> 18% vs last week</span></div><div className="bar-chart" aria-label="Practice minutes over the last seven days">{dailyMinutes.map((day) => <div className="bar-column" key={day.key}><div className="bar-track"><div className={`bar-fill ${day.isToday ? 'bar-today' : ''}`} style={{ height: `${Math.max(8, (day.minutes / maxDay) * 100)}%` }}><span className="bar-tooltip">{formatMinutes(day.minutes)}</span></div></div><span className={day.isToday ? 'bar-label bar-label-today' : 'bar-label'}>{day.label}</span></div>)}</div></Card>
        <Card className="focus-card"><SectionHeader title="Current focus" meta="A place to begin" /><div className="focus-art"><div className="focus-orbit orbit-one" /><div className="focus-orbit orbit-two" /><div className="focus-note"><Music2 size={32} /></div><span className="focus-micro-label">{focusWork?.genre ?? 'Practice'}</span></div><div className="focus-body"><div className="focus-title-row"><div><p className="muted-label">{focusWork?.composer}</p><h3>{focusWork?.title}</h3><p className="focus-subtitle">{focusWork?.subtitle}</p></div><span className="status-dot status-violet" /></div><div className="focus-progress-row"><span>Tempo progress</span><strong>{focusWork?.passages[0]?.currentBpm ?? 0} <small>/ {focusWork?.passages[0]?.targetBpm ?? 0} BPM</small></strong></div><ProgressBar value={focusWork?.passages[0] ? (focusWork.passages[0].currentBpm! / focusWork.passages[0].targetBpm!) * 100 : 0} color="violet" /><button className="button button-primary button-full" onClick={() => focusWork && (onStart(), undefined)}><Play size={15} fill="currentColor" /> Start a focused session</button></div></Card>
      </section>

      <section className="dashboard-grid dashboard-grid-lower">
        <Card className="activity-card"><SectionHeader title="Recent activity" meta="Your latest sessions" action={<button className="text-button" onClick={() => navigate('practice')}>See all <ArrowRight size={14} /></button>} /><div className="session-list">{recent.map((session) => <SessionRow key={session.id} session={session} instrument={instruments.find((instrument) => instrument.id === session.instrumentId)} />)}</div></Card>
        <Card className="insights-card"><SectionHeader title="Worth noticing" meta="Passive insights" action={<Sparkles size={16} className="purple-icon" />} /><div className="insight-list"><Insight icon={<CircleDot size={16} />} title="Your focus is paying off" body="You’ve practiced Variation 18 four times this week, up from two last week." color="violet" /><Insight icon={<CircleAlert size={16} />} title="A piece is waiting" body="Arabesque No. 1 hasn’t been visited in 2 days. A short touchpoint could help." color="gold" /><Insight icon={<Trophy size={16} />} title="New milestone" body="You crossed 4 hours of practice this week for the first time." color="mint" /></div></Card>
      </section>

      <Card className="calendar-strip-card"><SectionHeader title="Practice calendar" meta="September 2026" action={<button className="text-button" onClick={() => navigate('calendar')}>Open calendar <ArrowRight size={14} /></button>} /><MiniCalendar sessions={sessions} /></Card>
    </>
  )
}

function RepertoireView({ works, instruments, onStart, onAdd }: { works: Work[]; instruments: Instrument[]; onStart: (work: Work) => void; onAdd: () => void }) {
  const [filter, setFilter] = useState<'All' | WorkStatus>('All')
  const visible = filter === 'All' ? works : works.filter((work) => work.status === filter)
  return <div className="view-stack"><div className="toolbar-row"><div className="segmented-control">{(['All', 'Learning', 'Polishing', 'Performance ready'] as const).map((option) => <button key={option} className={filter === option ? 'segment-active' : ''} onClick={() => setFilter(option)}>{option}</button>)}</div><button className="button button-soft"><Filter size={15} /> Filters</button></div><div className="repertoire-grid">{visible.map((work) => <WorkCard key={work.id} work={work} instrument={instruments.find((instrument) => instrument.id === work.instrumentId)} onStart={() => onStart(work)} />)}{visible.length === 0 && <EmptyState icon={<ListMusic size={24} />} title="Nothing here yet" body="Try another status or add a new work to your repertoire." action={<button className="button button-primary" onClick={onAdd}><Plus size={15} /> Add work</button>} />}</div></div>
}

function ExercisesView({ exercises, instruments, onStart }: { exercises: Exercise[]; instruments: Instrument[]; onStart: (exercise: Exercise) => void }) {
  return <div className="view-stack"><div className="toolbar-row"><div><p className="section-support">Technique stays separate from repertoire, so the shape of your practice stays clear.</p></div><button className="button button-soft"><Filter size={15} /> Filter exercises</button></div><div className="exercise-list">{exercises.map((exercise) => <div className="exercise-row" key={exercise.id}><div className="exercise-icon"><SlidersHorizontal size={18} /></div><div className="exercise-main"><div className="work-kicker">{exercise.category} · {instruments.find((instrument) => instrument.id === exercise.instrumentId)?.name}</div><h3>{exercise.name}</h3><p>{exercise.detail}</p></div><div className="exercise-time"><strong>{formatMinutes(exercise.totalMinutes)}</strong><span>logged</span></div><div className="exercise-last"><span>Last practiced</span><strong>{formatDate(exercise.lastPracticed)}</strong></div><button className="button button-soft button-compact" onClick={() => onStart(exercise)}><Play size={14} fill="currentColor" /> Practice</button><button className="icon-button"><MoreHorizontal size={18} /></button></div>)}</div></div>
}

function PracticeView({ sessions, instruments, onStart }: { sessions: PracticeSession[]; instruments: Instrument[]; onStart: () => void }) {
  const [filter, setFilter] = useState('all')
  const visible = filter === 'all' ? sessions : sessions.filter((session) => session.itemType === filter)
  return <div className="view-stack"><div className="practice-overview"><div className="practice-overview-copy"><span className="overline">Lifetime practice</span><strong>{formatMinutes(sessions.reduce((sum, session) => sum + session.durationMinutes, 0))}</strong><span>across {sessions.length} recorded sessions</span></div><div className="practice-overview-quote"><Sparkles size={17} /><span>“The work remembers what the mind forgets.”</span></div><button className="button button-primary" onClick={onStart}><Play size={15} fill="currentColor" /> Start practice</button></div><div className="toolbar-row"><div className="segmented-control"><button className={filter === 'all' ? 'segment-active' : ''} onClick={() => setFilter('all')}>All sessions</button><button className={filter === 'work' ? 'segment-active' : ''} onClick={() => setFilter('work')}>Repertoire</button><button className={filter === 'exercise' ? 'segment-active' : ''} onClick={() => setFilter('exercise')}>Exercises</button></div><button className="button button-soft"><CalendarDays size={15} /> Date range</button></div><Card className="log-card"><div className="log-header"><span>Session</span><span>Instrument</span><span>Objective</span><span>Duration</span><span /></div>{visible.map((session) => <div className="log-row" key={session.id}><div className="log-session"><div className={`log-type ${session.itemType === 'work' ? 'log-type-work' : 'log-type-exercise'}`}>{session.itemType === 'work' ? <Music2 size={15} /> : <SlidersHorizontal size={15} />}</div><div><strong>{session.itemName}</strong><span>{formatDate(session.startedAt, { weekday: 'short', month: 'short', day: 'numeric' })}{session.notes ? ` · ${session.notes}` : ''}</span></div></div><span className="log-instrument">{instruments.find((instrument) => instrument.id === session.instrumentId)?.name}</span><span className="log-objective">{session.objective ?? 'Open practice'}</span><strong className="log-duration">{formatMinutes(session.durationMinutes)}</strong><button className="icon-button"><MoreHorizontal size={18} /></button></div>)}{visible.length === 0 && <EmptyState title="No sessions match" body="Record your first session to start building your practice history." action={<button className="button button-primary" onClick={onStart}><Play size={15} /> Start practice</button>} />}</Card></div>
}

function GoalsView({ goals, instruments, onAdd }: { goals: Goal[]; instruments: Instrument[]; onAdd: () => void }) {
  return <div className="view-stack"><div className="goals-summary"><div><span className="overline">This week</span><strong>4h 28m</strong><span>of 5h practice goal</span></div><div className="goal-ring"><div><strong>89%</strong><span>on track</span></div></div><div className="goal-summary-note"><CheckCircle2 size={18} /><div><strong>Good momentum</strong><span>Two goals are moving in the right direction.</span></div></div></div><div className="goal-grid">{goals.map((goal) => { const percentage = goal.targetMinutes ? Math.min(100, ((goal.progressMinutes ?? 0) / goal.targetMinutes) * 100) : Math.min(100, ((goal.current ?? 0) / (goal.target ?? 1)) * 100); return <Card className="goal-card" key={goal.id}><div className="goal-card-top"><span className={`goal-type goal-type-${goal.type.toLowerCase()}`}>{goal.type}</span><button className="icon-button"><MoreHorizontal size={18} /></button></div><h3>{goal.title}</h3><div className="goal-meta"><span>{instruments.find((instrument) => instrument.id === goal.instrumentId)?.name}</span><span>Due {formatDate(goal.deadline, { month: 'short', day: 'numeric' })}</span></div><div className="goal-progress-label"><span>Progress</span><strong>{goal.targetMinutes ? `${formatMinutes(goal.progressMinutes ?? 0)} / ${formatMinutes(goal.targetMinutes)}` : `${goal.current} / ${goal.target} BPM`}</strong></div><ProgressBar value={percentage} color={goal.status === 'Needs attention' ? 'gold' : 'violet'} /><div className="goal-footer"><span className={`status-pill ${goal.status === 'Needs attention' ? 'status-pill-warn' : ''}`}><span className="tiny-dot" /> {goal.status}</span><span>{Math.round(percentage)}%</span></div></Card> })}<button className="new-goal-card" onClick={onAdd}><div className="new-goal-icon"><Plus size={19} /></div><strong>Create a new goal</strong><span>Set an intention for your next season.</span></button></div></div>
}

function CalendarView({ sessions, instruments }: { sessions: PracticeSession[]; instruments: Instrument[] }) {
  const [selectedDay, setSelectedDay] = useState(isoDay(new Date()))
  const today = new Date()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const firstWeekday = new Date(today.getFullYear(), today.getMonth(), 1).getDay()
  const cells = Array.from({ length: Math.ceil((firstWeekday + daysInMonth) / 7) * 7 }, (_, index) => { const day = index - firstWeekday + 1; return day > 0 && day <= daysInMonth ? day : null })
  const byDay = sessions.reduce<Record<string, number>>((acc, session) => { const key = isoDay(session.startedAt); acc[key] = (acc[key] ?? 0) + session.durationMinutes; return acc }, {})
  const selectedSessions = sessions.filter((session) => isoDay(session.startedAt) === selectedDay)
  return <div className="calendar-layout"><Card className="big-calendar-card"><div className="calendar-title-row"><div><h2>{new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(today)}</h2><p>{Object.keys(byDay).length} days practiced this month</p></div><div className="calendar-nav"><button className="icon-button"><ChevronLeft size={18} /></button><button className="icon-button"><ChevronRight size={18} /></button></div></div><div className="weekday-row">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <span key={day}>{day}</span>)}</div><div className="month-grid">{cells.map((day, index) => { if (!day) return <div className="month-cell empty-cell" key={`empty-${index}`} />; const date = new Date(today.getFullYear(), today.getMonth(), day); const key = isoDay(date); const minutes = byDay[key] ?? 0; const isToday = key === isoDay(new Date()); return <button key={key} className={`month-cell ${isToday ? 'month-cell-today' : ''} ${selectedDay === key ? 'month-cell-selected' : ''}`} onClick={() => setSelectedDay(key)}><span className="month-day-number">{day}</span>{minutes > 0 && <div className="day-heat" style={{ opacity: Math.min(1, 0.2 + minutes / 120) }}><span>{formatMinutes(minutes)}</span></div>}</button> })}</div><div className="calendar-legend"><span>Less</span>{[0.2, 0.4, 0.6, 0.8, 1].map((opacity) => <i key={opacity} style={{ opacity }} />)}<span>More</span></div></Card><Card className="selected-day-card"><div className="selected-day-heading"><div><span className="overline">Selected day</span><h2>{formatDate(selectedDay, { weekday: 'long', month: 'long', day: 'numeric' })}</h2></div><span className="day-total">{formatMinutes(selectedSessions.reduce((sum, session) => sum + session.durationMinutes, 0))}</span></div>{selectedSessions.length ? <div className="day-session-list">{selectedSessions.map((session) => <SessionRow key={session.id} session={session} instrument={instruments.find((instrument) => instrument.id === session.instrumentId)} compact />)}</div> : <EmptyState icon={<CalendarDays size={22} />} title="A quiet day" body="No sessions recorded for this date." />}</Card></div>
}

function StatisticsView({ state, sessions, works, instruments }: { state: AppState; sessions: PracticeSession[]; works: Work[]; instruments: Instrument[] }) {
  const total = sessions.reduce((sum, session) => sum + session.durationMinutes, 0)
  const repertoireMinutes = sessions.filter((session) => session.itemType === 'work').reduce((sum, session) => sum + session.durationMinutes, 0)
  const exerciseMinutes = total - repertoireMinutes
  const instrumentTotals = instruments.map((instrument) => ({ ...instrument, minutes: sessions.filter((session) => session.instrumentId === instrument.id).reduce((sum, session) => sum + session.durationMinutes, 0) })).filter((instrument) => instrument.minutes > 0)
  const maxInstrument = Math.max(...instrumentTotals.map((instrument) => instrument.minutes), 1)
  const dailyMinutes = getDailyMinutes(sessions, 14)
  return <div className="view-stack"><div className="stats-control-row"><div className="date-range-control"><CalendarDays size={16} /><strong>Last 30 days</strong><ChevronDown size={14} /></div><div className="stats-filters"><button className="button button-soft">All instruments <ChevronDown size={14} /></button><button className="button button-soft"><Download size={15} /> Export report</button></div></div><div className="stats-kpi-grid"><MetricCard icon={<Clock3 size={18} />} label="Total practice" value={formatMinutes(total)} detail="Last 30 days" trend="+18%" trendUp tone="violet" /><MetricCard icon={<Headphones size={18} />} label="Avg. session" value={`${Math.round(total / Math.max(sessions.length, 1))}m`} detail={`${sessions.length} sessions`} trend="+4m" trendUp tone="mint" /><MetricCard icon={<Flame size={18} />} label="Consistency" value="78%" detail="Days with practice" trend="+12%" trendUp tone="coral" /><MetricCard icon={<Trophy size={18} />} label="Pieces touched" value={String(new Set(sessions.filter((session) => session.itemType === 'work').map((session) => session.itemId)).size)} detail="This period" trend="On track" tone="gold" /></div><div className="stats-grid"><Card><SectionHeader title="Daily practice" meta="Minutes per day" /><div className="wide-bar-chart">{dailyMinutes.map((day) => <div className="wide-bar-column" key={day.key}><span className="wide-bar-value">{day.minutes || ''}</span><div className="wide-bar-track"><div className="wide-bar-fill" style={{ height: `${Math.max(5, (day.minutes / Math.max(...dailyMinutes.map((item) => item.minutes), 1)) * 100)}%` }} /></div><span>{day.label}</span></div>)}</div></Card><Card><SectionHeader title="Where your time goes" meta="By instrument" /><div className="instrument-bars">{instrumentTotals.map((instrument) => <div className="instrument-bar-row" key={instrument.id}><div className="instrument-bar-label"><span className="mini-instrument-icon" style={{ color: instrument.accent }}>{instrument.type === 'keys' ? <Piano size={15} /> : <Guitar size={15} />}</span><span>{instrument.name}</span><strong>{formatMinutes(instrument.minutes)}</strong></div><ProgressBar value={(instrument.minutes / maxInstrument) * 100} color={instrument.id === 'piano' ? 'violet' : 'gold'} /></div>)}<div className="split-stat"><div><span>Repertoire</span><strong>{formatMinutes(repertoireMinutes)}</strong></div><div><span>Exercises</span><strong>{formatMinutes(exerciseMinutes)}</strong></div></div></div></Card></div><Card className="table-card"><SectionHeader title="Repertoire progress" meta="Lifetime totals" /><div className="stats-table-header"><span>Work</span><span>Status</span><span>Practice time</span><span>Last touched</span><span>Trend</span></div>{works.slice(0, 6).map((work) => <div className="stats-table-row" key={work.id}><div className="stats-work"><span className="work-color-dot" style={{ background: work.color }} /><strong>{work.title}</strong><span>{work.composer}</span></div><span><span className="status-pill">{work.status}</span></span><strong>{formatMinutes(work.totalMinutes)}</strong><span>{formatDate(work.lastPracticed)}</span><span className="table-trend"><ArrowUpRight size={14} /> {work.status === 'Performance ready' ? 'Ready' : 'Growing'}</span></div>)}</Card><p className="stats-footnote"><Sparkles size={14} /> Statistics are calculated from your recorded sessions and stay private to your workspace.</p></div>
}

function SettingsView({ state, onExport, onImport, onReset }: { state: AppState; onExport: () => void; onImport: (event: React.ChangeEvent<HTMLInputElement>) => void; onReset: () => void }) {
  return <div className="settings-layout"><div className="settings-nav"><span className="settings-nav-title">Settings</span><button className="settings-nav-active">Profile</button><button>Instruments</button><button>Practice preferences</button><button>Notifications</button><button>Appearance</button><button>Data & privacy</button></div><div className="settings-content"><section className="settings-section"><div className="settings-section-heading"><div><h2>Profile</h2><p>How you show up in your own practice space.</p></div></div><div className="profile-settings-card"><div className="avatar avatar-large">FA</div><div className="profile-fields"><label>Display name<input defaultValue="Furaha Aswan" /></label><label>Email address<input defaultValue="furaha@example.com" /></label></div><button className="button button-primary">Save changes</button></div></section><section className="settings-section"><div className="settings-section-heading"><div><h2>Instruments</h2><p>Each instrument has its own practice context and goals.</p></div><button className="button button-soft"><Plus size={15} /> Add instrument</button></div><div className="settings-list">{state.instruments.map((instrument) => <div className="settings-list-row" key={instrument.id}><div className="settings-instrument-icon" style={{ background: `${instrument.accent}18`, color: instrument.accent }}>{instrument.type === 'keys' ? <Piano size={18} /> : <Guitar size={18} />}</div><div><strong>{instrument.name}</strong><span>{formatMinutes(instrument.practiceGoalMinutes)} weekly target</span></div><button className="icon-button"><MoreHorizontal size={18} /></button></div>)}</div></section><section className="settings-section"><div className="settings-section-heading"><div><h2>Data portability</h2><p>Your practice history belongs to you. Export or restore it anytime.</p></div></div><div className="data-actions"><button className="data-action" onClick={onExport}><div className="data-action-icon"><Download size={18} /></div><div><strong>Export Cadenza backup</strong><span>JSON · includes sessions, works, goals, and settings</span></div><ArrowRight size={16} /></button><label className="data-action"><div className="data-action-icon"><Upload size={18} /></div><div><strong>Restore from backup</strong><span>Validate and restore a Cadenza JSON backup</span></div><input type="file" accept="application/json,.json" onChange={onImport} hidden /><ArrowRight size={16} /></label></div></section><section className="settings-section danger-section"><div><h2>Demo workspace</h2><p>Reset the local sample workspace if you want a clean beginning.</p></div><button className="button button-danger" onClick={onReset}><RotateCcw size={15} /> Restore sample data</button></section></div></div>
}

function MetricCard({ icon, label, value, detail, trend, trendUp, tone, onClick }: { icon: React.ReactNode; label: string; value: string; detail: string; trend: string; trendUp?: boolean; tone: string; onClick?: () => void }) {
  return <button className={`metric-card metric-${tone}`} onClick={onClick} disabled={!onClick}><div className="metric-top"><span className="metric-icon">{icon}</span><span className={`metric-trend ${trendUp ? 'metric-trend-up' : ''}`}>{trendUp && <ArrowUpRight size={13} />}{trend}</span></div><div className="metric-value">{value}</div><div className="metric-bottom"><span>{label}</span><span>{detail}</span></div></button>
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) { return <section className={`card ${className}`}>{children}</section> }
function SectionHeader({ title, meta, action }: { title: string; meta?: string; action?: React.ReactNode }) { return <div className="section-header"><div><h2>{title}</h2>{meta && <span>{meta}</span>}</div>{action}</div> }
function ProgressBar({ value, color = 'violet' }: { value: number; color?: string }) { return <div className={`progress-track progress-${color}`}><div className="progress-value" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} /></div> }
function StatusBadge({ status }: { status: WorkStatus }) { return <span className={`status-badge status-${status.toLowerCase().replace(/ /g, '-')}`}><span className="tiny-dot" /> {status}</span> }

function WorkCard({ work, instrument, onStart }: { work: Work; instrument?: Instrument; onStart: () => void }) {
  return <article className="work-card"><div className="work-cover" style={{ background: `linear-gradient(135deg, ${work.color}, #20233f)` }}><div className="cover-lines" /><Music2 size={30} /><span>{instrument?.name}</span></div><div className="work-card-body"><div className="work-card-heading"><div><span className="work-kicker">{work.composer}</span><h3>{work.title}</h3><p>{work.subtitle}</p></div><button className="icon-button"><MoreHorizontal size={18} /></button></div><StatusBadge status={work.status} /><div className="work-card-footer"><span><Clock3 size={14} /> {formatMinutes(work.totalMinutes)}</span><span>{formatDate(work.lastPracticed)}</span><button className="play-circle" onClick={onStart} aria-label={`Start practice for ${work.title}`}><Play size={14} fill="currentColor" /></button></div></div></article>
}

function SessionRow({ session, instrument, compact = false }: { session: PracticeSession; instrument?: Instrument; compact?: boolean }) {
  return <div className={`session-row ${compact ? 'session-row-compact' : ''}`}><div className="session-date"><strong>{new Date(session.startedAt).getDate()}</strong><span>{new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(session.startedAt))}</span></div><div className={`session-type-icon ${session.itemType === 'work' ? 'session-work' : 'session-exercise'}`}>{session.itemType === 'work' ? <Music2 size={16} /> : <SlidersHorizontal size={16} />}</div><div className="session-info"><strong>{session.itemName}</strong><span>{instrument?.name} · {session.objective ?? 'Open practice'}</span></div><span className="session-duration">{formatMinutes(session.durationMinutes)}</span><button className="icon-button"><MoreHorizontal size={17} /></button></div>
}

function Insight({ icon, title, body, color }: { icon: React.ReactNode; title: string; body: string; color: string }) { return <div className={`insight insight-${color}`}><div className="insight-icon">{icon}</div><div><strong>{title}</strong><p>{body}</p></div><ArrowRight size={15} className="insight-arrow" /></div> }

function MiniCalendar({ sessions }: { sessions: PracticeSession[] }) {
  const days = getDailyMinutes(sessions, 28)
  return <div className="mini-calendar"><div className="mini-calendar-months"><span>Aug 30</span><span>Sep 6</span><span>Sep 13</span><span>Sep 20</span><span>Sep 27</span></div><div className="mini-calendar-grid">{days.map((day) => <div key={day.key} className={`mini-day ${day.minutes > 0 ? 'mini-day-active' : ''} ${day.isToday ? 'mini-day-today' : ''}`} title={`${formatMinutes(day.minutes)} on ${day.key}`} style={{ opacity: day.minutes ? Math.min(1, 0.35 + day.minutes / 100) : 1 }} />)}</div><div className="calendar-legend"><span>Less</span>{[0.2, 0.4, 0.6, 0.8, 1].map((opacity) => <i key={opacity} style={{ opacity }} />)}<span>More</span></div></div>
}

function TimerDock({ timer, seconds, onPause, onResume, onStop, onCancel, instruments }: { timer: ActiveTimer; seconds: number; onPause: () => void; onResume: () => void; onStop: () => void; onCancel: () => void; instruments: Instrument[] }) {
  return <div className="timer-dock"><div className="timer-pulse"><span /></div><div className="timer-context"><span className="timer-label">{timer.isPaused ? 'Timer paused' : 'In practice'}</span><strong>{timer.itemName}</strong><span>{instruments.find((instrument) => instrument.id === timer.instrumentId)?.name}</span></div><div className="timer-clock">{formatTime(seconds)}</div><div className="timer-actions">{timer.isPaused ? <button className="button button-soft" onClick={onResume}><Play size={14} fill="currentColor" /> Resume</button> : <button className="button button-soft" onClick={onPause}><Pause size={14} fill="currentColor" /> Pause</button>}<button className="button button-primary" onClick={onStop}><Square size={13} fill="currentColor" /> Finish session</button><button className="icon-button timer-cancel" aria-label="Cancel timer" onClick={onCancel}><X size={17} /></button></div></div>
}

function StartPracticeModal({ instruments, works, exercises, onClose, onStart }: { instruments: Instrument[]; works: Work[]; exercises: Exercise[]; onClose: () => void; onStart: (instrumentId: string, itemType: ItemType, itemId: string, itemName: string) => void }) {
  const [instrumentId, setInstrumentId] = useState(instruments[0]?.id ?? '')
  const [itemType, setItemType] = useState<ItemType>('work')
  const itemOptions = itemType === 'work' ? works.filter((work) => work.instrumentId === instrumentId && work.status !== 'Archived') : exercises.filter((exercise) => exercise.instrumentId === instrumentId)
  const [itemId, setItemId] = useState(itemOptions[0]?.id ?? '')
  useEffect(() => setItemId(itemOptions[0]?.id ?? ''), [instrumentId, itemType])
  const selected = itemOptions.find((item) => item.id === itemId)
  return <Modal title="Start a practice session" onClose={onClose}><div className="modal-intro"><div className="modal-music-icon"><TimerReset size={23} /></div><div><h3>Make a little room for the work.</h3><p>Your timer will stay with you while you move through Cadenza.</p></div></div><label className="form-label">Instrument<select value={instrumentId} onChange={(event) => setInstrumentId(event.target.value)}>{instruments.map((instrument) => <option key={instrument.id} value={instrument.id}>{instrument.name}</option>)}</select></label><div className="type-toggle"><button className={itemType === 'work' ? 'type-active' : ''} onClick={() => setItemType('work')}><Music2 size={15} /> Repertoire</button><button className={itemType === 'exercise' ? 'type-active' : ''} onClick={() => setItemType('exercise')}><SlidersHorizontal size={15} /> Exercise</button></div><label className="form-label">What are you practicing?<select value={itemId} onChange={(event) => setItemId(event.target.value)}>{itemOptions.map((item) => <option key={item.id} value={item.id}>{'composer' in item ? `${item.title} · ${item.composer}` : item.name}</option>)}</select></label>{selected && 'passages' in selected && selected.passages.length > 0 && <div className="modal-context-note"><CircleDot size={15} /><span>Last focus: {selected.passages[0].name} · {selected.passages[0].currentBpm} BPM</span></div>}<div className="modal-actions"><button className="button button-soft" onClick={onClose}>Cancel</button><button className="button button-primary" disabled={!selected} onClick={() => selected && onStart(instrumentId, itemType, selected.id, 'composer' in selected ? selected.title : selected.name)}><Play size={15} fill="currentColor" /> Start timer</button></div></Modal>
}

function SessionReviewModal({ timer, durationSeconds, onClose, onSave }: { timer: ActiveTimer; durationSeconds: number; onClose: () => void; onSave: (details: { notes: string; objective: string; result: string; confidence: number }) => void }) {
  const [objective, setObjective] = useState('')
  const [result, setResult] = useState('')
  const [notes, setNotes] = useState('')
  const [confidence, setConfidence] = useState(7)
  return <Modal title="Session complete" onClose={onClose}><div className="complete-banner"><div className="complete-check"><Check size={22} /></div><div><span>Nice work</span><strong>{formatTime(durationSeconds)}</strong><p>{timer.itemName}</p></div></div><div className="review-grid"><label className="form-label">Objective<select value={objective} onChange={(event) => setObjective(event.target.value)}><option value="">No objective</option><option>Learn notes</option><option>Increase tempo</option><option>Improve accuracy</option><option>Improve rhythm</option><option>Improve technique</option><option>Maintain repertoire</option></select></label><label className="form-label">Result<select value={result} onChange={(event) => setResult(event.target.value)}><option value="">Add a result</option><option>Improved accuracy</option><option>Increased tempo</option><option>More relaxed</option><option>Performance ready</option><option>Needs another pass</option></select></label></div><label className="form-label">Notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="What changed? What should you remember next time?" rows={3} /></label><div className="confidence-row"><div><span className="form-label-inline">Confidence</span><p>How did it feel today?</p></div><div className="confidence-options">{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => <button key={value} className={confidence === value ? 'confidence-active' : ''} onClick={() => setConfidence(value)}>{value}</button>)}</div></div><div className="modal-actions"><button className="button button-soft" onClick={onClose}>Keep editing</button><button className="button button-primary" onClick={() => onSave({ objective, result, notes, confidence })}><Save size={15} /> Save session</button></div></Modal>
}

function AddWorkModal({ instruments, onClose, onSave }: { instruments: Instrument[]; onClose: () => void; onSave: (work: Omit<Work, 'id' | 'totalMinutes' | 'passages' | 'lastPracticed'>) => void }) {
  const [title, setTitle] = useState('')
  const [composer, setComposer] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [instrumentId, setInstrumentId] = useState(instruments[0]?.id ?? '')
  const [genre, setGenre] = useState('Classical')
  const [status, setStatus] = useState<WorkStatus>('Not started')
  return <Modal title="Add a work" onClose={onClose}><div className="modal-intro"><div className="modal-music-icon"><BookOpen size={23} /></div><div><h3>Give the piece a home.</h3><p>Keep the first entry light. You can refine the details later.</p></div></div><div className="review-grid"><label className="form-label">Title<input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Nocturne in E-flat" /></label><label className="form-label">Composer / artist<input value={composer} onChange={(event) => setComposer(event.target.value)} placeholder="e.g. Frédéric Chopin" /></label></div><label className="form-label">Subtitle / arrangement<input value={subtitle} onChange={(event) => setSubtitle(event.target.value)} placeholder="Optional" /></label><div className="review-grid"><label className="form-label">Instrument<select value={instrumentId} onChange={(event) => setInstrumentId(event.target.value)}>{instruments.map((instrument) => <option key={instrument.id} value={instrument.id}>{instrument.name}</option>)}</select></label><label className="form-label">Status<select value={status} onChange={(event) => setStatus(event.target.value as WorkStatus)}>{['Not started', 'Learning', 'Polishing', 'Performance ready', 'Maintained', 'Archived'].map((option) => <option key={option}>{option}</option>)}</select></label></div><label className="form-label">Genre<input value={genre} onChange={(event) => setGenre(event.target.value)} /></label><div className="modal-actions"><button className="button button-soft" onClick={onClose}>Cancel</button><button className="button button-primary" disabled={!title.trim()} onClick={() => onSave({ title: title.trim(), composer: composer.trim() || 'Unknown artist', subtitle: subtitle.trim(), instrumentId, genre, status, tags: [], color: '#7c6cf2' })}><Plus size={15} /> Add work</button></div></Modal>
}

function AddGoalModal({ instruments, works, onClose, onSave }: { instruments: Instrument[]; works: Work[]; onClose: () => void; onSave: (goal: Omit<Goal, 'id' | 'status'>) => void }) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState<Goal['type']>('Practice')
  const [instrumentId, setInstrumentId] = useState(instruments[0]?.id ?? '')
  const [target, setTarget] = useState('300')
  const [deadline, setDeadline] = useState('')
  return <Modal title="Create a goal" onClose={onClose}><div className="modal-intro"><div className="modal-music-icon"><Target size={23} /></div><div><h3>What would feel meaningful next?</h3><p>Goals are gentle landmarks, not pressure.</p></div></div><label className="form-label">Goal title<input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Practice piano 5 hours this week" /></label><div className="review-grid"><label className="form-label">Type<select value={type} onChange={(event) => setType(event.target.value as Goal['type'])}><option>Practice</option><option>Repertoire</option><option>Technique</option></select></label><label className="form-label">Instrument<select value={instrumentId} onChange={(event) => setInstrumentId(event.target.value)}>{instruments.map((instrument) => <option key={instrument.id} value={instrument.id}>{instrument.name}</option>)}</select></label></div><div className="review-grid"><label className="form-label">Target minutes<input type="number" min="1" value={target} onChange={(event) => setTarget(event.target.value)} /></label><label className="form-label">Deadline<input type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} /></label></div><div className="modal-context-note"><CircleDot size={15} /><span>{works.filter((work) => work.instrumentId === instrumentId).length} works are currently in this workspace.</span></div><div className="modal-actions"><button className="button button-soft" onClick={onClose}>Cancel</button><button className="button button-primary" disabled={!title.trim()} onClick={() => onSave({ title: title.trim(), type, instrumentId, targetMinutes: Number(target) || 1, progressMinutes: 0, deadline: deadline ? new Date(`${deadline}T12:00:00`).toISOString() : new Date(Date.now() + 7 * 86400000).toISOString() })}><Target size={15} /> Create goal</button></div></Modal>
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) { return <div className="modal-backdrop" role="presentation"><div className="modal" role="dialog" aria-modal="true" aria-label={title}><div className="modal-header"><h2>{title}</h2><button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={18} /></button></div>{children}</div></div> }

function SearchResults({ query, works, exercises, sessions, onNavigate }: { query: string; works: Work[]; exercises: Exercise[]; sessions: PracticeSession[]; onNavigate: (view: ViewId) => void }) {
  const normalized = query.toLowerCase()
  const foundWorks = works.filter((work) => `${work.title} ${work.composer} ${work.subtitle ?? ''}`.toLowerCase().includes(normalized)).slice(0, 3)
  const foundExercises = exercises.filter((exercise) => `${exercise.name} ${exercise.category}`.toLowerCase().includes(normalized)).slice(0, 2)
  const foundNotes = sessions.filter((session) => `${session.notes ?? ''} ${session.itemName}`.toLowerCase().includes(normalized) && session.notes).slice(0, 2)
  const hasResults = foundWorks.length + foundExercises.length + foundNotes.length > 0
  return <div className="search-results">{hasResults ? <>{foundWorks.length > 0 && <div className="search-group"><span className="search-group-label">Repertoire</span>{foundWorks.map((work) => <button key={work.id} onClick={() => onNavigate('repertoire')}><span className="search-result-icon search-result-work"><Music2 size={14} /></span><span><strong>{work.title}</strong><small>{work.composer}</small></span><ArrowRight size={14} /></button>)}</div>}{foundExercises.length > 0 && <div className="search-group"><span className="search-group-label">Exercises</span>{foundExercises.map((exercise) => <button key={exercise.id} onClick={() => onNavigate('exercises')}><span className="search-result-icon search-result-exercise"><SlidersHorizontal size={14} /></span><span><strong>{exercise.name}</strong><small>{exercise.category}</small></span><ArrowRight size={14} /></button>)}</div>}{foundNotes.length > 0 && <div className="search-group"><span className="search-group-label">Practice notes</span>{foundNotes.map((session) => <button key={session.id} onClick={() => onNavigate('practice')}><span className="search-result-icon search-result-note"><NotebookPen size={14} /></span><span><strong>{session.itemName}</strong><small>{session.notes}</small></span><ArrowRight size={14} /></button>)}</div>}</> : <div className="search-empty"><Search size={17} /><span>No matches in your practice history.</span></div>}<div className="search-footer"><span>Search works, exercises, notes, and goals</span><span className="shortcut">ESC</span></div></div>
}

function EmptyState({ icon, title, body, action }: { icon?: React.ReactNode; title: string; body: string; action?: React.ReactNode }) { return <div className="empty-state">{icon && <div className="empty-icon">{icon}</div>}<h3>{title}</h3><p>{body}</p>{action}</div> }

function getTimeOfDay() { const hour = new Date().getHours(); return hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening' }

function getDailyMinutes(sessions: PracticeSession[], days: number) {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() - (days - index - 1))
    const key = isoDay(date)
    const minutes = sessions.filter((session) => isoDay(session.startedAt) === key).reduce((sum, session) => sum + session.durationMinutes, 0)
    return { key, minutes, label: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date).slice(0, 2), isToday: key === isoDay(new Date()) }
  })
}

function calculateStreak(sessions: PracticeSession[]) {
  const days = new Set(sessions.map((session) => isoDay(session.startedAt)))
  let streak = 0
  const date = new Date()
  if (!days.has(isoDay(date))) date.setDate(date.getDate() - 1)
  while (days.has(isoDay(date))) { streak += 1; date.setDate(date.getDate() - 1) }
  return streak
}

export default App
