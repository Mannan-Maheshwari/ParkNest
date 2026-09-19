import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import { useAuth } from "../context/AuthContext";
import ParkNestLogo from "../components/ParkNestLogo";

export default function Login() {
  const [role, setRole] = useState("user");
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const result = await login(form.email, form.password, role);
    setBusy(false);
    if (!result.success) return setError(result.error);
    const target = location.state?.from || (role === "owner" ? "/owner/dashboard" : "/dashboard");
    navigate(target, { replace: true });
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-12">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft lg:grid-cols-2">
        <div className="hidden bg-slate-950 p-10 text-white lg:block">
          <div className="flex h-full flex-col justify-between">
            <div><ParkNestLogo size={46} /><h1 className="mt-10 text-4xl font-extrabold">Welcome back.</h1><p className="mt-4 max-w-sm leading-7 text-slate-300">Manage your parking journey from one simple dashboard.</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">Fast access to your bookings, parking spaces and account.</div>
          </div>
        </div>
        <div className="p-7 sm:p-10">
          <div><p className="text-sm font-bold text-blue-600">PARKNEST ACCOUNT</p><h2 className="mt-2 text-3xl font-extrabold text-slate-900">Sign in</h2><p className="mt-2 text-sm text-slate-500">Choose your account type to continue.</p></div>
          <div className="mt-7 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
            {["user", "owner"].map((item) => <button key={item} onClick={() => setRole(item)} className={`rounded-lg px-4 py-2.5 text-sm font-semibold capitalize ${role === item ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}>{item === "user" ? "Driver" : "Parking Owner"}</button>)}
          </div>
          <form onSubmit={submit} className="mt-7 space-y-5">
            <Alert message={error} />
            <label className="block text-sm font-semibold text-slate-700">Email<input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" type="email" required placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
            <label className="block text-sm font-semibold text-slate-700">Password<input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" type="password" required placeholder="Enter your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
            <button disabled={busy} className="w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">{busy ? "Signing in..." : "Sign In"}</button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">Don't have an account? <Link to={role === "owner" ? "/owner-register" : "/register"} className="font-semibold text-blue-600">Create one</Link></p>
        </div>
      </div>
    </main>
  );
}