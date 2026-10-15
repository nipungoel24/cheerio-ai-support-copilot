import { useEffect, useState } from 'react'
import { ShieldAlert, CheckCircle2, ChevronDown, ChevronRight, Send, Ban, UserRound, Phone, Clock } from 'lucide-react'
import { Shell } from '../components/Shell'
import { Drawer, Bot, User, type Lang } from '../components/Drawer'

const CHECKS = [
  'Display name follows Meta naming rules',
  'Phone number not registered on another WhatsApp app',
  'Business website & legal name match',
  'Payment method attached in Meta Business Manager',
]

const PACKET = [
  ['WABA ID', '109482910384'],
  ['Phone', '+91 98765 43210'],
  ['Meta error', '#131031 · Business account restricted'],
  ['Verification', 'Pending > 72 hrs'],
  ['Display name check', 'Passed'],
  ['Checks done by Co-Pilot', '4 / 4 passed'],
  ['User sentiment', 'Frustrated · campaign launch blocked'],
  ['Plan', 'Starter · 14 months · ₹0 dues'],
]

export function EscalationScenario({ resetKey }: { resetKey: number }) {
  const [open, setOpen] = useState(true)
  const [lang, setLang] = useState<Lang>('en')
  const [asked, setAsked] = useState(false)
  const [packetOpen, setPacketOpen] = useState(true)
  const [ticket, setTicket] = useState(false)
  useEffect(() => { setOpen(true); setAsked(false); setTicket(false); setPacketOpen(true) }, [resetKey])

  return (
    <>
      <Shell active="settings" shift={open} onCopilot={() => setOpen(true)}>
        <div className="mb-4">
          <div className="text-xs text-slate-500">WhatsApp Setup</div>
          <h1 className="text-xl font-bold text-slate-900">WhatsApp Business Number</h1>
        </div>
        <div className="card max-w-2xl p-5">
          <div className="flex items-start gap-4">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-rose-100 text-rose-600"><Phone size={20} /></div>
            <div className="flex-1">
              <div className="font-semibold">+91 98765 43210 · Glow Skincare</div>
              <div className="mt-1 flex flex-wrap gap-2">
                <span className="pill bg-rose-100 text-rose-700"><ShieldAlert size={12} /> Restricted · Error #131031</span>
                <span className="pill bg-amber-100 text-amber-700"><Clock size={12} /> Meta business verification pending &gt; 72 hrs</span>
              </div>
              <p className="mt-3 text-sm text-slate-600">
                You can't send messages from this number until Meta lifts the restriction. Scheduled campaigns are paused.
              </p>
            </div>
          </div>
          {ticket && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
              <CheckCircle2 size={16} /> Ticket <b>#CH-8842</b> with Cheerio BSP specialist · Est. first reply 14 min
            </div>
          )}
        </div>
      </Shell>

      <Drawer open={open} onClose={() => setOpen(false)} lang={lang} setLang={setLang} context="WhatsApp Setup · +91 98765 43210">
        <Bot>
          {lang === 'en'
            ? <>I see your number is <b>restricted by Meta (#131031)</b> and verification has been pending for 3+ days. I've already run 4 checks on your side:</>
            : <>Aapka number <b>Meta ne restrict kiya hai (#131031)</b> aur verification 3+ din se pending hai. Maine aapki taraf se 4 checks kar liye hain:</>}
          <div className="mt-2 space-y-1">
            {CHECKS.map((c) => <div key={c} className="flex items-center gap-1.5 text-xs"><CheckCircle2 size={13} className="text-emerald-500" /> {c}</div>)}
          </div>
        </Bot>

        {!asked ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-3">
            <div className="mb-2 text-[11px] text-slate-500">Try what a stressed user would type:</div>
            <button onClick={() => setAsked(true)} className="btn-ghost w-full justify-between">
              “Just approve my number right now!” <Send size={14} />
            </button>
          </div>
        ) : (
          <>
            <User>Just approve my number right now!</User>
            <Bot>
              <div className="mb-2 flex items-center gap-1.5 font-semibold text-slate-800"><Ban size={14} className="text-rose-500" />
                {lang === 'en' ? "I can't do that — and I won't pretend to." : 'Main yeh nahi kar sakta — aur jhooth nahi bolunga.'}
              </div>
              <div className="text-xs leading-relaxed">
                {lang === 'en'
                  ? <>Only Meta can lift a restriction. Cheerio has to raise it with Meta through our <b>BSP partner channel</b>, which needs a human specialist. Anything I say like “approved” would be false.</>
                  : <>Restriction sirf Meta hata sakta hai. Cheerio ko yeh hamare <b>BSP partner channel</b> se Meta ke saath uthana padega — iske liye human specialist chahiye. Main “approved” bolun toh woh galat hoga.</>}
              </div>
              <div className="mt-2 text-xs font-medium text-slate-700">{lang === 'en' ? "What I've done: packed everything a specialist needs, so you don't have to explain again." : 'Maine specialist ke liye sab kuch ready kar diya hai — aapko dobara explain nahi karna padega.'}</div>
            </Bot>

            <div className="rounded-lg border border-slate-200">
              <button onClick={() => setPacketOpen(!packetOpen)} className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold">
                <span className="flex items-center gap-1.5"><UserRound size={14} /> Diagnostic packet for specialist (auto-filled)</span>
                {packetOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              {packetOpen && (
                <div className="border-t border-slate-100 px-3 py-2 font-mono text-[11px]">
                  {PACKET.map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3 py-0.5"><span className="text-slate-500">{k}</span><span className="text-right text-slate-800">{v}</span></div>
                  ))}
                  <div className="mt-1 text-slate-500">+ Meta webhook log (last 72h) · 3 screenshots attached</div>
                </div>
              )}
            </div>

            {!ticket ? (
              <button onClick={() => setTicket(true)} className="btn-primary w-full justify-center">
                Escalate to Cheerio BSP specialist · est. wait 14 min
              </button>
            ) : (
              <Bot>
                <div className="font-semibold text-emerald-700">✅ Ticket #CH-8842 created</div>
                <div className="mt-1 text-xs">Zero typing needed. You'll get updates on WhatsApp and email. Meanwhile, your campaigns stay paused (not cancelled), so nothing is lost.</div>
              </Bot>
            )}
          </>
        )}
      </Drawer>
    </>
  )
}
