import type { ReactNode } from 'react'
import { Sparkles, X } from 'lucide-react'

export type Lang = 'en' | 'hi'

export function Drawer({
  open, onClose, lang, setLang, children, context,
}: { open: boolean; onClose: () => void; lang: Lang; setLang: (l: Lang) => void; children: ReactNode; context: string }) {
  if (!open) return null
  return (
    <div className="fixed bottom-0 right-0 top-16 z-40 flex w-full max-w-[440px] animate-slidein flex-col border-l border-slate-200 bg-white shadow-2xl">
      <div className="flex items-center justify-between bg-gradient-to-r from-brand-700 to-teal-600 px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <Sparkles size={18} />
          <div>
            <div className="text-sm font-semibold">Cheerio Co-Pilot</div>
            <div className="text-[11px] opacity-80">Looking at: {context}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-full bg-white/15 p-0.5 text-[11px]">
            {(['en', 'hi'] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`rounded-full px-2.5 py-0.5 ${lang === l ? 'bg-white font-semibold text-brand-700' : ''}`}
              >
                {l === 'en' ? 'English' : 'Hinglish'}
              </button>
            ))}
          </div>
          <button onClick={onClose} aria-label="Close Co-Pilot"><X size={18} /></button>
        </div>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto p-4">{children}</div>
      <div className="border-t border-slate-100 px-4 py-2 text-[10px] text-slate-400">
        Co-Pilot only changes things after you click. It never sends campaigns or changes billing on its own.
      </div>
    </div>
  )
}

export function Bot({ children }: { children: ReactNode }) {
  return (
    <div className="flex animate-fadein gap-2">
      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-700"><Sparkles size={14} /></div>
      <div className="min-w-0 flex-1 rounded-xl rounded-tl-none bg-slate-100 p-3 text-sm">{children}</div>
    </div>
  )
}

export function User({ children }: { children: ReactNode }) {
  return (
    <div className="flex animate-fadein justify-end">
      <div className="max-w-[80%] rounded-xl rounded-tr-none bg-brand-600 p-3 text-sm text-white">{children}</div>
    </div>
  )
}
