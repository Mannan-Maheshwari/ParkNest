import { useCallback, useEffect, useMemo, useState } from "react";
import Alert from "../components/Alert";
import Modal from "../components/Modal";
import api from "../services/api";

const emptyForm = { name: "", address: "", price: "", description: "", totalSpots: "", lat: "", lng: "" };

export default function OwnerDashboard() {
  const [spaces, setSpaces] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [modal, setModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [spaceRes, bookingRes] = await Promise.all([api.get("/owner/parking-spaces"), api.get("/owner/bookings")]);
      setSpaces(spaceRes.data);
      setBookings(bookingRes.data);
    } catch (e) {
      setError(e.response?.data?.msg || "Unable to load owner dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const stats = useMemo(() => ({
    spaces: spaces.length,
    capacity: spaces.reduce((n, s) => n + Number(s.totalSpots || 0), 0),
    available: spaces.reduce((n, s) => n + Number(s.availableSpots || 0), 0),
    activeBookings: bookings.filter((b) => ["confirmed", "in-progress"].includes(b.status)).length,
    revenue: bookings.filter((b) => b.status !== "cancelled").reduce((n, b) => n + Number(b.totalPrice || 0), 0)
  }), [spaces, bookings]);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModal(true); setError(""); };

  const openEdit = (space) => {
    setEditing(space);
    setForm({
      name: space.name || "", address: space.address || "", price: space.price || "",
      description: space.description || "", totalSpots: space.totalSpots || "",
      lat: space.coordinates?.lat || "", lng: space.coordinates?.lng || ""
    });
    setModal(true); setError("");
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/owner/parking-spaces/${editing._id}`, {
          name: form.name, address: form.address, price: Number(form.price),
          description: form.description, totalSpots: Number(form.totalSpots)
        });
      } else {
        await api.post("/owner/parking-spaces", {
          name: form.name, address: form.address, price: Number(form.price),
          description: form.description, totalSpots: Number(form.totalSpots),
          coordinates: { lat: Number(form.lat), lng: Number(form.lng) }
        });
      }
      setModal(false); load();
    } catch (e2) {
      setError(e2.response?.data?.msg || "Unable to save parking space.");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this parking space?")) return;
    try { await api.delete(`/owner/parking-spaces/${id}`); load(); }
    catch (e) { setError(e.response?.data?.msg || "Unable to delete parking space."); }
  };

  const toggle = async (id) => {
    try { await api.patch(`/owner/parking-spaces/${id}/toggle-active`); load(); }
    catch (e) { setError(e.response?.data?.msg || "Unable to update parking space."); }
  };

  const cancelBooking = async (id) => {
    try { await api.patch(`/owner/bookings/${id}/cancel`); load(); }
    catch (e) { setError(e.response?.data?.msg || "Unable to cancel booking."); }
  };

  if (loading) return <div className="grid min-h-[70vh] place-items-center bg-slate-50 text-slate-500">Loading owner dashboard...</div>;

  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
          <p className="text-sm font-bold text-blue-600">OWNER DASHBOARD</p>
          <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><h1 className="text-3xl font-extrabold text-slate-900">Manage your parking business</h1><p className="mt-2 text-slate-500">Keep spaces, availability and bookings organized.</p></div><button onClick={openAdd} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white">+ Add Parking Space</button></div>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Alert message={error} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[["Spaces", stats.spaces], ["Capacity", stats.capacity], ["Available", stats.available], ["Bookings", stats.activeBookings], ["Revenue", `₹${stats.revenue.toFixed(0)}`]].map(([l, v]) => <div key={l} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{l}</p><p className="mt-2 text-2xl font-extrabold text-slate-900">{v}</p></div>)}
        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between"><div><h2 className="text-xl font-bold text-slate-900">My parking spaces</h2><p className="mt-1 text-sm text-slate-500">Add, edit or temporarily deactivate listings.</p></div></div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {spaces.length ? spaces.map((s) => (
              <div key={s._id} className="rounded-2xl border border-slate-200 p-5">
                <div className="flex items-start justify-between gap-3"><div><h3 className="font-bold text-slate-900">{s.name}</h3><p className="mt-1 text-xs text-slate-500">{s.address}</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${s.isActive ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}>{s.isActive ? "Active" : "Inactive"}</span></div>
                <div className="mt-5 grid grid-cols-3 gap-2 text-center"><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-400">Rate</p><p className="mt-1 font-bold">₹{s.price}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-400">Total</p><p className="mt-1 font-bold">{s.totalSpots}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-400">Free</p><p className="mt-1 font-bold text-green-700">{s.availableSpots}</p></div></div>
                <div className="mt-4 flex gap-2"><button onClick={() => openEdit(s)} className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold">Edit</button><button onClick={() => toggle(s._id)} className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold">{s.isActive ? "Deactivate" : "Activate"}</button><button onClick={() => remove(s._id)} className="rounded-lg border border-red-100 px-3 py-2 text-sm font-semibold text-red-600">Delete</button></div>
              </div>
            )) : <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 md:col-span-2">No parking spaces yet. Add your first listing.</div>}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Recent bookings</h2>
          <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead><tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400"><th className="px-3 py-3">Parking</th><th className="px-3 py-3">Customer</th><th className="px-3 py-3">Vehicle</th><th className="px-3 py-3">Time</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Amount</th><th /></tr></thead><tbody>{bookings.slice(0, 12).map((b) => <tr key={b._id} className="border-b border-slate-50"><td className="px-3 py-4 font-semibold">{b.parkingSpace?.name || "-"}</td><td className="px-3 py-4">{b.user?.name || "-"}</td><td className="px-3 py-4">{b.vehicleNumber}</td><td className="px-3 py-4 text-xs text-slate-500">{new Date(b.startTime).toLocaleString()}</td><td className="px-3 py-4 capitalize">{b.status}</td><td className="px-3 py-4 font-semibold">₹{b.totalPrice}</td><td className="px-3 py-4">{b.status === "confirmed" && <button onClick={() => cancelBooking(b._id)} className="text-xs font-semibold text-red-600">Cancel</button>}</td></tr>)}</tbody></table></div>
        </section>
      </div>

      <Modal open={modal} title={editing ? "Edit parking space" : "Add parking space"} onClose={() => setModal(false)}>
        <form onSubmit={save} className="space-y-4">
          {["name","address","description"].map((field) => <label key={field} className="block text-sm font-semibold text-slate-700">{field === "name" ? "Parking name" : field === "address" ? "Address" : "Description"}{field === "description" ? <textarea rows="3" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder={field === "name" ? "e.g. Central Parking Hub" : field === "address" ? "e.g. Connaught Place, New Delhi" : "Short description of the parking facility"} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} /> : <input required className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder={field === "name" ? "e.g. Central Parking Hub" : field === "address" ? "e.g. Connaught Place, New Delhi" : "Short description of the parking facility"} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />}</label>)}
          <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Price/hour<input required type="number" min="0" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3" placeholder="e.g. 40" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></label><label className="text-sm font-semibold">Total spots<input required type="number" min="1" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3" placeholder="e.g. 30" value={form.totalSpots} onChange={(e) => setForm({ ...form, totalSpots: e.target.value })} /></label></div>
          {!editing && <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Latitude<input required type="number" step="any" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3" placeholder="e.g. 28.6315" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} /></label><label className="text-sm font-semibold">Longitude<input required type="number" step="any" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3" placeholder="e.g. 77.2167" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} /></label></div>}
          <button className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white">{editing ? "Save Changes" : "Create Parking Space"}</button>
        </form>
      </Modal>
    </main>
  );
}