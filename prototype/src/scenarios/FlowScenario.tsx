import { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle2, Sparkles, Zap, List, MessageSquare, HelpCircle, Package, Play } from 'lucide-react'
import { Shell } from '../components/Shell'
import { Drawer, Bot, type Lang } from '../components/Drawer'

type Node = { id: string; x: number; y: number; title: string; sub: string; icon: typeof Zap; state?: 'error' | 'new' }

const W = 160
const H = 64

const BASE: Node[] = [
  { id: 'n1', x: 8, y: 170, title: '#1 Trigger', sub: 'Customer says "Hi"', icon: Zap },
  { id: 'n2', x: 184, y: 170, title: '#2 Welcome buttons', sub: 'Shop · Track · Help', icon: MessageSquare },
  { id: 'n3', x: 360, y: 300, title: '#3 Track order', sub: 'Shopify order lookup', icon: Package },
]
const BROKEN: Node[] = [...BASE, { id: 'n4', x: 360, y: 60, title: '#4 Product catalog list', sub: '14 rows · no fallback', icon: List, state: 'error' }]
const FIXED: Node[] = [
  ...BASE,
  { id: 'n4', x: 360, y: 40, title: '#4 Bestsellers list', sub: '10 rows incl. See more', icon: List, state: 'new' },
  { id: 'n4b', x: 536, y: 10, title: '#4b More products', sub: '5 rows', icon: List, state: 'new' },
  { id: 'n5', x: 536, y: 120, title: '#5 Fallback', sub: 'Pick from the list 🙏', icon: HelpCircle, state: 'new' },
]
const EDGES_BROKEN: [string, string][] = [['n1', 'n2'], ['n2', 'n4'], ['n2', 'n3']]
const EDGES_FIXED: [string, string][] = [['n1', 'n2'], ['n2', 'n4'], ['n2', 'n3'], ['n4', 'n4b'], ['n4', 'n5']]

function Canvas({ nodes, edges, highlight }: { nodes: Node[]; edges: [string, string][]; highlight: boolean }) {
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]))
  return (
    <div className="relative h-[400px] min-w-[700px] rounded-xl border border-slate-200 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
      <svg className="absolute inset-0 h-full w-full">
        {edges.map(([a, b]) => {
          const A = byId[a], B = byId[b]
          const x1 = A.x + W, y1 = A.y + H / 2, x2 = B.x, y2 = B.y + H / 2
          const fresh = B.state === 'new' && A.state === 'new'
          return (
            <path key={a + b} d={`M${x1},${y1} C${x1 + 40},${y1} ${x2 - 40},${y2} ${x2},${y2}`}
              fill="none" stroke={fresh ? '#10a37f' : '#94a3b8'} strokeWidth={2} strokeDasharray={fresh ? '6 4' : undefined} />
          )
        })}
      </svg>
      {nodes.map((n) => {
        const Icon = n.icon
        const err = n.state === 'error'
        return (
          <div key={n.id} style={{ left: n.x, top: n.y, width: W, height: H }}
            className={`absolute animate-fadein rounded-lg border-2 bg-white p-2.5 shadow-sm ${
              err ? `border-rose-400 ${highlight ? 'ring-4 ring-rose-200' : ''}` : n.state === 'new' ? 'border-emerald-400' : 'border-slate-200'
            }`}>
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <Icon size={13} className={err ? 'text-rose-500' : 'text-brand-600'} /> {n.title}
              {err && <AlertTriangle size={13} className="ml-auto text-rose-500" />}
              {n.state === 'new' && <CheckCircle2 size={13} className="ml-auto text-emerald-500" />}
            </div>
            <div className="mt-1 text-[11px] text-slate-500">{n.sub}</div>
          </div>
        )
      })}
    </div>
  )
}

export function FlowScenario({ resetKey }: { resetKey: number }) {
  const [fixed, setFixed] = useState(false)
  const [open, setOpen] = useState(false)
  const [lang, setLang] = useState<Lang>('en')
  const [published, setPublished] = useState(false)
  useEffect(() => { setFixed(false); setOpen(false); setPublished(false) }, [resetKey])

  return (
    <>
      <Shell active="flows" shift={open} onCopilot={() => setOpen(true)}>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500">Chatbot Flows · WhatsApp</div>
            <h1 className="text-xl font-bold text-slate-900">Diwali Shop Bot</h1>
          </div>
          <div className="flex gap-2">
            {!fixed ? (
              <>
                <span className="pill self-center bg-rose-100 text-rose-700"><AlertTriangle size={12} /> 1 node not working</span>
                <button onClick={() => setOpen(true)} className="btn animate-glow bg-brand-600 text-white"><Sparkles size={14} /> Find & fix with Co-Pilot</button>
              </>
            ) : (
              <button onClick={() => setPublished(true)} disabled={published} className="btn-primary">
                <Play size={14} /> {published ? 'Published ✓' : 'Publish flow'}
              </button>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <Canvas nodes={fixed ? FIXED : BROKEN} edges={fixed ? EDGES_FIXED : EDGES_BROKEN} highlight={open && !fixed} />
        </div>
        {!fixed && (
          <div className="mt-3 text-xs text-slate-500">
            Customers who tap <b>Shop</b> get no reply. Riya has tried 3 times and was about to raise a ticket.
          </div>
        )}
      </Shell>

      <Drawer open={open} onClose={() => setOpen(false)} lang={lang} setLang={setLang} context="Flow · Diwali Shop Bot · node #4">
        <Bot>
          {lang === 'en'
            ? <>I checked all 4 nodes. <b>Node #4 (Product catalog list)</b> is the problem — I've highlighted it on the canvas.</>
            : <>Maine 4 nodes check kiye. Problem <b>Node #4 (Product catalog list)</b> mein hai — canvas pe highlight kar diya hai.</>}
        </Bot>
        <div className="space-y-2">
          <div className="rounded-lg border border-slate-200 p-3 text-xs">
            <div className="mb-1 font-semibold text-slate-800">1. Too many rows</div>
            {lang === 'en'
              ? 'WhatsApp list messages allow max 10 rows. Yours has 14, so WhatsApp refuses to send it — the customer sees nothing.'
              : 'WhatsApp list message mein max 10 rows allowed hain. Aapke 14 hain, isliye message jaata hi nahi.'}
          </div>
          <div className="rounded-lg border border-slate-200 p-3 text-xs">
            <div className="mb-1 font-semibold text-slate-800">2. No fallback</div>
            {lang === 'en'
              ? 'If a customer types instead of tapping a row, the flow has nowhere to go and stops.'
              : 'Agar customer row tap karne ki jagah type kare, flow ruk jaata hai.'}
          </div>
        </div>
        <div className="rounded-lg bg-brand-50 p-3 text-xs text-brand-900">
          <b>Suggested fix:</b> keep your top 9 products + a “See more” row in list #4, move the other 5 to list #4b, and add a fallback reply.
        </div>
        {!fixed ? (
          <button onClick={() => setFixed(true)} className="btn-primary w-full justify-center"><Sparkles size={15} /> Split list & connect fallback</button>
        ) : (
          <Bot>
            <div className="font-semibold text-emerald-700">✅ Done — 3 nodes updated on the canvas (green).</div>
            <div className="mt-1 text-xs">Test passed: sent the list to your test number (+91 9xxxx x4210). Review and hit <b>Publish flow</b> — I won't publish for you.</div>
          </Bot>
        )}
        {published && <div className="text-center text-xs text-slate-500">Flow is live. Logged as <b>self-serve resolved</b>.</div>}
      </Drawer>
    </>
  )
}
