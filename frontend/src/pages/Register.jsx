import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [role, setRole] = useState("user");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", businessName: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    setBusy(true);
    const payload = role === "owner"
      ? { name: form.name, email: form.email, password: form.password, businessName: form.businessName }
      : { name: form.name, email: form.email, password: form.password };
    const result = await register(payload, role);
    setBusy(false);
    if (!result.success) return setError(result.error);
    setSuccess("Account created successfully. Redirecting to login...");
    setTimeout(() => navigate("/login"), 1200);
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-7 shadow-soft sm:p-10">
        <p className="text-sm font-bold text-blue-600">JOIN PARKNEST</p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Create your account</h1>
        <p className="mt-2 text-sm text-slate-500">Start discovering and managing parking spaces.</p>
        <div className="mt-7 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
          {["user", "owner"].map((item) => <button key={item} onClick={() => setRole(item)} className={`rounded-lg px-4 py-2.5 text-sm font-semibold ${role === item ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}>{item === "user" ? "Driver account" : "Owner account"}</button>)}
        </div>
        <form onSubmit={submit} className="mt-7 space-y-4">
          <Alert message={error} />
          {success && <Alert message={success} type="success" />}
          <label className="block text-sm font-semibold text-slate-700">Full name<input required className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          {role === "owner" && <label className="block text-sm font-semibold text-slate-700">Business name<input required className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} /></label>}
          <label className="block text-sm font-semibold text-slate-700">Email<input required type="email" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-slate-700">Password<input required minLength={6} type="password" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
            <label className="block text-sm font-semibold text-slate-700">Confirm password<input required type="password" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} /></label>
          </div>
          <button disabled={busy} className="w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white hover:bg-blue-700 disabled:opacity-60">{busy ? "Creating account..." : "Create Account"}</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">Already registered? <Link to="/login" className="font-semibold text-blue-600">Sign in</Link></p>
      </div>
    </main>
  );
}