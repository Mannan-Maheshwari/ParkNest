import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const parkingIcon = L.divIcon({
  className: "",
  html: '<div class="parknest-marker">P</div>',
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

const userIcon = L.divIcon({
  className: "",
  html: '<div class="user-marker"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function Recenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 13);
  }, [center, map]);
  return null;
}

export default function ParkingMap({ spaces, onSelect }) {
  const [location, setLocation] = useState(null);
  const fallback = useMemo(() => {
    if (!spaces.length) return [28.6139, 77.209];
    const lat = spaces.reduce((sum, s) => sum + Number(s.coordinates?.lat || 0), 0) / spaces.length;
    const lng = spaces.reduce((sum, s) => sum + Number(s.coordinates?.lng || 0), 0) / spaces.length;
    return [lat, lng];
  }, [spaces]);

  const center = location || fallback;

  const locate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setLocation([coords.latitude, coords.longitude]),
      () => {}
    );
  };

  return (
    <div className="relative h-[520px] overflow-hidden rounded-2xl border border-slate-200 shadow-soft">
      <MapContainer center={center} zoom={13} scrollWheelZoom className="h-full w-full">
        <Recenter center={location} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {spaces.map((space) => (
          <Marker
            key={space._id}
            position={[Number(space.coordinates?.lat), Number(space.coordinates?.lng)]}
            icon={parkingIcon}
          >
            <Popup>
              <div className="min-w-[190px]">
                <strong>{space.name}</strong>
                <div className="mt-1 text-xs text-slate-500">{space.address}</div>
                <div className="mt-2 text-sm">₹{space.price}/hour</div>
                <div className="text-xs text-green-700">{space.availableSpots} spots available</div>
                <button
                  onClick={() => onSelect(space)}
                  className="mt-3 w-full rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white"
                >
                  View & Book
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
        {location && <Marker position={location} icon={userIcon}><Popup>You are here</Popup></Marker>}
      </MapContainer>
      <button onClick={locate} className="absolute right-4 top-4 z-[1000] rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-lg">
        Use my location
      </button>
    </div>
  );
}