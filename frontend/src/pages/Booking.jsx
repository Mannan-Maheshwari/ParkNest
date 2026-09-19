import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import api from "../services/api";
import Alert from "../components/Alert";
import Modal from "../components/Modal";

export default function Booking() {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const space = state?.space;
  const [form, setForm] = useState({ startTime: "", endTime: "", vehicleNumber: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [booking, setBooking] = useState(null);

  const estimate = useMemo(() => {
    if (!form.startTime || !form.endTime || !space) return 0;
    const hours = (new Date(form.endTime) - new Date(form.startTime)) / 3600000;
    return hours > 0 ? hours * Number(space.price) : 0;
  }, [form, space]);

  if (!space) return <div className="mx-auto max-w-2xl px-4 py-20"><Alert message="Booking details expired. Please select the parking space again." /></div>;

  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.vehicleNumber.trim()) return setError("Please enter your vehicle number.");
    if (estimate <= 0) return setError("End time must be after start time.");
    setPaymentOpen(true);
  };

  const confirmBooking = async () => {
    setBusy(true);
    try {
      const response = await api.post("/user/bookings", { parkingSpaceId: id, ...form });
      setBooking(response.data);
      setPaymentOpen(false);
    } catch (e) {
      setError(e.response?.data?.msg || e.response?.data?.message || "Booking failed.");
      setPaymentOpen(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <button onClick={() => navigate(-1)} className="text-sm font-semibold text-blue-600">← Back</button>
        <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_320px]">
          <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft sm:p-9">
            <p className="text-sm font-bold text-blue-600">RESERVE YOUR SPOT</p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-900">{space.name}</h1>
            <p className="mt-2 text-sm text-slate-500">{space.address}</p>
            <Alert message={error} />
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-slate-700">Start time<input required type="datetime-local" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} /></label>
              <label className="block text-sm font-semibold text-slate-700">End time<input required type="datetime-local" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} /></label>
            </div>
            <label className="mt-5 block text-sm font-semibold text-slate-700">Vehicle number<input required placeholder="e.g. DL 01 AB 1234" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" value={form.vehicleNumber} onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value.toUpperCase() })} /></label>
            <button className="mt-7 w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white hover:bg-blue-700">Continue to Payment</button>
          </form>
          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Booking summary</p>
            <div className="mt-5 flex justify-between gap-4"><span className="text-slate-500">Rate</span><span className="font-semibold">₹{space.price}/hr</span></div>
            <div className="mt-3 flex justify-between gap-4"><span className="text-slate-500">Estimated total</span><span className="text-xl font-extrabold text-blue-600">₹{estimate.toFixed(2)}</span></div>
            <p className="mt-5 text-xs leading-5 text-slate-400">The payment screen is a simulated checkout for this internship project. No real payment gateway is connected.</p>
          </aside>
        </div>
      </div>

      <Modal open={paymentOpen} title="Confirm demo payment" onClose={() => setPaymentOpen(false)}>
        <div className="rounded-2xl bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Amount payable</p>
          <p className="mt-1 text-3xl font-extrabold text-slate-900">₹{estimate.toFixed(2)}</p>
          <p className="mt-3 text-xs text-slate-500">This is a simulated payment. Confirming will create the booking in the existing ParkEase backend.</p>
        </div>
        <button disabled={busy} onClick={confirmBooking} className="mt-5 w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white disabled:opacity-60">{busy ? "Confirming..." : "Pay & Confirm Booking"}</button>
      </Modal>

      <Modal open={!!booking} title="Booking confirmed" onClose={() => navigate("/dashboard")}>
        <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
          <p className="text-sm font-semibold text-green-700">Your parking spot is reserved.</p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">₹{booking?.totalPrice}</p>
          <p className="mt-1 text-sm text-slate-500">{space.name}</p>
          <p className="mt-1 text-sm text-slate-500">Vehicle: {booking?.vehicleNumber}</p>
        </div>
        <button onClick={() => navigate("/dashboard")} className="mt-5 w-full rounded-xl bg-slate-900 py-3.5 font-bold text-white">Go to Dashboard</button>
      </Modal>
    </main>
  );
}