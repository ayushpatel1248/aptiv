import { create } from 'zustand'
import { dropoff, hospitals, pickup } from './dummyData'
import type { Hospital, LatLng, RouteOption, VehicleOption } from './dummyData'

export type AlertType = 'sos' | 'hazard' | 'trip'

export type Alert = {
  id: string
  type: AlertType
  title: string
  message: string
  createdAt: number
  location?: LatLng
  resolved?: boolean
  hospital?: Hospital
}

export type TripStatus = 'idle' | 'searching' | 'driver_assigned' | 'in_progress' | 'completed'

export type Trip = {
  id: string
  status: TripStatus
  pickup: LatLng
  dropoff: LatLng
  currentLocation: LatLng
  selectedRoute?: RouteOption['id']
  selectedVehicleId?: VehicleOption['id']
  startedAt?: number
  completedAt?: number
}

type AccessibilityPrefs = {
  highContrast: boolean
  largeText: boolean
}

type AppState = {
  prefs: AccessibilityPrefs
  setHighContrast: (v: boolean) => void
  setLargeText: (v: boolean) => void

  trip: Trip
  startMatching: (routeId: RouteOption['id'], vehicleId: VehicleOption['id']) => void
  startTrip: () => void
  completeTrip: () => void
  cancelTrip: () => void

  alerts: Alert[]
  // Hospital SOS (includes nearest hospital details)
  triggerSOS: (message?: string) => void
  // Police SOS (demo)
  triggerSOSPolice: (message?: string) => void
  // Guardian-only SOS (demo)
  triggerSOSGuardian: (message?: string) => void

  resolveAlert: (id: string) => void

  // internal (for demo)
  _timer: number | null
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function nextPoint(from: LatLng, to: LatLng, t: number): LatLng {
  return { lat: lerp(from.lat, to.lat, t), lng: lerp(from.lng, to.lng, t) }
}

// Haversine distance in meters
function distanceMeters(a: LatLng, b: LatLng) {
  const R = 6371e3
  const toRad = (x: number) => (x * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)

  const s =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s))
  return R * c
}

function findNearestHospital(pos: LatLng): Hospital {
  // hospitals is const dummy data; pick the nearest
  let best = hospitals[0] as unknown as Hospital
  let bestD = Number.POSITIVE_INFINITY
  for (const h of hospitals as unknown as Hospital[]) {
    const d = distanceMeters(pos, h.location)
    if (d < bestD) {
      bestD = d
      best = h
    }
  }
  return best
}

export const useAppStore = create<AppState>((set, get) => ({
  prefs: {
    highContrast: false,
    largeText: false,
  },
  setHighContrast: (v) => {
    set((s) => ({ prefs: { ...s.prefs, highContrast: v } }))
    document.documentElement.setAttribute('data-theme', v ? 'high-contrast' : '')
  },
  setLargeText: (v) => set((s) => ({ prefs: { ...s.prefs, largeText: v } })),

  trip: {
    id: 't_demo',
    status: 'idle',
    pickup,
    dropoff,
    currentLocation: pickup,
  },

  startMatching: (routeId, vehicleId) => {
    // simulate matching delay
    set((s) => ({
      trip: {
        ...s.trip,
        status: 'searching',
        selectedRoute: routeId,
        selectedVehicleId: vehicleId,
      },
      alerts: [
        {
          id: `a_${Date.now()}`,
          type: 'trip',
          title: 'Booking requested',
          message: 'Searching for an accessible driver…',
          createdAt: Date.now(),
          location: s.trip.pickup,
        },
        ...s.alerts,
      ],
    }))

    window.setTimeout(() => {
      set((s) => ({
        trip: { ...s.trip, status: 'driver_assigned' },
        alerts: [
          {
            id: `a_${Date.now()}`,
            type: 'trip',
            title: 'Driver assigned',
            message: 'Driver is on the way. Ramp + gentle start/stop enabled.',
            createdAt: Date.now(),
            location: s.trip.pickup,
          },
          ...s.alerts,
        ],
      }))
    }, 1200)
  },

  startTrip: () => {
    const { _timer } = get()
    if (_timer) window.clearInterval(_timer)

    set((s) => ({
      trip: { ...s.trip, status: 'in_progress', startedAt: Date.now() },
      alerts: [
        {
          id: `a_${Date.now()}`,
          type: 'trip',
          title: 'Trip started',
          message: 'Live location sharing is active for guardian.',
          createdAt: Date.now(),
          location: s.trip.pickup,
        },
        ...s.alerts,
      ],
    }))

    // simulate live location moving from pickup -> dropoff
    let t = 0
    const timer = window.setInterval(() => {
      t = Math.min(1, t + 0.03)
      const s = get()
      if (s.trip.status !== 'in_progress') return
      set((prev) => ({
        trip: {
          ...prev.trip,
          currentLocation: nextPoint(prev.trip.pickup, prev.trip.dropoff, t),
        },
      }))
      if (t >= 1) {
        get().completeTrip()
      }
    }, 800)

    set({ _timer: timer })
  },

  completeTrip: () => {
    const { _timer } = get()
    if (_timer) window.clearInterval(_timer)

    set((s) => ({
      _timer: null,
      trip: { ...s.trip, status: 'completed', completedAt: Date.now() },
      alerts: [
        {
          id: `a_${Date.now()}`,
          type: 'trip',
          title: 'Trip completed',
          message: 'Reached destination safely.',
          createdAt: Date.now(),
          location: s.trip.dropoff,
        },
        ...s.alerts,
      ],
    }))
  },

  cancelTrip: () => {
    const { _timer } = get()
    if (_timer) window.clearInterval(_timer)
    set((s) => ({
      _timer: null,
      trip: { ...s.trip, status: 'idle', currentLocation: s.trip.pickup },
    }))
  },

  alerts: [],
  triggerSOS: (message) => {
    const s = get()
    const current = s.trip.currentLocation
    const nearest = findNearestHospital(current)

    set((prev) => ({
      alerts: [
        {
          id: `a_${Date.now()}`,
          type: 'sos',
          title: 'Hospital SOS Triggered',
          message:
            message ??
            `Nearest hospital: ${nearest.name} (${nearest.phone}). Sharing details with guardian.`,
          createdAt: Date.now(),
          location: current,
          hospital: nearest,
          resolved: false,
        },
        ...prev.alerts,
      ],
    }))

    // system alerts for guardian + "where they're going" info
    set((prev) => ({
      alerts: [
        {
          id: `a_${Date.now() + 1}`,
          type: 'trip',
          title: 'Guardian notified',
          message: `User triggered Hospital SOS. Hospital: ${nearest.name} • ${nearest.phone}`,
          createdAt: Date.now(),
          location: current,
          hospital: nearest,
        },
        {
          id: `a_${Date.now() + 2}`,
          type: 'trip',
          title: 'Emergency destination set',
          message: `Proceed to ${nearest.name} (${nearest.address}).`,
          createdAt: Date.now(),
          location: nearest.location,
          hospital: nearest,
        },
        ...prev.alerts,
      ],
    }))
  },

  triggerSOSPolice: (message) => {
    const current = get().trip.currentLocation
    const policeNumber = '112'

    set((prev) => ({
      alerts: [
        {
          id: `a_${Date.now()}`,
          type: 'sos',
          title: 'Police SOS Triggered',
          message: message ?? `Police emergency notified (demo). Call: ${policeNumber}`,
          createdAt: Date.now(),
          location: current,
          resolved: false,
        },
        ...prev.alerts,
      ],
    }))

    set((prev) => ({
      alerts: [
        {
          id: `a_${Date.now() + 1}`,
          type: 'trip',
          title: 'Guardian notified',
          message: `User triggered Police SOS. Emergency number: ${policeNumber}`,
          createdAt: Date.now(),
          location: current,
        },
        ...prev.alerts,
      ],
    }))
  },

  triggerSOSGuardian: (message) => {
    const current = get().trip.currentLocation

    set((prev) => ({
      alerts: [
        {
          id: `a_${Date.now()}`,
          type: 'sos',
          title: 'Guardian SOS Triggered',
          message: message ?? 'Guardian assistance requested (demo). Live location shared.',
          createdAt: Date.now(),
          location: current,
          resolved: false,
        },
        ...prev.alerts,
      ],
    }))

    set((prev) => ({
      alerts: [
        {
          id: `a_${Date.now() + 1}`,
          type: 'trip',
          title: 'Guardian notified',
          message: 'User requested guardian assistance. Live location shared.',
          createdAt: Date.now(),
          location: current,
        },
        ...prev.alerts,
      ],
    }))
  },
  resolveAlert: (id) =>
    set((s) => ({
      alerts: s.alerts.map((a) => (a.id === id ? { ...a, resolved: true } : a)),
    })),

  _timer: null,
}))
