import { useState } from 'react'
import { ScenarioBar, type ScenarioId } from './components/ScenarioBar'
import { TemplateScenario } from './scenarios/TemplateScenario'
import { FlowScenario } from './scenarios/FlowScenario'
import { EscalationScenario } from './scenarios/EscalationScenario'
import { FinOpsDashboard } from './scenarios/FinOpsDashboard'

export default function App() {
  const [s, setS] = useState<ScenarioId>('s1')
  const [resetKey, setResetKey] = useState(0)
  return (
    <div className="min-h-screen">
      <ScenarioBar active={s} onChange={(id) => { setS(id); setResetKey((k) => k + 1) }} onReset={() => setResetKey((k) => k + 1)} />
      {s === 's1' && <TemplateScenario resetKey={resetKey} />}
      {s === 's2' && <FlowScenario resetKey={resetKey} />}
      {s === 's3' && <EscalationScenario resetKey={resetKey} />}
      {s === 's4' && <FinOpsDashboard key={resetKey} />}
    </div>
  )
}
