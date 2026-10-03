import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number }

const iconPaths: Record<string, string> = {
  music: 'M9 18V5l12-2v13M9 9l12-2M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm12-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  dashboard: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  list: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
  sliders: 'M4 6h16M4 12h16M4 18h16M8 4v4M16 10v4M10 16v4',
  note: 'M5 4h14v16H5zM8 8h8M8 12h8M8 16h5',
  target: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-5a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-4a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  calendar: 'M5 4h14v16H5zM8 2v4M16 2v4M5 9h14M9 13h.01M12 13h.01M15 13h.01M9 17h.01M12 17h.01',
  chart: 'M4 19V5M4 19h17M8 16v-3M12 16V8M16 16v-6M20 16V4',
  settings: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 1.7-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2.4v-.2a1.7 1.7 0 0 0-1.04-1.56 1.7 1.7 0 0 0-1.87.34l-.07.06-1.7-1.7.07-.06A1.7 1.7 0 0 0 8.46 15a1.7 1.7 0 0 0-1.56-1.03h-.2v-2.4h.2A1.7 1.7 0 0 0 8.46 10a1.7 1.7 0 0 0-.34-1.88l-.07-.06 1.7-1.7.07.06a1.7 1.7 0 0 0 1.87.34A1.7 1.7 0 0 0 12.73 5.2V5h2.4v.2a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.7 1.7-.06.06A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.56 1.03h.2v2.4h-.2A1.7 1.7 0 0 0 19.4 15Z',
  plus: 'M12 5v14M5 12h14',
  search: 'm21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4',
  play: 'm8 5 11 7-11 7V5Z',
  pause: 'M8 5v14M16 5v14',
  square: 'M6 6h12v12H6z',
  x: 'm6 6 12 12M18 6 6 18',
  check: 'm5 12 4 4L19 6',
  circlecheck: 'm8 12 3 3 5-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  arrowright: 'M5 12h14M13 6l6 6-6 6',
  arrowup: 'M5 19 19 5M9 5h10v10',
  arrowdown: 'M5 5 19 19M19 9v10H9',
  chevron: 'm9 18 6-6-6-6',
  clock: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  flame: 'M12 22c4 0 7-2.7 7-7 0-3-2-5.4-4.2-7.7.1 2-1.2 3.2-2.2 3.7.2-3.5-1.5-6.4-4.1-8C8 7.5 5 10.2 5 15c0 4.3 3 7 7 7Z',
  filter: 'M4 5h16l-6 7v5l-4 2v-7L4 5Z',
  sparkles: 'm12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3ZM19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z',
  trophy: 'M8 4h8v4a4 4 0 0 1-8 0V4ZM12 12v5M8 20h8M5 5v2a3 3 0 0 0 3 3M19 5v2a3 3 0 0 1-3 3',
  more: 'M6 12h.01M12 12h.01M18 12h.01',
  menu: 'M4 6h16M4 12h16M4 18h16',
  download: 'M12 3v12M7 10l5 5 5-5M5 21h14',
  upload: 'M12 15V3M7 8l5-5 5 5M5 21h14',
  external: 'M14 5h5v5M19 5l-8 8M17 13v5H5V6h5',
  folder: 'M3 6h7l2 2h9v10H3z',
  headphones: 'M4 15v-3a8 8 0 0 1 16 0v3M4 15h3v5H5a1 1 0 0 1-1-1v-4ZM20 15h-3v5h2a1 1 0 0 0 1-1v-4Z',
  help: 'M9.1 9a3 3 0 1 1 5.7 1.3c-.8.8-1.8 1.2-2.3 2.2v.5M12 17h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  rotate: 'M4 12a8 8 0 0 1 13.7-5.7L20 8M20 4v4h-4M20 12a8 8 0 0 1-13.7 5.7L4 16M4 20v-4h4',
  file: 'M6 3h8l4 4v14H6zM14 3v5h5M9 13h6M9 17h6',
  mic: 'M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3ZM5 11a7 7 0 0 0 14 0M12 18v3M8 21h8',
  guitar: 'M18 3l3 3-4 4-2-2 3-3ZM14 8l-3 3M10 12c-2-2-4-1-5 0-2 2-2 5 0 6 2 1 4 0 4-2 0-1-1-3-3-4Z',
  piano: 'M4 5h16v14H4zM8 5v7M12 5v7M16 5v7M6 15h2M10 15h2M14 15h2M18 15h-2',
  book: 'M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2V4ZM7 20a2 2 0 0 1 2-2h10',
  timer: 'M12 8v4l2 2M9 2h6M12 2v2M19 5l-1.5 1.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
}

function Glyph({ name, size = 18, strokeWidth = 1.8, ...props }: IconProps & { name: string }) {
  const path = iconPaths[name] ?? iconPaths.circlecheck
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={path} /></svg>
}

const icon = (name: string) => (props: IconProps) => <Glyph name={name} {...props} />

export const ArrowDownRight = icon('arrowdown')
export const ArrowRight = icon('arrowright')
export const ArrowUpRight = icon('arrowup')
export const BarChart3 = icon('chart')
export const Bell = icon('bell')
export const BookOpen = icon('book')
export const CalendarDays = icon('calendar')
export const Check = icon('check')
export const CheckCircle2 = icon('circlecheck')
export const ChevronDown = (props: IconProps) => <Glyph name="chevron" {...props} style={{ transform: 'rotate(90deg)', ...props.style }} />
export const ChevronLeft = (props: IconProps) => <Glyph name="chevron" {...props} style={{ transform: 'rotate(180deg)', ...props.style }} />
export const ChevronRight = icon('chevron')
export const Circle = icon('circlecheck')
export const CircleAlert = icon('help')
export const CircleDot = icon('circlecheck')
export const Clock3 = icon('clock')
export const Download = icon('download')
export const ExternalLink = icon('external')
export const FileJson = icon('file')
export const Filter = icon('filter')
export const Flame = icon('flame')
export const FolderOpen = icon('folder')
export const Guitar = icon('guitar')
export const Headphones = icon('headphones')
export const HelpCircle = icon('help')
export const LayoutDashboard = icon('dashboard')
export const ListMusic = icon('list')
export const Menu = icon('menu')
export const Mic2 = icon('mic')
export const MoreHorizontal = icon('more')
export const Music2 = icon('music')
export const NotebookPen = icon('note')
export const Pause = icon('pause')
export const Piano = icon('piano')
export const Play = icon('play')
export const Plus = icon('plus')
export const RotateCcw = icon('rotate')
export const Save = icon('check')
export const Search = icon('search')
export const Settings2 = icon('settings')
export const SlidersHorizontal = icon('sliders')
export const Sparkles = icon('sparkles')
export const Square = icon('square')
export const Target = icon('target')
export const TimerReset = icon('timer')
export const Trash2 = icon('trash')
export const Trophy = icon('trophy')
export const Upload = icon('upload')
export const X = icon('x')
