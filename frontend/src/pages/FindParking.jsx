import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import ParkingMap from "../components/ParkingMap";
import Alert from "../components/Alert";

const demoSpaces = [
  { _id: "demo-central", name: "Central Avenue Parking", address: "Connaught Place, New Delhi", price: 40, totalSpots: 40, availableSpots: 18, isAvailable: true, isActive: true, demo: true, coordinates: { lat: 28.6315, lng: 77.2167 }, description: "Convenient city-centre parking for office, shopping and short visits." },
  { _id: "demo-metro", name: "Metro Gate Parking", address: "Rajiv Chowk, New Delhi", price: 30, totalSpots: 28, availableSpots: 9, isAvailable: true, isActive: true, demo: true, coordinates: { lat: 28.6328, lng: 77.2197 }, description: "A practical parking option close to the metro and commercial district." },
  { _id: "demo-market", name: "Market Square Parking", address: "Khan Market, New Delhi", price: 50, totalSpots: 32, availableSpots: 12, isAvailable: true, isActive: true, demo: true, coordinates: { lat: 28.6001, lng: 77.2270 }, description: "Easy-access parking near cafés, retail stores and local businesses." },
];

export default function FindParking() {
  const [spaces, setSpaces] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/user/parking-spaces")
      .then((r) => setSpaces(r.data?.length ? r.data : demoSpaces))
      .catch((e) => { setSpaces(demoSpaces); setError(""); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return spaces;
    return spaces.filter((s) => `${s.name} ${s.address}`.toLowerCase().includes(q));
  }, [spaces, query]);

  return (
    <main className="bg-slate-50">
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">Explore parking</p>
          <div className="mt-2 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div><h1 className="text-3xl font-extrabold text-slate-900">Find a parking spot</h1><p className="mt-2 text-slate-500">Browse available parking spaces and compare price, location and capacity.</p></div>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or area..." className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 md:w-80" />
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && <div className="mb-5"><Alert message={error} /></div>}
        {loading ? <div className="grid h-96 place-items-center rounded-2xl bg-white text-slate-500">Loading parking spaces...</div> : (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <ParkingMap spaces={filtered} onSelect={(space) => navigate(`/parking/${space._id}`, { state: { space } })} />
            <aside className="max-h-[520px] space-y-3 overflow-y-auto pr-1">
              {filtered.length ? filtered.map((space) => (
                <button key={space._id} onClick={() => navigate(`/parking/${space._id}`, { state: { space } })} className="w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-soft">
                  <div className="flex items-start justify-between gap-3"><div><h3 className="font-bold text-slate-900">{space.name}</h3>{space.demo && <span className="mt-2 inline-flex rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700">Demo listing</span>}<p className="mt-1 text-xs text-slate-500">{space.address}</p></div><span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">{space.isAvailable && space.availableSpots > 0 ? "Available" : "Full"}</span></div>
                  <div className="mt-4 flex items-end justify-between"><div><p className="text-lg font-extrabold text-blue-600">₹{space.price}<span className="text-xs font-medium text-slate-400">/hr</span></p><p className="text-xs text-slate-500">{space.availableSpots} of {space.totalSpots} spots available</p></div><span className="text-sm font-bold text-blue-600">View →</span></div>
                </button>
              )) : <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">No matching parking spaces found.</div>}
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}