import { useEffect, useState } from 'react'
import {
  AlertTriangle, CheckCircle2, Sparkles, Loader2, ThumbsUp, ThumbsDown, ArrowRight, Tag, Braces, MousePointerClick, FileText,
} from 'lucide-react'
import { Shell } from '../components/Shell'
import { Drawer, Bot, User, type Lang } from '../components/Drawer'

type Stage = 'rejected' | 'diagnosed' | 'validating' | 'approved' | 'thanks' | 'human'

const BEFORE = {
  category: 'UTILITY',
  body: 'Hi {{1}}, our Diwali Mega Sale is LIVE! Get Flat 30% OFF on all skincare. Use this code at checkout: {{2}}',
  button: 'Claim Your 30% Diwali Discount Now',
}
const AFTER = {
  category: 'MARKETING',
  body: 'Hi {{1}}, our Diwali Mega Sale is LIVE! Get Flat 30% OFF on all skincare. Use code {{2}} at checkout. Happy Diwali!',
  button: 'Claim 30% Off',
  footer: 'Reply STOP to unsubscribe',
}

const CAUSES = {
  en: [
    { icon: Tag, title: 'Wrong category', text: 'Submitted as UTILITY, but "Flat 30% OFF" is a promotion. Meta only allows offers in MARKETING templates.' },
    { icon: Braces, title: 'Message ends with a variable', text: 'The body ends with {{2}}. Meta rejects templates that start or end with a variable. We need text after it.' },
    { icon: MousePointerClick, title: 'Button text too long', text: '"Claim Your 30% Diwali Discount Now" is 34 characters. Quick-reply buttons allow max 25.' },
  ],
  hi: [
    { icon: Tag, title: 'Category galat hai', text: 'Aapne UTILITY chuna, par "Flat 30% OFF" ek offer hai. Offers sirf MARKETING category mein allowed hain.' },
    { icon: Braces, title: 'Message variable pe khatam ho raha hai', text: 'Body {{2}} pe end ho rahi hai. Meta aise templates reject karta hai. Variable ke baad thoda text chahiye.' },
    { icon: MousePointerClick, title: 'Button text bahut lamba hai', text: '"Claim Your 30% Diwali Discount Now" 34 characters ka hai. Limit 25 characters hai.' },
  ],
}

const CHECKS = ['Category matches content', 'No variable at start/end', 'Button text ≤ 25 chars', 'Opt-out footer present', 'Submitted to Meta']

function Highlight({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\{\{\d\}\})/).map((p, i) =>
        /\{\{\d\}\}/.test(p) ? <span key={i} className="rounded bg-sky-100 px-1 font-mono text-sky-700">{p}</span> : <span key={i}>{p}</span>,
      )}
    </>
  )
}

function Preview({ t, tone }: { t: { category: string; body: string; button: string; footer?: string }; tone: 'bad' | 'good' }) {
  const bad = tone === 'bad'
  return (
    <div className={`rounded-lg border p-2.5 ${bad ? 'border-rose-200 bg-rose-50/40' : 'border-emerald-200 bg-emerald-50/40'}`}>
      <div className="mb-1.5 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wide">
        <span className={bad ? 'text-rose-600' : 'text-emerald-700'}>{bad ? 'Before' : 'AI-fixed'}</span>
        <span className={`pill ${bad ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>{t.category}</span>
      </div>
      <div className="rounded-md bg-[#e7ffdb] p-2 text-xs leading-relaxed text-slate-800 shadow-sm">
        <Highlight text={t.body} />
        {t.footer && <div className="mt-1 text-[10px] text-slate-500">{t.footer}</div>}
      </div>
      <div className={`mt-1 rounded-md bg-white py-1.5 text-center text-xs font-medium ${bad ? 'text-rose-600 line-through decoration-rose-300' : 'text-sky-600'}`}>
        {t.button} <span className="text-[10px] text-slate-400 no-underline">({t.button.length})</span>
      </div>
    </div>
  )
}

export function TemplateScenario({ resetKey }: { resetKey: number }) {
  const [stage, setStage] = useState<Stage>('rejected')
  const [open, setOpen] = useState(false)
  const [lang, setLang] = useState<Lang>('en')
  const [checks, setChecks] = useState(0)

  useEffect(() => { setStage('rejected'); setOpen(false); setChecks(0) }, [resetKey])

  useEffect(() => {
    if (stage !== 'validating') return
    if (checks >= CHECKS.length) { const t = setTimeout(() => setStage('approved'), 400); return () => clearTimeout(t) }
    const t = setTimeout(() => setChecks((c) => c + 1), 550)
    return () => clearTimeout(t)
  }, [stage, checks])

  const diagnose = () => { setOpen(true); setStage('diagnosed') }
  const approved = stage === 'approved' || stage === 'thanks' || stage === 'human'

  return (
    <>
      <Shell active="templates" shift={open} onCopilot={() => { setOpen(true); if (stage === 'rejected') setStage('diagnosed') }}>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <div className="text-xs text-slate-500">Templates · WhatsApp</div>
            <h1 className="text-xl font-bold text-slate-900">Message Templates</h1>
          </div>
          <button className="btn-primary">+ New template</button>
        </div>

        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr><th className="px-4 py-2.5">Name</th><th>Category</th><th>Language</th><th>Status</th><th className="pr-4 text-right">Action</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className={approved ? 'bg-emerald-50/50' : 'bg-rose-50/40'}>
                <td className="whitespace-nowrap px-4 py-3 font-medium"><FileText size={14} className="mr-1.5 inline text-slate-400" />diwali_mega_sale_v2</td>
                <td>{approved ? 'MARKETING' : 'UTILITY'}</td>
                <td>English</td>
                <td>
                  {approved ? (
                    <span className="pill bg-emerald-100 text-emerald-700"><CheckCircle2 size={12} /> Approved · pre-check passed</span>
                  ) : stage === 'validating' ? (
                    <span className="pill bg-amber-100 text-amber-700"><Loader2 size={12} className="animate-spin" /> Re-submitting…</span>
                  ) : (
                    <span className="pill bg-rose-100 text-rose-700"><AlertTriangle size={12} /> Rejected · INVALID_FORMAT</span>
                  )}
                </td>
                <td className="pr-4 text-right">
                  {!approved && stage !== 'validating' && (
                    <button onClick={diagnose} className="btn animate-glow whitespace-nowrap bg-brand-600 py-1.5 text-xs text-white">
                      <Sparkles size={13} /> Diagnose & auto-fix
                    </button>
                  )}
                  {approved && <button className="btn-ghost py-1.5 text-xs">Use in campaign <ArrowRight size={12} /></button>}
                </td>
              </tr>
              {[
                ['order_shipped_update', 'UTILITY', 'Approved'],
                ['welcome_new_customer', 'MARKETING', 'Approved'],
                ['cod_confirmation_hi', 'UTILITY', 'Approved'],
              ].map(([n, c, s]) => (
                <tr key={n}>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600"><FileText size={14} className="mr-1.5 inline text-slate-300" />{n}</td>
                  <td className="text-slate-500">{c}</td><td className="text-slate-500">English</td>
                  <td><span className="pill bg-slate-100 text-slate-600">{s}</span></td><td />
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!approved && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm">
            <AlertTriangle className="mt-0.5 shrink-0 text-rose-500" size={18} />
            <div>
              <div className="font-semibold text-rose-800">Your Diwali campaign is blocked</div>
              <div className="text-rose-700">
                Meta rejected <b>diwali_mega_sale_v2</b>. 4,812 contacts are scheduled for tonight 7:00 PM.
                <span className="text-rose-500"> Before Co-Pilot, the only option here was “Contact support” (avg. reply 6+ hrs).</span>
              </div>
            </div>
          </div>
        )}
      </Shell>

      <Drawer open={open} onClose={() => setOpen(false)} lang={lang} setLang={setLang} context="Template · diwali_mega_sale_v2">
        <Bot>
          {lang === 'en'
            ? <>Hi Riya 👋 I read Meta's rejection for <b>diwali_mega_sale_v2</b>. I found <b>3 problems</b>. All 3 can be fixed here — no support ticket needed.</>
            : <>Hi Riya 👋 Maine <b>diwali_mega_sale_v2</b> ka Meta rejection padha. <b>3 problems</b> mile. Teeno yahin fix ho sakte hain — ticket ki zaroorat nahi.</>}
        </Bot>

        <div className="space-y-2">
          {CAUSES[lang].map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="flex animate-fadein gap-3 rounded-lg border border-slate-200 p-3" style={{ animationDelay: `${i * 120}ms` }}>
              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-rose-100 text-xs font-bold text-rose-600">{i + 1}</div>
              <div>
                <div className="flex items-center gap-1.5 text-sm font-semibold"><Icon size={14} className="text-slate-400" /> {title}</div>
                <div className="text-xs text-slate-600">{text}</div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="mb-2 text-xs font-semibold text-slate-500">{lang === 'en' ? 'Before vs. fixed template' : 'Pehle vs. fixed template'}</div>
          <div className="grid grid-cols-2 gap-2">
            <Preview t={BEFORE} tone="bad" />
            <Preview t={AFTER} tone="good" />
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            {lang === 'en' ? 'Your offer, wording and variables stay the same. Only the 3 issues are changed.' : 'Aapka offer aur wording same rahega. Sirf 3 issues change hue hain.'}
          </div>
        </div>

        {stage === 'diagnosed' && (
          <div className="flex gap-2">
            <button onClick={() => setStage('validating')} className="btn-primary flex-1 justify-center">
              <Sparkles size={15} /> {lang === 'en' ? 'Apply fix & resubmit to Meta' : 'Fix lagao & Meta ko bhejo'}
            </button>
            <button className="btn-ghost">Edit</button>
          </div>
        )}

        {stage !== 'diagnosed' && (
          <div className="rounded-lg border border-slate-200 p-3">
            <div className="mb-2 text-xs font-semibold text-slate-500">Pre-check against Meta rules</div>
            {CHECKS.map((c, i) => (
              <div key={c} className="flex items-center gap-2 py-0.5 text-xs">
                {i < checks || approved ? <CheckCircle2 size={14} className="text-emerald-500" />
                  : i === checks ? <Loader2 size={14} className="animate-spin text-amber-500" />
                  : <div className="h-3.5 w-3.5 rounded-full border border-slate-300" />}
                <span className={i < checks || approved ? 'text-slate-700' : 'text-slate-400'}>{c}</span>
              </div>
            ))}
          </div>
        )}

        {approved && (
          <Bot>
            <div className="font-semibold text-emerald-700">✅ {lang === 'en' ? 'Approved! Your 7:00 PM campaign is back on schedule.' : 'Approved! Aapka 7 baje ka campaign wapas schedule pe hai.'}</div>
            <div className="mt-1 text-xs text-slate-600">
              {lang === 'en' ? 'Note: Marketing messages are charged at the Marketing rate (shown in your campaign cost preview).' : 'Note: Marketing messages Marketing rate pe charge hote hain (campaign preview mein dikh raha hai).'}
            </div>
          </Bot>
        )}

        {stage === 'approved' && (
          <div className="rounded-lg bg-slate-50 p-3 text-center">
            <div className="mb-2 text-xs font-medium text-slate-600">Did this solve your issue without needing support?</div>
            <div className="flex justify-center gap-2">
              <button onClick={() => setStage('thanks')} className="btn-ghost py-1.5 text-xs"><ThumbsUp size={13} /> Yes</button>
              <button onClick={() => setStage('human')} className="btn-ghost py-1.5 text-xs"><ThumbsDown size={13} /> Need a human</button>
            </div>
          </div>
        )}
        {stage === 'thanks' && <div className="text-center text-xs text-slate-500">Thanks! Logged as <b>self-serve resolved</b>. We re-check in 24h that no ticket was raised.</div>}
        {stage === 'human' && (
          <>
            <User>Need a human</User>
            <Bot>No problem. I've opened ticket <b>#CH-8839</b> with the before/after template, Meta's rejection reason and the checks I ran — the specialist won't ask you to repeat anything. Est. reply: <b>14 min</b>.</Bot>
          </>
        )}
      </Drawer>
    </>
  )
}
