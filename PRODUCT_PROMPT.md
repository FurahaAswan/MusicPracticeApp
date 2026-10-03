You are an expert product designer, UX designer, full-stack engineer, database architect, and QA engineer.

Build a complete, polished, production-quality web application called **Cadenza**: a personal music-instrument practice tracker, repertoire manager, practice journal, goal tracker, and analytics platform.

The application should feel like a purpose-built **personal operating system for learning and maintaining musical instruments**. It must work for any instrument—not just piano—and should support serious long-term practice while remaining extremely fast and frictionless during an actual practice session.

Do not build a toy/demo/MVP unless explicitly required by a technical constraint. Build the complete foundation and all core workflows described below.

---

# 1. PRODUCT VISION

Cadenza allows a musician to:

* Manage separate workspaces for each instrument
* Maintain a structured repertoire library
* Manage exercises and technical studies separately from repertoire
* Break pieces into movements, sections, and practice passages
* Define explicit practice objectives
* Start a global practice timer
* Record exactly what they practiced
* Add structured results and notes afterward
* Record audio during practice
* Attach scores, recordings, links, and other resources to musical works
* Set measurable practice and repertoire goals
* Track progress over weeks, months, and years
* View practice streaks and historical practice calendars
* Analyze practice habits in detail
* Receive passive recommendations and insights without the application automatically scheduling practice
* Import/export their data
* Back up and restore their data
* Maintain a permanent historical record of practice

The application has NO social network functionality.

It is a personal tool.

---

# 2. CORE DESIGN PRINCIPLE

The application should follow this philosophy:

**Recording practice should take seconds. Managing and understanding practice can be detailed.**

Do not force the user to fill out a large form every time they practice.

A normal workflow should be:

1. Open application
2. Select instrument workspace
3. Select piece/exercise/passage
4. Start global timer
5. Practice
6. Stop timer
7. Quickly record what happened
8. Save

Advanced details should be available without making the basic workflow cumbersome.

---

# 3. TECHNOLOGY

Choose a modern, maintainable architecture yourself, but use the following constraints:

* TypeScript wherever practical
* React-based frontend
* Responsive web application
* Mobile-friendly UI
* Desktop-first but excellent mobile experience
* Relational database
* Proper backend/API layer
* Authentication and user accounts
* Database migrations
* Strong type safety
* Modular architecture
* Automated tests
* Proper validation
* Robust error handling
* Secure authentication
* Production-oriented configuration
* Environment-variable based secrets/configuration
* Clean separation of frontend, backend, domain logic, persistence, and UI components

The application is **always-online**.

Do not build offline-first synchronization.

The database is the authoritative source of truth.

Use a database abstraction/ORM where appropriate.

Choose the specific framework/database/authentication/deployment technologies based on what will produce the most maintainable application.

Do not unnecessarily over-engineer the system.

---

# 4. AUTHENTICATION

Implement user accounts.

Users should be able to:

* Create an account
* Log in
* Log out
* Maintain their own private data
* Reset/change their password if applicable
* Access their data across desktop and mobile browsers

All user-owned data must be scoped to the authenticated user.

No user's practice data should ever be visible to another user.

---

# 5. INSTRUMENT WORKSPACES

Each instrument is its own workspace.

Example:

PIANO

GUITAR

VOICE

DRUMS

VIOLIN

etc.

Users can create arbitrary instruments.

Each instrument workspace should have:

* Dashboard
* Repertoire
* Exercises
* Practice history
* Goals
* Statistics
* Calendar
* Resources
* Settings

The workspace should maintain its own metrics while still allowing the user to view global statistics across all instruments.

Instrument dashboards should be customizable enough to accommodate different instruments without hard-coding piano-specific assumptions into the architecture.

---

# 6. MAIN APPLICATION NAVIGATION

Design a clean application structure similar in spirit to polished productivity applications.

Suggested top-level navigation:

* Dashboard
* Instruments
* Repertoire
* Practice
* Goals
* Calendar
* Statistics
* Resources
* Settings

The exact navigation can be adjusted if UX testing suggests a better structure.

The active instrument should be obvious.

Provide global search.

Provide quick actions such as:

* Start Practice
* Add Piece
* Add Exercise
* Add Goal
* View Today's Practice

---

# 7. GLOBAL PRACTICE TIMER

There should be ONE global practice timer.

It should persist while navigating throughout the application.

For example:

User starts practicing piano.

They can navigate from:

Dashboard → Repertoire → Piece → Passage → Notes

without losing the timer.

The active timer should be visible in the application shell.

The timer should support:

* Start
* Pause
* Resume
* Stop
* Cancel
* Elapsed time
* Current instrument
* Current item being practiced
* Optional passage/task
* Optional objective

When stopping the timer, open a lightweight session completion workflow.

The timer should be resilient to accidental navigation or browser state changes.

Store enough information server-side to prevent obvious loss of a long practice session.

---

# 8. PRACTICE SESSION

A practice session should contain:

* Instrument
* Start timestamp
* End timestamp
* Duration
* Piece or exercise
* Optional movement
* Optional section
* Optional passage
* Practice objective
* Notes
* Results
* Confidence/difficulty information where appropriate
* Audio recordings
* Tags
* User-created metadata

A single session may involve multiple pieces/passages.

Support a session structure such as:

Practice Session
├── Piece A — 18 minutes
│   ├── Passage 1 — 8 minutes
│   └── Passage 2 — 10 minutes
└── Exercise B — 12 minutes

However, maintain the global timer concept rather than requiring the user to manually create separate timers.

The UX should make switching between practice items quick.

---

# 9. PRACTICE SESSION COMPLETION

When the user ends a session, show a concise but useful review screen.

Example:

SESSION COMPLETE

Duration: 34:18

Practiced:
Rachmaninoff — Variation 18

Passages:
mm. 42–58

Objective:
Increase tempo

Previous BPM:
80

Current BPM:
88

Result:
☑ Improved accuracy
☑ Increased tempo
☐ Memorized
☐ Performance ready

Confidence:
7 / 10

Notes:
"Left hand still tense around mm. 53."

Next time:
"Start at 84 BPM and isolate LH."

Do not force every field.

The user should be able to simply press:

**Save Session**

without filling out anything else.

---

# 10. PRACTICE OBJECTIVES

Allow users to define structured objectives for practice.

Examples:

* Learn notes
* Memorize
* Increase tempo
* Improve accuracy
* Improve rhythm
* Improve dynamics
* Improve articulation
* Improve technique
* Fix a specific mistake
* Performance preparation
* Sight reading
* Maintain repertoire
* Custom objective

Objectives should optionally contain measurable targets.

Example:

Current BPM: 80
Target BPM: 100

Or:

Current confidence: 5/10
Target confidence: 8/10

Or:

Current status: Learning
Target status: Performance Ready

The objective should be attached to the relevant piece/section/passage where appropriate.

Practice history should allow users to see whether objectives are actually progressing.

---

# 11. REPERTOIRE MANAGEMENT

Create a sophisticated but easy-to-use repertoire manager.

A repertoire entry should support:

* Composer/creator
* Work title
* Movement
* Instrument
* Genre
* Era/period
* Difficulty
* Status
* Tags
* Notes
* External links
* Attachments
* Audio/reference recordings
* Score files
* Practice history
* Goals
* Practice passages

Use the following simple piece lifecycle:

* Not Started
* Learning
* Polishing
* Performance Ready
* Maintained
* Archived

Do not replace this with complicated percentage-based progress.

The status should be the primary human-readable progress indicator.

---

# 12. FIXED MUSICAL HIERARCHY

Use a predictable fixed hierarchy:

Instrument
→ Work
→ Movement
→ Section
→ Practice Passage

A work may have zero or more movements.

A movement may have zero or more sections.

A section may have zero or more practice passages.

Not every work needs every level.

For example:

Piano
→ Rachmaninoff — Rhapsody on a Theme of Paganini
→ Variation 18
→ Climax
→ mm. 42–58

A simple song could simply be:

Guitar
→ Song
→ Verse

Do not implement arbitrary recursive nesting.

The hierarchy should remain predictable.

---

# 13. PRACTICE PASSAGES

Practice passages are important.

A passage should support:

* Name
* Start measure/position
* End measure/position
* Description
* Difficulty
* Objective
* Current tempo
* Target tempo
* Hands/parts when applicable
* Notes
* Tags
* Practice history

Do not assume every instrument has measures or hands.

Fields should adapt appropriately.

For example:

Piano:

* Measures
* Hands

Guitar:

* Measures
* Strings/fingering

Voice:

* Time/lyrics/section

Drums:

* Bars/patterns

Make instrument-specific metadata extensible rather than embedding piano assumptions into the core data model.

---

# 14. EXERCISES

Separate exercises from repertoire.

Examples:

Piano:

* Scales
* Arpeggios
* Hanon
* Sight reading

Guitar:

* Scales
* Chord transitions
* Picking exercises
* Finger independence

Exercises should support:

* Name
* Category
* Instrument
* Difficulty
* Description
* Goals
* Practice history
* Notes
* Resources

This distinction must exist in the database so statistics can separately analyze:

Repertoire practice

versus

Technical/exercise practice.

---

# 15. MUSIC DATABASE

When adding repertoire, support both:

1. Searching a music database
2. Manual entry

Build an abstraction around the music-data provider so the application is not permanently coupled to one provider.

The search workflow should allow:

Search:
"Rachmaninoff Paganini"

Results should display useful metadata such as:

* Composer
* Work
* Year
* Instrumentation
* Genre
* Period
* Movements

The user can then add the selected work to their personal repertoire.

Do not assume every work exists in the external database.

Always provide:

**Enter manually**

External metadata should be treated as imported metadata, not authoritative truth.

Users must be able to edit imported information.

---

# 16. RESOURCES

A repertoire/work entry should support resources such as:

* PDF score
* Audio recording
* Video URL
* Spotify URL
* YouTube URL
* External website
* Notes
* Other attachments

Design a generic resource system rather than hard-coding only one provider.

---

# 17. AUDIO RECORDING

Allow users to make audio recordings during practice.

The user should be able to:

* Start recording
* Stop recording
* Play recording
* Delete recording
* Rename recording
* Associate it with a practice session
* Associate it with a piece/passage

Recordings should have timestamps and metadata.

Do not implement AI audio analysis.

Do not implement MIDI.

Audio recording is for documentation and playback.

Make storage architecture appropriate for potentially large numbers of recordings.

---

# 18. GOALS

Users can create goals.

Examples:

Practice:

"Practice piano 5 hours this week."

Repertoire:

"Learn Rachmaninoff Variation 18 by November 15."

Technique:

"Reach 120 BPM on scale exercise."

Repertoire quantity:

"Learn 10 pieces this year."

Goals should support:

* Instrument
* Goal type
* Target
* Start date
* Deadline
* Progress
* Status
* Notes

Track goal progress automatically from recorded practice data wherever possible.

Do not automatically create practice schedules.

---

# 19. PASSIVE RECOMMENDATIONS

The application should provide passive insights.

It should NOT decide what the user must practice.

Instead, show useful observations such as:

"You haven't practiced this piece in 18 days."

"This passage has been practiced 7 times without reaching its target tempo."

"Your piano practice increased 32% this month."

"You practiced 4h 12m this week."

"Your average session duration is 31 minutes."

"This piece has received 12 hours of practice over the last 90 days."

"Three active passages have not been practiced recently."

"Your average tempo increased from 72 BPM to 86 BPM."

These are observations, not commands.

Avoid manipulative notifications.

Allow users to configure/disable recommendations.

---

# 20. PRACTICE CALENDAR

Build a GitHub-contribution-style practice calendar.

Display:

* Days practiced
* Practice duration
* Number of sessions
* Instrument filters

Allow:

* Day
* Week
* Month
* Year

Hover/tap should reveal useful information.

Example:

September 28

Piano:
1h 12m

Guitar:
24m

Total:
1h 36m

The calendar should support historical data indefinitely.

---

# 21. STREAKS AND GAMIFICATION

Implement lightweight gamification.

Support:

* Current streak
* Longest streak
* Weekly practice goals
* Monthly goals
* Achievements
* Milestones
* XP/levels if they genuinely improve the experience

Do not make the app feel childish.

The visual design should remain appropriate for serious musicians.

Do not punish missed days.

Avoid unhealthy gamification mechanics.

---

# 22. STATISTICS

Build a comprehensive statistics system.

Basic statistics:

* Total practice time
* Practice time by instrument
* Practice time by piece
* Practice time by composer
* Practice time by category
* Daily practice
* Weekly practice
* Monthly practice
* Yearly practice
* Average session duration
* Number of sessions
* Practice consistency
* Streaks

Repertoire statistics:

* Pieces learned
* Pieces completed
* Pieces archived
* Pieces abandoned
* Current repertoire size
* Repertoire growth
* Time spent per piece
* Time since last practice

Passage statistics:

* Practice frequency
* Time spent
* Objective progress
* Tempo progression
* Difficulty progression

Goal statistics:

* Completed goals
* Active goals
* Failed/expired goals
* Completion rates
* Progress over time

Historical statistics:

Allow users to compare:

* This week vs previous week
* This month vs previous month
* This year vs previous year
* Custom date ranges

Retain historical practice data indefinitely.

Never destroy historical sessions merely because a piece is archived or deleted from active repertoire.

---

# 23. STATISTICS UX

Do not overwhelm the primary dashboard with every statistic.

The main dashboard should be clean.

Put advanced statistics behind a dedicated Statistics area.

Use:

* Charts
* Tables
* Cards
* Filters
* Date ranges
* Instrument filters
* Repertoire filters
* Category filters

Charts should be genuinely useful rather than decorative.

---

# 24. PRACTICE DASHBOARD

The dashboard should answer:

**What have I been doing?**

**How consistently am I practicing?**

**What am I currently working on?**

**How am I progressing?**

Suggested dashboard:

TODAY

* Practice time
* Sessions
* Current goal progress

CURRENT REPERTOIRE

* Recently practiced
* Currently learning
* Performance-ready pieces

THIS WEEK

* Practice time
* Goal progress
* Instrument breakdown

RECENT ACTIVITY

* Recent sessions

INSIGHTS

* Passive recommendations

PRACTICE CALENDAR

* Recent calendar

Keep the interface visually clean.

---

# 25. INSTRUMENT DASHBOARD

Each instrument gets its own dashboard.

Example:

PIANO

This Week
4h 32m

Current Repertoire
12 pieces

Exercises
5 active

Goals
3 active

Recent Sessions

Practice Calendar

Statistics

Insights

The guitar workspace should independently show guitar statistics.

Global dashboard can aggregate all instruments.

---

# 26. SEARCH

Implement global search.

Search across:

* Pieces
* Movements
* Sections
* Passages
* Exercises
* Practice notes
* Goals
* Resources

Search should be fast.

Support filters such as:

* Instrument
* Status
* Composer
* Genre
* Date
* Tags

---

# 27. TAGGING

Allow users to create custom tags.

Examples:

* Performance
* Difficult
* Memorization
* Technique
* Favorite
* Competition
* Classical
* Jazz
* R&B

Tags should work across relevant entities.

---

# 28. NOTES / PRACTICE JOURNAL

Practice sessions should support free-form notes.

Users should be able to record observations such as:

"Still rushing the left hand."

"Much better today."

"Need to revisit fingering."

"Memory failed at the transition."

Notes should remain searchable.

Preserve historical notes permanently.

---

# 29. DATA IMPORT / EXPORT

Implement robust data portability.

Support:

* JSON export
* JSON import
* CSV export
* Backup
* Restore

JSON should preserve the complete application data model.

CSV exports should be useful for analysis in spreadsheet software.

Clearly document what CSV exports contain.

Backups should include all relevant user data, including:

* Practice sessions
* Repertoire
* Goals
* Notes
* Metadata
* Relationships

Handle validation and versioning during imports/restores.

Never silently overwrite data.

Provide confirmation and error reporting.

---

# 30. DATA MODEL

Design a normalized relational schema.

At minimum consider entities for:

* User
* Instrument
* InstrumentSettings
* Work
* Movement
* Section
* PracticePassage
* Exercise
* PracticeSession
* PracticeSessionItem
* PracticeObjective
* Goal
* Resource
* Attachment
* AudioRecording
* Tag
* EntityTag
* PracticeNote
* Achievement
* UserSettings

You may introduce additional entities where architecturally justified.

Practice history should be append-oriented and should preserve historical records.

Avoid destructive updates that erase meaningful history.

Use IDs rather than fragile textual relationships.

Add appropriate indexes for:

* User
* Instrument
* Dates
* Practice sessions
* Repertoire
* Search
* Tags
* Goals

---

# 31. DATA INTEGRITY

Implement:

* Foreign keys
* Constraints
* Validation
* Transactions
* Referential integrity
* Proper cascading behavior
* Soft deletion where historical records must remain
* Database migrations

Deleting a repertoire item must not accidentally destroy the user's historical practice record.

Design archival behavior carefully.

---

# 32. MOBILE UX

The application must work well on mobile browsers.

Mobile practice workflow is particularly important.

A user should be able to:

1. Open app
2. Tap instrument
3. Tap piece
4. Tap Start Practice
5. Practice
6. Stop
7. Save

with minimal interaction.

Buttons must be touch-friendly.

Do not simply shrink the desktop interface.

Create responsive layouts intentionally.

---

# 33. VISUAL DESIGN

Use a clean, minimal, modern aesthetic.

References:

* Linear
* Notion
* Apple
* Modern productivity applications

Avoid:

* Excessive gradients
* Excessive animations
* Clutter
* Gamified cartoon styling
* Huge dashboards full of cards
* Unnecessary decorative elements

Use strong typography and spacing.

The interface should feel calm and focused.

Practice is the primary activity.

---

# 34. ACCESSIBILITY

Implement:

* Keyboard navigation
* Visible focus states
* Semantic HTML
* Accessible labels
* Appropriate contrast
* Screen-reader support
* Touch accessibility
* Reduced-motion support

Do not sacrifice accessibility for aesthetics.

---

# 35. PERFORMANCE

Optimize for:

* Fast initial load
* Fast navigation
* Fast search
* Efficient practice history queries
* Efficient statistics queries
* Large historical datasets

Assume that a user may eventually have:

* 10+ instruments
* Hundreds of pieces
* Thousands of practice passages
* Tens of thousands of practice sessions
* Thousands of notes
* Large audio libraries

Do not design only for a few hundred rows.

Use pagination/virtualization where appropriate.

Use aggregate queries rather than loading all historical practice data into the browser.

---

# 36. NOTIFICATIONS

Do not bombard users.

Notifications should be limited to useful passive information such as:

* Goal deadline approaching
* Repertoire hasn't been practiced recently
* Milestone achieved

Allow notification preferences.

Do not create anxiety-inducing streak reminders.

---

# 37. SETTINGS

Provide settings for:

* Account
* Profile
* Instruments
* Practice preferences
* Units
* Default session behavior
* Notifications
* Gamification
* Privacy
* Data export
* Backup/restore
* Appearance
* Accessibility

---

# 38. SECURITY

Treat user practice data as private.

Implement:

* Secure authentication
* Secure sessions/tokens
* Password hashing
* Authorization checks
* Input validation
* Rate limiting where appropriate
* Secure file handling
* Secure audio storage
* Protection against common web vulnerabilities

Never trust client-side authorization.

Every backend resource must verify ownership.

---

# 39. TESTING

Create automated tests covering:

* Authentication
* Authorization
* Practice session creation
* Timer behavior
* Session persistence
* Repertoire hierarchy
* Goal progress
* Statistics calculations
* Import/export
* Backup/restore
* Data deletion/archive behavior
* Search
* File/audio associations

Include unit tests for important domain logic.

Include integration/API tests.

Include frontend tests for critical workflows.

---

# 40. SEED DATA

Provide realistic development/demo seed data.

Include examples such as:

Instrument:
Piano

Composer:
Sergei Rachmaninoff

Work:
Rhapsody on a Theme of Paganini

Movement:
Variation 18

Sections:
Opening
Climax
Resolution

Passages:
Example measure ranges

Also include another instrument such as Guitar so the architecture demonstrates that the application is truly instrument-agnostic.

Do not hard-code these examples into production behavior.

---

# 41. ERROR STATES

Design polished states for:

* Empty dashboard
* No repertoire
* No practice history
* No goals
* Search with no results
* Failed database request
* Failed upload
* Failed audio recording
* Failed import
* Invalid backup
* Authentication failure
* Expired session

Every important state should have a useful next action.

---

# 42. LOADING STATES

Use polished skeleton/loading states.

Avoid blank screens.

Do not display spinners for tiny operations unnecessarily.

Use optimistic UI only where safe.

---

# 43. FIRST-RUN EXPERIENCE

After creating an account:

1. Welcome
2. Create first instrument
3. Optional sample repertoire
4. Optional goal
5. Arrive at dashboard

Do not force the user through a long onboarding wizard.

Allow skipping.

---

# 44. CRITICAL USER FLOWS

Prioritize these flows above everything else:

### Flow A — Start practicing

Dashboard
→ Instrument
→ Piece
→ Start Practice
→ Practice
→ Stop
→ Session Review
→ Save

This should be extremely fast.

### Flow B — Add repertoire

Instrument
→ Add Work
→ Search database
→ Select work
→ Review metadata
→ Add
→ Edit as needed

### Flow C — Create passage

Work
→ Movement
→ Section
→ Add Passage
→ Define passage metadata/objective

### Flow D — Review progress

Instrument
→ Statistics
→ Select date range
→ Analyze practice

### Flow E — Set goal

Goals
→ New Goal
→ Select instrument
→ Define target
→ Set deadline
→ Save

### Flow F — Review historical practice

Calendar
→ Select date
→ View sessions
→ Open session
→ View notes/recordings/objectives

---

# 45. UX PRIORITIES

When making design decisions, prioritize:

1. Fast practice entry
2. Data integrity
3. Clear navigation
4. Excellent mobile experience
5. Long-term historical tracking
6. Useful statistics
7. Clean visual design
8. Flexibility across instruments
9. Advanced functionality
10. Gamification

Never allow advanced functionality to make basic practice unnecessarily complicated.

---

# 46. IMPLEMENTATION EXPECTATIONS

Do not merely create static screens.

Build real functionality.

The application should have:

* Real database persistence
* Real authentication
* Real API calls
* Real practice session tracking
* Real timer
* Real repertoire relationships
* Real goal calculations
* Real statistics
* Real search
* Real import/export
* Real file/audio handling
* Real validation

Avoid fake data except for seed/demo data.

Avoid placeholder buttons.

Every visible major action should either work or clearly communicate that a feature is intentionally unavailable.

---

# 47. CODE QUALITY

Write maintainable production-quality code.

Avoid:

* Giant components
* Giant API files
* Giant database files
* Hard-coded business logic throughout UI
* Duplicated validation
* Magic constants
* Unnecessary global state
* Tight coupling between UI and persistence

Prefer:

* Domain-oriented modules
* Reusable components
* Typed API contracts
* Service/repository separation where useful
* Clear database access layer
* Centralized validation
* Testable business logic
* Small focused modules

Do not over-abstract simple functionality.

---

# 48. DOCUMENTATION

Create documentation explaining:

* Architecture
* Local development
* Environment variables
* Database setup
* Migrations
* Testing
* Deployment
* Authentication
* File storage
* Audio storage
* Import/export format
* Backup/restore
* Music database integration
* Major architectural decisions

Also provide a concise README.

---

# 49. DEPLOYMENT

Make the application deployable as a real production web application.

Document:

* Frontend deployment
* Backend deployment
* Database provisioning
* Environment configuration
* File/audio storage
* Authentication configuration
* Database migrations
* Backup strategy

Do not require unusual local infrastructure unless necessary.

---

# 50. FINAL PRODUCT STANDARD

When finished, the result should feel like a real product that a serious musician could use for years.

It should NOT feel like:

* A CRUD demo
* A generic habit tracker
* A stopwatch
* A spreadsheet
* A generic project-management app with music terminology

It should feel purpose-built around the actual workflow of learning, practicing, maintaining, and performing music.

The central idea is:

**Cadenza remembers what I practice, understands the structure of what I'm learning, shows me how I've progressed, and gives me useful context—without getting in the way of practicing.**

---

# EXECUTION INSTRUCTIONS

Before coding:

1. Analyze the requirements.
2. Resolve architectural decisions.
3. Identify potential contradictions or missing pieces.
4. Design the database schema.
5. Design the API/domain model.
6. Design the application navigation.
7. Design the critical practice workflow.
8. Create an implementation plan.

Then implement the application.

Do not stop after creating a specification.

Do not ask for confirmation after producing the plan unless a genuinely blocking ambiguity exists.

Build the application end-to-end.

After implementation:

1. Run tests.
2. Fix failures.
3. Check database migrations.
4. Check authentication/authorization.
5. Test the core practice workflow.
6. Test responsive layouts.
7. Test import/export.
8. Test statistics against known sample data.
9. Fix obvious UX problems.
10. Provide a concise final summary of what was built, architecture decisions, how to run it, and any genuinely unfinished functionality.

Favor a complete, coherent, working application over implementing an enormous number of shallow features.

If a feature must be simplified, preserve the underlying architecture so it can be expanded later.
