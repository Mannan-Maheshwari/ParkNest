import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Alert from "../components/Alert";

export default function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [bookingRes, spaceRes] = await Promise.all([api.get("/user/bookings"), api.get("/user/parking-spaces")]);
      setBookings(bookingRes.data);
      setSpaces(spaceRes.data);
    } catch (e) {
      setError(e.response?.data?.msg || "Unable to load your dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const active = bookings.filter((b) => b.status === "confirmed");
  const completed = bookings.filter((b) => b.status === "completed");
  const spent = bookings.reduce((sum, b) => sum + Number(b.totalPrice || 0), 0);
  const latest = bookings.slice(0, 4);

  const cancel = async (id) => {
    try {
      await api.patch(`/user/bookings/${id}/cancel`);
      load();
    } catch (e) {
      setError(e.response?.data?.msg || "Unable to cancel booking.");
    }
  };

  if (loading) return <div className="grid min-h-[70vh] place-items-center bg-slate-50 text-slate-500">Loading dashboard...</div>;

  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
          <p className="text-sm font-bold text-blue-600">DRIVER DASHBOARD</p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Your parking overview</h1>
          <p className="mt-2 text-slate-500">Manage bookings and discover your next parking spot.</p>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Alert message={error} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[["Active bookings", active.length], ["Total bookings", bookings.length], ["Completed", completed.length], ["Total spent", `₹${spent.toFixed(0)}`]].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-extrabold text-slate-900">{value}</p></div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3"><div><h2 className="text-xl font-bold text-slate-900">Recent bookings</h2><p className="mt-1 text-sm text-slate-500">Your latest parking reservations.</p></div><Link to="/find-parking" className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white">Find Parking</Link></div>
            <div className="mt-6 space-y-3">
              {latest.length ? latest.map((b) => (
                <div key={b._id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div><p className="font-bold text-slate-800">{b.parkingSpace?.name || "Parking space"}</p><p className="mt-1 text-xs text-slate-500">{new Date(b.startTime).toLocaleString()} · {b.vehicleNumber}</p></div>
                    <div className="flex items-center gap-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${b.status === "confirmed" ? "bg-green-50 text-green-700" : b.status === "cancelled" ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-600"}`}>{b.status}</span><span className="font-bold text-slate-900">₹{b.totalPrice}</span>{b.status === "confirmed" && <button onClick={() => cancel(b._id)} className="text-xs font-semibold text-red-600">Cancel</button>}</div>
                  </div>
                </div>
              )) : <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">No bookings yet. Find your first parking spot.</div>}
            </div>
          </section>

          <aside className="rounded-2xl bg-slate-950 p-6 text-white shadow-sm">
            <p className="text-sm font-semibold text-blue-300">Available right now</p>
            <p className="mt-2 text-4xl font-extrabold">{spaces.filter((s) => s.isAvailable && s.availableSpots > 0).length}</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">parking locations have available capacity.</p>
            <Link to="/find-parking" className="mt-6 block rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-bold text-white hover:bg-blue-500">Explore locations</Link>
          </aside>
        </div>
      </div>
    </main>
  );
}