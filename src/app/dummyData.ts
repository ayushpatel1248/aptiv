export type LatLng = { lat: number; lng: number }

export type DisabilityProfile =
  | 'wheelchair'
  | 'visual'
  | 'elderly'
  | 'motor'
  | 'general'

export type RouteOption = {
  id: 'accessible' | 'safe' | 'fast'
  title: string
  etaMinutes: number
  distanceKm: number
  notes: string[]
}

export type VehicleOption = {
  id: string
  name: string
  tags: string[]
  baseFare: number
  accessibilitySurcharge: number
}

export type Hazard = {
  id: string
  title: string
  severity: 'low' | 'medium' | 'high'
  location: LatLng
}

export type Hospital = {
  id: string
  name: string
  phone: string
  location: LatLng
  address: string
}

export const dummyUser = {
  id: 'u_001',
  name: 'Ravi Kumar',
  disabilityProfile: 'wheelchair' as DisabilityProfile,
}

export const dummyGuardian = {
  id: 'g_001',
  name: 'Anita Kumar',
  linkedUserId: dummyUser.id,
}

export const pickup: LatLng = { lat: 19.076, lng: 72.8777 }
export const dropoff: LatLng = { lat: 19.0896, lng: 72.8656 }

export const routeOptions: RouteOption[] = [
  {
    id: 'accessible',
    title: 'Most Accessible Route',
    etaMinutes: 18,
    distanceKm: 5.6,
    notes: ['Avoids stairs', 'Low incline', 'Wheelchair-friendly sidewalks'],
  },
  {
    id: 'safe',
    title: 'Safest Route',
    etaMinutes: 22,
    distanceKm: 6.2,
    notes: ['Prioritizes well-lit roads', 'Avoids isolated zones'],
  },
  {
    id: 'fast',
    title: 'Fastest Route',
    etaMinutes: 14,
    distanceKm: 5.1,
    notes: ['Shortest time', 'May include uneven footpaths (flagged)'],
  },
]

export const vehicleOptions: VehicleOption[] = [
  {
    id: 'v_wc_1',
    name: 'Wheelchair Van',
    tags: ['Ramp', 'Wheelchair Lock', 'Extra Cabin Space'],
    baseFare: 220,
    accessibilitySurcharge: 0,
  },
  {
    id: 'v_low_1',
    name: 'Low-Floor Sedan',
    tags: ['Low Floor Entry', 'Gentle Start/Stop'],
    baseFare: 160,
    accessibilitySurcharge: 20,
  },
  {
    id: 'v_std_1',
    name: 'Standard Hatchback',
    tags: ['Basic'],
    baseFare: 120,
    accessibilitySurcharge: 35,
  },
]

export const hazards: Hazard[] = [
  {
    id: 'h_1',
    title: 'Poor lighting near underpass',
    severity: 'medium',
    location: { lat: 19.0821, lng: 72.8722 },
  },
  {
    id: 'h_2',
    title: 'Sidewalk blockage (construction)',
    severity: 'high',
    location: { lat: 19.0852, lng: 72.871 },
  },
  {
    id: 'h_3',
    title: 'Slippery patch reported',
    severity: 'low',
    location: { lat: 19.088, lng: 72.868 },
  },
]

// Dummy hospitals (for SOS demo)
export const hospitals = [
  {
    id: 'hos_1',
    name: 'CityCare Hospital',
    phone: '+91 22 4000 1000',
    address: 'Andheri East, Mumbai',
    location: { lat: 19.1136, lng: 72.8697 },
  },
  {
    id: 'hos_2',
    name: 'Starlight Medical Center',
    phone: '+91 22 4100 2200',
    address: 'Bandra West, Mumbai',
    location: { lat: 19.0556, lng: 72.8347 },
  },
  {
    id: 'hos_3',
    name: 'GreenCross Emergency Clinic',
    phone: '+91 22 4200 3300',
    address: 'Powai, Mumbai',
    location: { lat: 19.1176, lng: 72.9059 },
  },
] as const
