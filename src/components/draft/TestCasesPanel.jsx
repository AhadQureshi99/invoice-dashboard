import { useEffect, useMemo, useState } from 'react'
import { HiOutlineBeaker, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlinePlay } from 'react-icons/hi'
import { listSellers } from '../../services/sellers'
import { SANDBOX_SCENARIOS, runSandboxScenario } from '../../services/fbr'

/**
 * FBR sandbox test-case runner. FBR issues a sandbox token first and requires
 * the DI test scenarios to pass in sandbox before releasing the production
 * token. This panel runs those scenarios against the FBR sandbox using the
 * selected company's token and tracks how many passed.
 */
const TestCasesPanel = () => {
  const [sellers, setSellers]   = useState([])
  const [sellerId, setSellerId] = useState('')
  const [results, setResults]   = useState({})   // { [scenarioId]: {status, error, statusCode} }
  const [running, setRunning]   = useState(false)

  useEffect(() => {
    listSellers().then(list => {
      setSellers(list)
      const def = list.find(s => s.is_default) || list[0]
      if (def) setSellerId(def.id)
    }).catch(() => {})
  }, [])

  const seller = useMemo(() => sellers.find(s => s.id === sellerId) || null, [sellers, sellerId])
  const passed = Object.values(results).filter(r => r.status === 'pass').length
  const total  = SANDBOX_SCENARIOS.length
  const allPassed = passed === total

  const runAll = async () => {
    if (!seller || running) return
    setRunning(true)
    setResults({})
    for (const sc of SANDBOX_SCENARIOS) {
      setResults(r => ({ ...r, [sc.id]: { status: 'running' } }))
      const res = await runSandboxScenario(sc, seller)
      setResults(r => ({ ...r, [sc.id]: { status: res.ok ? 'pass' : 'fail', error: res.error, statusCode: res.statusCode } }))
    }
    setRunning(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <HiOutlineBeaker className="w-5 h-5 text-[#0e5f4f]" />
          <div>
            <p className="text-sm font-bold text-[#0e5f4f]">FBR Sandbox Test Cases</p>
            <p className="text-[11px] text-gray-400">Pass all {total} scenarios in sandbox to unlock your FBR production token.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {sellers.length > 1 && (
            <select value={sellerId} onChange={(e) => setSellerId(e.target.value)} disabled={running} className="border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600 bg-white">
              {sellers.map(s => <option key={s.id} value={s.id}>{s.company_name}</option>)}
            </select>
          )}
          <button
            onClick={runAll}
            disabled={running || !seller}
            className="flex items-center gap-1.5 bg-[#0e5f4f] hover:bg-[#083f33] text-white rounded-xl px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60"
          >
            <HiOutlinePlay className="w-4 h-4" />
            {running ? 'Running…' : 'Run Test Cases'}
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
          <div className={`h-full transition-all ${allPassed ? 'bg-green-500' : 'bg-[#0e5f4f]'}`} style={{ width: `${(passed / total) * 100}%` }} />
        </div>
        <span className="text-xs font-semibold text-gray-600">{passed} / {total} passed</span>
      </div>

      {allPassed && (
        <div className="text-xs font-medium rounded-lg px-3 py-2 border text-green-700 bg-green-50 border-green-100">
          All {total} test cases passed. You can now request your production token from FBR IRIS and switch this company to Production mode in Settings.
        </div>
      )}

      {seller && seller.fbr_mode !== 'sandbox' && (
        <div className="text-[11px] rounded-lg px-3 py-2 border text-amber-700 bg-amber-50 border-amber-100">
          Note: “{seller.company_name}” is set to <strong>{seller.fbr_mode}</strong> mode. Test cases require the company’s <strong>sandbox</strong> token — set the sandbox token in Settings if these fail with an authorization error.
        </div>
      )}

      <div className="flex flex-col divide-y divide-gray-50 border border-gray-100 rounded-xl overflow-hidden">
        {SANDBOX_SCENARIOS.map(sc => {
          const r = results[sc.id]
          return (
            <div key={sc.id} className="flex items-start gap-3 px-4 py-2.5">
              <div className="w-5 pt-0.5 shrink-0">
                {r?.status === 'pass'    && <HiOutlineCheckCircle className="w-5 h-5 text-green-500" />}
                {r?.status === 'fail'    && <HiOutlineXCircle className="w-5 h-5 text-red-500" />}
                {r?.status === 'running' && <span className="block w-3.5 h-3.5 border-2 border-[#0e5f4f] border-t-transparent rounded-full animate-spin" />}
                {!r                       && <span className="block w-2 h-2 rounded-full bg-gray-200 mt-1.5" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-700"><span className="font-semibold text-gray-800">{sc.id}</span> — {sc.name}</p>
                {r?.status === 'fail' && r.error && <p className="text-[11px] text-red-600 mt-0.5 break-words">{r.error}</p>}
              </div>
              {r?.status === 'pass' && <span className="text-[10px] font-semibold text-green-600 shrink-0">PASS</span>}
              {r?.status === 'fail' && <span className="text-[10px] font-semibold text-red-500 shrink-0">FAIL</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TestCasesPanel
