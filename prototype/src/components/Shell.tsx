import type { ReactNode } from 'react'
import {
  LayoutDashboard, Megaphone, FileText, Workflow, Users, Plug, BarChart3, Settings, Bell, Search, Sparkles, MessageCircle,
} from 'lucide-react'

const NAV = [
  { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
  { id: 'templates', label: 'Templates', icon: FileText },
  { id: 'flows', label: 'Chatbot Flows', icon: Workflow },
  { id: 'inbox', label: 'Team Inbox', icon: MessageCircle },
  { id: 'contacts', label: 'Contacts', icon: Users },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'WhatsApp Setup', icon: Settings },
]

export function Shell({ active, children, onCopilot, shift = false }: { active: string; children: ReactNode; onCopilot: () => void; shift?: boolean }) {
  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <aside className="hidden w-56 shrink-0 border-r border-slate-200 bg-white md:block">
        <div className="flex items-center gap-2 px-5 py-4">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 font-bold text-white">C</div>
          <div>
            <div className="text-sm font-bold text-slate-900">Cheerio</div>
            <div className="text-[10px] text-slate-500">Glow Skincare · Starter</div>
          </div>
        </div>
        <nav className="space-y-0.5 px-3">
          {NAV.map(({ id, label, icon: Icon }) => (
            <div
              key={id}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm ${
                active === id ? 'bg-brand-50 font-semibold text-brand-700' : 'text-slate-600'
              }`}
            >
              <Icon size={16} /> {label}
            </div>
          ))}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
          <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-sm text-slate-400">
            <Search size={14} /> Search campaigns, templates, contacts…
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onCopilot} className="btn bg-gradient-to-r from-brand-600 to-teal-500 text-white shadow">
              <Sparkles size={15} /> Co-Pilot
            </button>
            <Bell size={18} className="text-slate-500" />
            <div className="grid h-8 w-8 place-items-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">RS</div>
          </div>
        </header>
        <main className={`flex-1 p-6 transition-all ${shift ? "lg:pr-[456px]" : ""}`}>{children}</main>
      </div>
    </div>
  )
}
