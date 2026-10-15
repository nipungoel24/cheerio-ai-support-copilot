import { useState } from 'react'
import { TrendingDown, Bot, Users, IndianRupee, ShieldCheck, AlertTriangle, Zap } from 'lucide-react'
import { N, inr, lakh } from '../data/numbers'

const ALERTS: { name: string; value: string; limit: string; ok: boolean }[] = [
  { name: 'LLM cost per query', value: inr(N.llmCostPerQuery), limit: '> ₹2.00', ok: true },
  { name: 'All-in cost per AI-resolved query', value: inr(N.costPerResolved), limit: '> ₹4.00', ok: true },
  { name: 'Monthly AI spend', value: inr(N.monthlyAiCost), limit: '> ₹25,000', ok: true },
  { name: 'Ghost re-open rate (ticket within 24h)', value: '8.0%', limit: '> 12%', ok: true },
  { name: 'Hallucination rate (50-chat weekly audit)', value: '0.6%', limit: '> 1%', ok: true },
  { name: 'Pro add-on gross margin', value: (N.proMargin * 100).toFixed(1) + '%', limit: '< 80%', ok: true },
]

const TENANTS = [
  { name: 'Glow Skincare', sessions: 6, spend: 18, status: 'ok' },
  { name: 'FitBox Meals', sessions: 14, spend: 45, status: 'ok' },
  { name: 'Unknown-tenant-2291', sessions: 61, spend: 152, status: 'tripped' },
  { name: 'Coachify Institute', sessions: 9, spend: 26, status: 'ok' },
]

function Kpi({ icon: Icon, label, value, sub }: { icon: typeof Bot; label: string; value: string; sub: string }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 text-xs text-slate-500"><Icon size={14} /> {label}</div>
      <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500">{sub}</div>
    </div>
  )
}

export function FinOpsDashboard() {
  const [tenants, setTenants] = useState(TENANTS)
  const funnel = [
    { label: 'Tier 0 · inline auto-fix', pct: N.tier0, color: 'bg-brand-500' },
    { label: 'Tier 1 · guided Co-Pilot', pct: N.tier1, color: 'bg-teal-400' },
    { label: 'Tier 2 · human + packet', pct: 1 - N.aiRate, color: 'bg-slate-400' },
  ]
  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-1 text-xs text-slate-500">Internal · Support Ops & Finance</div>
      <h1 className="mb-5 text-xl font-bold text-slate-900">Co-Pilot unit economics & audit (monthly)</h1>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi icon={Bot} label="Resolved without a human" value={(N.aiRate * 100).toFixed(0) + '%'} sub={`${N.aiResolved.toLocaleString('en-IN')} of ${N.monthlyQueries.toLocaleString('en-IN')} queries`} />
        <Kpi icon={IndianRupee} label="LLM cost per query" value={inr(N.llmCostPerQuery)} sub={`${inr(N.costPerResolved)} all-in per AI-resolved query`} />
        <Kpi icon={TrendingDown} label="Net savings / month" value={lakh(N.monthlySavings)} sub={`${(N.savingsPct * 100).toFixed(1)}% lower than all-human`} />
        <Kpi icon={Users} label="Support agents needed" value={`${N.agentsBefore} → ${N.agentsAfter}`} sub="same 9,100 queries / month" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="card p-4">
          <div className="mb-3 text-sm font-semibold">Where queries get resolved</div>
          <div className="flex h-7 overflow-hidden rounded-md">
            {funnel.map((f) => <div key={f.label} className={f.color} style={{ width: `${f.pct * 100}%` }} />)}
          </div>
          <div className="mt-3 space-y-1.5">
            {funnel.map((f) => (
              <div key={f.label} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2"><span className={`h-2.5 w-2.5 rounded-sm ${f.color}`} />{f.label}</span>
                <span className="font-semibold">{(f.pct * 100).toFixed(0)}% · {Math.round(f.pct * N.monthlyQueries).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-xs">
            <div><div className="text-slate-500">All-human cost</div><div className="text-base font-bold">{inr(N.baselineCost)}</div></div>
            <div><div className="text-slate-500">With Co-Pilot (humans + AI)</div><div className="text-base font-bold text-brand-700">{inr(N.newCost)}</div></div>
            <div><div className="text-slate-500">Monthly AI bill</div><div className="text-base font-bold">{inr(N.monthlyAiCost)}</div></div>
            <div><div className="text-slate-500">Pro add-on revenue (12% attach)</div><div className="text-base font-bold">{inr(N.proRevenue)}</div></div>
          </div>
        </div>

        <div className="card p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><ShieldCheck size={15} /> Audit alerts</div>
          <table className="w-full text-xs">
            <thead className="text-left text-slate-500"><tr><th className="pb-1.5">Check</th><th>This month</th><th>Alert if</th><th>Status</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {ALERTS.map((a) => (
                <tr key={a.name}>
                  <td className="py-1.5">{a.name}</td><td className="font-semibold">{a.value}</td><td className="text-slate-500">{a.limit}</td>
                  <td><span className="pill bg-emerald-100 text-emerald-700">OK</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card mt-4 p-4">
        <div className="mb-1 flex items-center gap-2 text-sm font-semibold"><Zap size={15} /> Per-tenant circuit breaker</div>
        <div className="mb-3 text-xs text-slate-500">Cap: 50 AI sessions/day or ₹150 token spend/month per business. Above that, Co-Pilot falls back to rule-based checks (free) until reset.</div>
        <table className="w-full text-xs">
          <thead className="text-left text-slate-500"><tr><th className="pb-1.5">Business</th><th>Sessions today</th><th>Spend this month</th><th>Status</th><th /></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {tenants.map((t) => (
              <tr key={t.name}>
                <td className="py-2 font-medium">{t.name}</td><td>{t.sessions} / 50</td><td>₹{t.spend} / ₹150</td>
                <td>
                  {t.status === 'tripped'
                    ? <span className="pill bg-rose-100 text-rose-700"><AlertTriangle size={11} /> Throttled · loop detected</span>
                    : t.status === 'reviewed' ? <span className="pill bg-slate-100 text-slate-600">Reviewed · stays throttled</span>
                    : <span className="pill bg-emerald-100 text-emerald-700">Normal</span>}
                </td>
                <td className="text-right">
                  {t.status === 'tripped' && (
                    <button className="btn-ghost py-1 text-[11px]" onClick={() => setTenants((ts) => ts.map((x) => x.name === t.name ? { ...x, status: 'reviewed' } : x))}>
                      Mark reviewed
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-[11px] text-slate-400">Numbers mirror the Google Sheet (tabs 1–5). Sample values are used for tenant rows, re-open rate and hallucination rate.</div>
    </div>
  )
}
