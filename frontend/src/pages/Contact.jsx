import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const submit = (e) => { e.preventDefault(); setSent(true); e.currentTarget.reset(); };
  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-3xl bg-slate-950 p-8 text-white"><p className="text-sm font-bold text-blue-300">CONTACT</p><h1 className="mt-3 text-4xl font-extrabold">Need a hand?</h1><p className="mt-4 leading-7 text-slate-300">Send us a message about a booking, parking space or general question.</p><div className="mt-10 space-y-4 text-sm text-slate-300"><p>✉ support@parknest.local</p><p>◷ Mon–Sat · 9 AM–6 PM</p></div></div>
        <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
          {sent && <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">Message sent successfully!</div>}
          <div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold">Name<input required placeholder="Your full name" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3" /></label><label className="text-sm font-semibold">Email<input required type="email" placeholder="you@example.com" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3" /></label></div>
          <label className="mt-5 block text-sm font-semibold">Message<textarea required rows="6" placeholder="Tell us how we can help..." className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3" /></label>
          <button className="mt-5 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white">Send Message</button>
        </form>
      </div>
    </main>
  );
}