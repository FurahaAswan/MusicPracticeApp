import type { AppState } from './types'

const now = new Date()
const ago = (days: number, hour = 18) => {
  const date = new Date(now)
  date.setDate(date.getDate() - days)
  date.setHours(hour, 0, 0, 0)
  return date.toISOString()
}

export const seedState: AppState = {
  instruments: [
    { id: 'piano', name: 'Piano', type: 'keys', accent: '#7c6cf2', practiceGoalMinutes: 300 },
    { id: 'guitar', name: 'Guitar', type: 'strings', accent: '#d79a58', practiceGoalMinutes: 180 },
  ],
  works: [
    {
      id: 'rachmaninoff-variation', instrumentId: 'piano', composer: 'Sergei Rachmaninoff', title: 'Variation 18', subtitle: 'Rhapsody on a Theme of Paganini', genre: 'Romantic', status: 'Polishing', lastPracticed: ago(0), totalMinutes: 286, tags: ['Performance', 'Favorite'], color: '#8b78f4',
      passages: [
        { id: 'passage-climax', name: 'The long line', detail: 'mm. 42–58 · LH voicing', currentBpm: 88, targetBpm: 96, practicedCount: 7 },
        { id: 'passage-resolution', name: 'Resolution', detail: 'mm. 84–96 · pedal change', currentBpm: 76, targetBpm: 84, practicedCount: 4 },
      ],
    },
    {
      id: 'debussy-arabesque', instrumentId: 'piano', composer: 'Claude Debussy', title: 'Arabesque No. 1', subtitle: 'Deux Arabesques', genre: 'Impressionist', status: 'Learning', lastPracticed: ago(1), totalMinutes: 154, tags: ['Texture'], color: '#e7a85e',
      passages: [{ id: 'passage-arab-a', name: 'Opening texture', detail: 'mm. 1–16 · even triplets', currentBpm: 62, targetBpm: 72, practicedCount: 5 }],
    },
    {
      id: 'radiohead-weird-fishes', instrumentId: 'guitar', composer: 'Radiohead', title: 'Weird Fishes / Arpeggi', subtitle: 'In Rainbows · fingerstyle arrangement', genre: 'Alternative', status: 'Maintained', lastPracticed: ago(3), totalMinutes: 209, tags: ['Fingerstyle', 'Favorite'], color: '#59b5aa',
      passages: [{ id: 'passage-fishes', name: 'Picking pattern', detail: 'Verse · 16th-note flow', currentBpm: 104, targetBpm: 120, practicedCount: 9 }],
    },
    {
      id: 'bach-invention', instrumentId: 'piano', composer: 'J. S. Bach', title: 'Invention No. 8', subtitle: 'BWV 779', genre: 'Baroque', status: 'Performance ready', lastPracticed: ago(8), totalMinutes: 198, tags: ['Counterpoint'], color: '#4c9cd5',
      passages: [{ id: 'passage-bach', name: 'Middle entry', detail: 'mm. 18–26 · hands together', currentBpm: 108, targetBpm: 108, practicedCount: 3 }],
    },
  ],
  exercises: [
    { id: 'scales-major', instrumentId: 'piano', name: 'Major scales · all keys', category: 'Technique', detail: 'Quarter = 104 · two octaves', totalMinutes: 88, lastPracticed: ago(0) },
    { id: 'hanon-20', instrumentId: 'piano', name: 'Hanon No. 20', category: 'Finger independence', detail: 'Relaxed rotation · 6 reps', totalMinutes: 42, lastPracticed: ago(2) },
    { id: 'guitar-chords', instrumentId: 'guitar', name: 'Chord transitions', category: 'Technique', detail: 'G → C → Em → D · 80 bpm', totalMinutes: 64, lastPracticed: ago(1) },
  ],
  sessions: [
    { id: 's1', startedAt: ago(0, 19), endedAt: ago(0, 19, ), durationMinutes: 38, instrumentId: 'piano', itemType: 'work', itemId: 'rachmaninoff-variation', itemName: 'Variation 18', objective: 'Increase tempo', notes: 'The long line is settling. Keep the left hand warm.', result: 'Improved accuracy', confidence: 8 },
    { id: 's2', startedAt: ago(0, 17), endedAt: ago(0, 17), durationMinutes: 24, instrumentId: 'piano', itemType: 'exercise', itemId: 'scales-major', itemName: 'Major scales · all keys', objective: 'Improve evenness', result: 'Felt more centered', confidence: 7 },
    { id: 's3', startedAt: ago(1, 18), endedAt: ago(1, 18), durationMinutes: 42, instrumentId: 'piano', itemType: 'work', itemId: 'debussy-arabesque', itemName: 'Arabesque No. 1', objective: 'Improve rhythm', notes: 'Metronome at 62; less rushing in the inner voice.', result: 'Improved accuracy', confidence: 7 },
    { id: 's4', startedAt: ago(2, 17), endedAt: ago(2, 17), durationMinutes: 31, instrumentId: 'guitar', itemType: 'work', itemId: 'radiohead-weird-fishes', itemName: 'Weird Fishes / Arpeggi', objective: 'Increase tempo', result: 'Increased tempo', confidence: 8 },
    { id: 's5', startedAt: ago(3, 18), endedAt: ago(3, 18), durationMinutes: 28, instrumentId: 'piano', itemType: 'work', itemId: 'rachmaninoff-variation', itemName: 'Variation 18', objective: 'Improve voicing', notes: 'Listen for the melody through the texture.', confidence: 7 },
    { id: 's6', startedAt: ago(4, 17), endedAt: ago(4, 17), durationMinutes: 36, instrumentId: 'piano', itemType: 'exercise', itemId: 'hanon-20', itemName: 'Hanon No. 20', objective: 'Improve technique', result: 'More relaxed', confidence: 8 },
    { id: 's7', startedAt: ago(5, 16), endedAt: ago(5, 16), durationMinutes: 27, instrumentId: 'guitar', itemType: 'exercise', itemId: 'guitar-chords', itemName: 'Chord transitions', objective: 'Improve rhythm', confidence: 6 },
    { id: 's8', startedAt: ago(6, 18), endedAt: ago(6, 18), durationMinutes: 46, instrumentId: 'piano', itemType: 'work', itemId: 'bach-invention', itemName: 'Invention No. 8', objective: 'Maintain repertoire', result: 'Performance ready', confidence: 9 },
    { id: 's9', startedAt: ago(7, 17), endedAt: ago(7, 17), durationMinutes: 34, instrumentId: 'piano', itemType: 'work', itemId: 'rachmaninoff-variation', itemName: 'Variation 18', objective: 'Increase tempo', confidence: 7 },
    { id: 's10', startedAt: ago(10, 18), endedAt: ago(10, 18), durationMinutes: 52, instrumentId: 'piano', itemType: 'work', itemId: 'debussy-arabesque', itemName: 'Arabesque No. 1', objective: 'Learn notes', confidence: 6 },
  ],
  goals: [
    { id: 'g1', title: 'Practice piano 5 hours this week', type: 'Practice', instrumentId: 'piano', targetMinutes: 300, progressMinutes: 268, deadline: ago(-3), status: 'On track' },
    { id: 'g2', title: 'Variation 18 at 96 BPM', type: 'Technique', instrumentId: 'piano', current: 88, target: 96, deadline: ago(-16), status: 'On track' },
    { id: 'g3', title: 'Keep guitar in rotation', type: 'Repertoire', instrumentId: 'guitar', targetMinutes: 180, progressMinutes: 88, deadline: ago(-7), status: 'Needs attention' },
  ],
}
