import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import type { LatLng } from '../app/dummyData'

// Fix missing default marker icons when bundling with Vite
// (Leaflet expects these assets to be served from a specific path)
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).toString(),
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).toString(),
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).toString(),
})

export function MapView(props: {
  center: LatLng
  pickup?: LatLng
  dropoff?: LatLng
  current?: LatLng
  heightClass?: string
}) {
  const line: LatLng[] = []
  if (props.pickup) line.push(props.pickup)
  if (props.dropoff) line.push(props.dropoff)

  const heightClass = props.heightClass ?? 'h-[320px]'

  return (
    <div className={`overflow-hidden rounded-2xl border bg-white ${heightClass}`}>
      <MapContainer center={props.center} zoom={13} scrollWheelZoom={false} style={{ height: '100%' }}>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {props.pickup && <Marker position={props.pickup} />}
        {props.dropoff && <Marker position={props.dropoff} />}
        {props.current && <Marker position={props.current} />}
        {line.length === 2 && <Polyline positions={line} />}
      </MapContainer>
    </div>
  )
}
