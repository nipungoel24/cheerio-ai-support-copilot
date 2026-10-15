import { RotateCcw, Eye } from 'lucide-react'

export type ScenarioId = 's1' | 's2' | 's3' | 's4'

const ITEMS: { id: ScenarioId; label: string; sub: string }[] = [
  { id: 's1', label: '1 · Template rejected', sub: 'Main journey' },
  { id: 's2', label: '2 · Broken chatbot flow', sub: 'Guided canvas fix' },
  { id: 's3', label: '3 · Number restricted', sub: 'Edge case → human' },
  { id: 's4', label: '4 · Cost & audit view', sub: 'Internal PM view' },
]

export function ScenarioBar({ active, onChange, onReset }: { active: ScenarioId; onChange: (s: ScenarioId) => void; onReset: () => void }) {
  return (
    <div className="sticky top-0 z-50 flex h-16 items-center gap-3 overflow-x-auto bg-slate-900 px-4 text-white">
      <div className="flex shrink-0 items-center gap-2 pr-2 text-xs text-slate-300">
        <Eye size={14} /> <span className="font-semibold text-white">Reviewer mode</span>
      </div>
      {ITEMS.map((it) => (
        <button
          key={it.id}
          onClick={() => onChange(it.id)}
          className={`shrink-0 rounded-lg px-3 py-1.5 text-left transition ${
            active === it.id ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <div className="text-xs font-semibold">{it.label}</div>
          <div className="text-[10px] opacity-75">{it.sub}</div>
        </button>
      ))}
      <button onClick={onReset} className="ml-auto flex shrink-0 items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800">
        <RotateCcw size={13} /> Reset scenario
      </button>
    </div>
  )
}
