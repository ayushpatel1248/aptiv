import { useMemo, useState } from 'react'
import { PortalShell } from '../../components/PortalShell'
import { MapView } from '../../components/MapView'
import { hazards, routeOptions, vehicleOptions } from '../../app/dummyData'
import { useAppStore } from '../../app/store'

function Badge(props: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
      {props.children}
    </span>
  )
}

export function UserDashboard() {
  const { trip, alerts, startMatching, startTrip, triggerSOS, cancelTrip } = useAppStore()

  const [selectedRoute, setSelectedRoute] = useState(routeOptions[0]!.id)
  const [showSosInfo, setShowSosInfo] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState(vehicleOptions[0]!.id)

  const selectedVehicleObj = useMemo(
    () => vehicleOptions.find((v) => v.id === selectedVehicle),
    [selectedVehicle],
  )

  const totalFare =
    (selectedVehicleObj?.baseFare ?? 0) + (selectedVehicleObj?.accessibilitySurcharge ?? 0)

  const latestSOS = alerts.find((a) => a.type === 'sos')
  const sosHospital = latestSOS?.hospital

  return (
    <PortalShell role="user" title="User Portal – Ride + Safety">
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-bold text-slate-900">Plan & Book</div>
              <div className="mt-1 text-sm text-slate-600">
                Select an accessible route and a vehicle that matches your needs.
              </div>
            </div>

            <button
              onClick={() => {
                triggerSOS('SOS from User Portal (demo).')
                setShowSosInfo(true)
              }}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
            >
              SOS
            </button>
          </div>

          <div className="mt-4">
            <MapView
              center={trip.currentLocation}
              pickup={trip.pickup}
              dropoff={trip.dropoff}
              current={trip.status === 'in_progress' ? trip.currentLocation : undefined}
              heightClass="h-[280px] sm:h-[360px]"
            />
          </div>

          {showSosInfo && sosHospital && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-extrabold text-red-800">Nearest hospital (demo)</div>
                  <div className="mt-1 text-base font-bold text-slate-900">{sosHospital.name}</div>
                  <div className="mt-1 text-sm text-slate-700">{sosHospital.address}</div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Phone:{' '}
                    <a className="underline" href={`tel:${sosHospital.phone.replace(/\s/g, '')}`}>
                      {sosHospital.phone}
                    </a>
                  </div>
                  <div className="mt-2 text-xs text-slate-700">
                    Guardian is notified with this hospital + your live location.
                  </div>
                </div>
                <button
                  onClick={() => setShowSosInfo(false)}
                  className="rounded-xl bg-white px-3 py-2 text-sm font-bold text-slate-800"
                >
                  Close
                </button>
              </div>

              <div className="mt-3">
                <MapView
                  center={sosHospital.location}
                  pickup={trip.currentLocation}
                  dropoff={sosHospital.location}
                  heightClass="h-[200px] sm:h-[220px]"
                />
              </div>
            </div>
          )}

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {routeOptions.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRoute(r.id)}
                className={`rounded-2xl border bg-white p-4 text-left shadow-sm hover:shadow ${
                  selectedRoute === r.id ? 'ring-2 ring-brand-500' : ''
                }`}
              >
                <div className="text-sm font-bold text-slate-900">{r.title}</div>
                <div className="mt-1 text-xs text-slate-600">
                  ETA {r.etaMinutes} min • {r.distanceKm} km
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {r.notes.slice(0, 2).map((n) => (
                    <Badge key={n}>{n}</Badge>
                  ))}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border bg-white p-4 shadow-sm">
            <div className="text-sm font-bold text-slate-900">Hazards near route (dummy)</div>
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              {hazards.map((h) => (
                <div key={h.id} className="rounded-xl bg-slate-50 p-3">
                  <div className="text-sm font-semibold text-slate-900">{h.title}</div>
                  <div className="mt-1 text-xs text-slate-600">Severity: {h.severity}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="text-lg font-bold text-slate-900">Adaptive Ride</div>
            <div className="mt-1 text-sm text-slate-600">
              Vehicles are tagged for wheelchair/low-floor/gentle driving.
            </div>

            <div className="mt-4 grid gap-3">
              {vehicleOptions.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVehicle(v.id)}
                  className={`rounded-2xl border p-4 text-left hover:bg-slate-50 ${
                    selectedVehicle === v.id ? 'ring-2 ring-brand-500' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-slate-900">{v.name}</div>
                    <div className="text-xs font-semibold text-slate-700">₹ {v.baseFare}</div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {v.tags.map((t) => (
                      <Badge key={t}>{t}</Badge>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-slate-600">
                    Accessibility surcharge: ₹ {v.accessibilitySurcharge}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 p-3">
              <div className="text-sm font-semibold text-slate-900">Estimated fare</div>
              <div className="mt-1 text-2xl font-extrabold text-slate-900">₹ {totalFare}</div>
              <div className="mt-1 text-xs text-slate-600">
                Pricing logic is dummy; in real app it would be based on profile + route.
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={() => startMatching(selectedRoute, selectedVehicle)}
                disabled={trip.status !== 'idle' && trip.status !== 'completed'}
                className="rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
              >
                One-tap Book (demo)
              </button>

              <button
                onClick={() => startTrip()}
                disabled={trip.status !== 'driver_assigned'}
                className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
              >
                Start Trip (demo)
              </button>

              <button
                onClick={() => cancelTrip()}
                className="rounded-xl border bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Reset demo
              </button>
            </div>

            <div className="mt-4 rounded-2xl border bg-white p-4">
              <div className="text-sm font-bold text-slate-900">Trip status</div>
              <div className="mt-1 text-sm text-slate-700">{trip.status}</div>
              {trip.status === 'in_progress' && (
                <div className="mt-2 text-xs text-slate-600">
                  Live location is updating every ~0.8s (simulated).
                </div>
              )}
              {trip.status === 'in_progress' && (
                <button
                  onClick={() => triggerSOS('SOS during trip (demo).')}
                  className="mt-3 w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white"
                >
                  Trigger SOS
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border bg-white p-4 shadow-sm">
            <div className="text-sm font-bold text-slate-900">Caregiver / Guardian</div>
            <div className="mt-1 text-sm text-slate-600">
              Open the Guardian portal in another tab to see alerts + live location.
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  )
}
