import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppStore } from '../app/store'

export function PortalShell(props: {
  title: string
  role: 'user' | 'guardian'
  children: React.ReactNode
}) {
  const { prefs, setHighContrast, setLargeText } = useAppStore()
  const [showA11y, setShowA11y] = useState(false)

  return (
    <div className={prefs.largeText ? 'text-[18px]' : 'text-[15px]'}>
      <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="h-9 w-9 shrink-0 rounded-xl bg-brand-600" aria-hidden />
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900">AccessEdge Mobility</div>
                <div className="truncate text-xs text-slate-600">{props.title}</div>
              </div>
            </div>

            <nav className="flex items-center gap-2">
              <Link
                to="/"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Switch role
              </Link>

              <button
                type="button"
                onClick={() => setShowA11y((v) => !v)}
                className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 md:hidden"
                aria-expanded={showA11y}
              >
                Accessibility
              </button>

              <div className="hidden items-center gap-3 md:flex">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={prefs.highContrast}
                    onChange={(e) => setHighContrast(e.target.checked)}
                  />
                  High contrast
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={prefs.largeText}
                    onChange={(e) => setLargeText(e.target.checked)}
                  />
                  Large text
                </label>
              </div>

              <span className="ml-1 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                {props.role.toUpperCase()}
              </span>
            </nav>
          </div>

          {showA11y && (
            <div className="mt-3 grid gap-2 rounded-2xl border bg-white p-3 md:hidden">
              <label className="flex items-center justify-between gap-3 text-sm text-slate-800">
                <span className="font-semibold">High contrast</span>
                <input
                  type="checkbox"
                  checked={prefs.highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                />
              </label>
              <label className="flex items-center justify-between gap-3 text-sm text-slate-800">
                <span className="font-semibold">Large text</span>
                <input
                  type="checkbox"
                  checked={prefs.largeText}
                  onChange={(e) => setLargeText(e.target.checked)}
                />
              </label>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">{props.children}</main>
    </div>
  )
}
