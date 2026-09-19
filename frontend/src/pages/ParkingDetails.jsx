import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import Alert from "../components/Alert";

export default function ParkingDetails() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [space, setSpace] = useState(state?.space || null);
  const [loading, setLoading] = useState(!state?.space);
  const [error, setError] = useState("");

  useEffect(() => {
    if (space) return;
    api.get("/user/parking-spaces")
      .then((r) => setSpace(r.data.find((item) => item._id === id)))
      .catch((e) => setError(e.response?.data?.msg || "Unable to load parking space."))
      .finally(() => setLoading(false));
  }, [id, space]);

  if (loading) return <div className="grid min-h-[70vh] place-items-center bg-slate-50 text-slate-500">Loading...</div>;
  if (!space) return <div className="mx-auto max-w-3xl px-4 py-20"><Alert message={error || "Parking space not found."} /></div>;

  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <button onClick={() => navigate("/find-parking")} className="text-sm font-semibold text-blue-600">← Back to parking</button>
        <div className="mt-5 grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft lg:grid-cols-5">
          <div className="bg-slate-950 p-8 text-white lg:col-span-2 lg:p-10">
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${space.availableSpots > 0 ? "bg-green-500/15 text-green-300" : "bg-red-500/15 text-red-300"}`}>{space.availableSpots > 0 ? "Available now" : "Currently full"}</span>
            <h1 className="mt-5 text-3xl font-extrabold">{space.name}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">{space.address}</p>{space.demo && <span className="mt-4 inline-flex rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-xs font-semibold text-blue-200">Demo preview</span>}
            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/5 p-4"><p className="text-xs text-slate-400">Price</p><p className="mt-1 text-xl font-bold">₹{space.price}/hr</p></div>
              <div className="rounded-xl bg-white/5 p-4"><p className="text-xs text-slate-400">Available</p><p className="mt-1 text-xl font-bold">{space.availableSpots}</p></div>
            </div>
          </div>
          <div className="p-8 lg:col-span-3 lg:p-10">
            <h2 className="text-xl font-bold text-slate-900">About this parking space</h2>
            <p className="mt-3 leading-7 text-slate-500">{space.description || "A convenient parking space available through ParkNest."}</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-400">Total capacity</p><p className="mt-1 font-bold text-slate-800">{space.totalSpots} spots</p></div>
              <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-400">Availability</p><p className="mt-1 font-bold text-slate-800">{space.isAvailable ? "Open for booking" : "Not available"}</p></div>
            </div>
            <button disabled={space.demo || !space.isAvailable || space.availableSpots <= 0} onClick={() => navigate(`/parking/${id}/book`, { state: { space } })} className="mt-8 w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">{space.demo ? "Preview only" : "Continue to Booking"}</button>
          </div>
        </div>
      </div>
    </main>
  );
}