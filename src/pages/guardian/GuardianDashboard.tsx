import { PortalShell } from '../../components/PortalShell'
import { MapView } from '../../components/MapView'
import { dummyGuardian, dummyUser } from '../../app/dummyData'
import { useAppStore } from '../../app/store'

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function AlertPill(props: { type: string }) {
  const cls =
    props.type === 'sos'
      ? 'bg-red-100 text-red-800'
      : props.type === 'hazard'
        ? 'bg-amber-100 text-amber-800'
        : 'bg-slate-100 text-slate-800'
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${cls}`}>{props.type}</span>
  )
}

export function GuardianDashboard() {
  const { trip, alerts, resolveAlert } = useAppStore()

  const activeSOS = alerts.find((a) => a.type === 'sos' && !a.resolved)

  return (
    <PortalShell role="guardian" title="Guardian Portal – Monitoring + Alerts">
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xl font-bold text-slate-900">Live Monitoring</div>
              <div className="mt-1 text-sm text-slate-600">
                Linked user: <span className="font-semibold">{dummyUser.name}</span>
              </div>
            </div>

            {activeSOS ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-3">
                <div className="text-sm font-bold text-red-800">SOS Active</div>
                <div className="mt-1 text-xs text-red-700">{activeSOS.message}</div>

                {activeSOS.hospital && (
                  <div className="mt-2 rounded-xl bg-white p-2">
                    <div className="text-xs font-bold text-slate-900">Nearest hospital</div>
                    <div className="mt-1 text-sm font-bold text-slate-900">{activeSOS.hospital.name}</div>
                    <div className="text-xs text-slate-600">{activeSOS.hospital.address}</div>
                    <div className="mt-1 text-xs font-semibold text-slate-900">
                      {activeSOS.hospital.phone}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => resolveAlert(activeSOS.id)}
                  className="mt-2 w-full rounded-xl bg-red-700 px-3 py-2 text-sm font-bold text-white"
                >
                  Acknowledge & Resolve
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border bg-white p-3">
                <div className="text-sm font-bold text-slate-900">No active SOS</div>
                <div className="mt-1 text-xs text-slate-600">You will see alerts here.</div>
              </div>
            )}
          </div>

          <div className="mt-4">
            <MapView
              center={trip.currentLocation}
              pickup={trip.pickup}
              dropoff={trip.dropoff}
              current={trip.status === 'in_progress' ? trip.currentLocation : undefined}
              heightClass="h-[300px] sm:h-[380px]"
            />
          </div>

          <div className="mt-4 rounded-2xl border bg-white p-4 shadow-sm">
            <div className="text-sm font-bold text-slate-900">Trip status</div>
            <div className="mt-1 text-sm text-slate-700">{trip.status}</div>
            <div className="mt-2 grid gap-2 md:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-xs font-semibold text-slate-600">Pickup</div>
                <div className="mt-1 text-sm font-bold text-slate-900">
                  {trip.pickup.lat.toFixed(4)}, {trip.pickup.lng.toFixed(4)}
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-xs font-semibold text-slate-600">Current</div>
                <div className="mt-1 text-sm font-bold text-slate-900">
                  {trip.currentLocation.lat.toFixed(4)}, {trip.currentLocation.lng.toFixed(4)}
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-xs font-semibold text-slate-600">Dropoff</div>
                <div className="mt-1 text-sm font-bold text-slate-900">
                  {trip.dropoff.lat.toFixed(4)}, {trip.dropoff.lng.toFixed(4)}
                </div>
              </div>
            </div>

            <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
              Demo: Live location updates only when the user clicks “Start Trip” in User Portal.
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="text-lg font-bold text-slate-900">Guardian Profile</div>
            <div className="mt-2 text-sm text-slate-700">
              <div>
                <span className="text-slate-500">Name:</span> {dummyGuardian.name}
              </div>
              <div>
                <span className="text-slate-500">Linked user:</span> {dummyUser.name}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border bg-white p-4">
              <div className="text-sm font-bold text-slate-900">Alerts Feed</div>
              <div className="mt-3 grid gap-3">
                {alerts.length === 0 ? (
                  <div className="text-sm text-slate-600">No alerts yet.</div>
                ) : (
                  alerts.slice(0, 8).map((a) => (
                    <div
                      key={a.id}
                      className={`rounded-2xl border p-3 ${a.resolved ? 'opacity-60' : 'bg-white'}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-bold text-slate-900">{a.title}</div>
                        <AlertPill type={a.type} />
                      </div>
                      <div className="mt-1 text-sm text-slate-700">{a.message}</div>
                      <div className="mt-2 text-xs text-slate-500">
                        {formatTime(a.createdAt)} {a.resolved ? '• resolved' : ''}
                      </div>
                      {!a.resolved && a.type === 'sos' && (
                        <button
                          onClick={() => resolveAlert(a.id)}
                          className="mt-3 w-full rounded-xl bg-slate-900 px-3 py-2 text-sm font-bold text-white"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  )
}
