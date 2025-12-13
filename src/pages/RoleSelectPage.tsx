import { useNavigate } from 'react-router-dom'

function RoleCard(props: {
  title: string
  subtitle: string
  cta: string
  onClick: () => void
}) {
  return (
    <button
      onClick={props.onClick}
      className="w-full rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-[1px] hover:shadow md:p-6"
    >
      <div className="text-lg font-semibold text-slate-900">{props.title}</div>
      <div className="mt-1 text-sm text-slate-600">{props.subtitle}</div>
      <div className="mt-4 inline-flex items-center rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white">
        {props.cta}
      </div>
    </button>
  )
}

export function RoleSelectPage() {
  const nav = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-3xl border bg-white p-6 shadow-sm md:p-10">
          <div className="text-2xl font-bold text-slate-900">AccessEdge Mobility</div>
          <div className="mt-2 text-slate-600">
            Frontend-only prototype (React). Choose a portal to continue.
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <RoleCard
              title="User Portal"
              subtitle="Accessible routing, adaptive ride booking, and SOS safety features."
              cta="Open User Portal"
              onClick={() => nav('/user')}
            />
            <RoleCard
              title="Guardian Portal"
              subtitle="Live trip monitoring, SOS alerts, and location tracking for linked users."
              cta="Open Guardian Portal"
              onClick={() => nav('/guardian')}
            />
          </div>

        </div>
      </div>
    </div>
  )
}
