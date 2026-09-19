import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import ParkingMap from "../components/ParkingMap";

export default function Home() {
  const [spaces, setSpaces] = useState([]);
  useEffect(() => {
    api.get("/user/parking-spaces").then((r) => setSpaces(r.data)).catch(() => {});
  }, []);

  return (
    <main>
      <section className="overflow-hidden bg-slate-950">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-xs font-semibold text-blue-200">
              Simple parking, made better
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
              Find your spot.
              <span className="block text-blue-400">Skip the parking stress.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Discover available parking spaces, check prices and reserve your spot before you arrive.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/find-parking" className="rounded-xl bg-blue-600 px-6 py-3.5 text-center font-bold text-white shadow-lg hover:bg-blue-500">
                Find Parking
              </Link>
              <Link to="/register" className="rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-center font-bold text-white hover:bg-white/10">
                Create Account
              </Link>
            </div>
            <div className="mt-9 flex flex-wrap gap-6 text-sm text-slate-400">
              <span>✓ Easy discovery</span>
              <span>✓ Quick booking</span>
              <span>✓ Clear pricing</span>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-3 shadow-2xl">
              <div className="overflow-hidden rounded-2xl bg-white p-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div><p className="text-xs text-slate-400">Nearby</p><p className="font-bold text-slate-900">Parking locations</p></div>
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">{spaces.length || 3} locations</span>
                </div>
                <div className="mt-4 space-y-3">
                  {(spaces.slice(0, 3).length ? spaces.slice(0, 3) : [
                    { _id: 1, name: "Central Parking Hub", address: "City Centre", price: 40, availableSpots: 18 },
                    { _id: 2, name: "Metro Parking", address: "Main Road", price: 30, availableSpots: 9 },
                    { _id: 3, name: "Market Square Parking", address: "Market Area", price: 50, availableSpots: 12 }
                  ]).map((s) => (
                    <div key={s._id} className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                      <div><p className="font-semibold text-slate-800">{s.name}</p><p className="text-xs text-slate-500">{s.address}</p></div>
                      <div className="text-right"><p className="font-bold text-blue-600">₹{s.price}</p><p className="text-[11px] text-green-600">{s.availableSpots} free</p></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">Why ParkNest</p>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900">Parking without the hassle</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ["01", "Find nearby", "Explore available parking spaces in one place."],
              ["02", "Compare clearly", "See price, availability and location before booking."],
              ["03", "Book confidently", "Reserve your spot and keep your booking details handy."]
            ].map(([n, title, text]) => (
              <div key={n} className="rounded-2xl border border-slate-200 bg-slate-50 p-7">
                <span className="text-sm font-extrabold text-blue-600">{n}</span>
                <h3 className="mt-4 text-xl font-bold text-slate-900">{title}</h3>
                <p className="mt-2 leading-7 text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div><p className="text-sm font-bold uppercase tracking-widest text-blue-600">Explore</p><h2 className="mt-2 text-3xl font-extrabold text-slate-900">Parking near you</h2></div>
            <Link to="/find-parking" className="font-semibold text-blue-600 hover:text-blue-700">View all →</Link>
          </div>
          <div className="mt-8 h-[420px] overflow-hidden rounded-2xl">
            {spaces.length ? <ParkingMap spaces={spaces} onSelect={() => {}} /> : (
              <div className="grid h-full place-items-center rounded-2xl border border-dashed border-slate-300 bg-white text-slate-500">
                <div className="text-center"><p className="font-semibold">Sign in to explore live parking</p><p className="mt-1 text-sm">Your available parking spaces will appear here.</p><Link to="/login" className="mt-4 inline-block rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white">Login</Link></div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-blue-600 py-14">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 md:flex-row md:text-left">
          <div><h2 className="text-3xl font-extrabold text-white">Ready to park smarter?</h2><p className="mt-2 text-blue-100">Find an available space and reserve it in minutes.</p></div>
          <Link to="/find-parking" className="rounded-xl bg-white px-6 py-3 font-bold text-blue-700 shadow-lg hover:bg-blue-50">Explore Parking</Link>
        </div>
      </section>
    </main>
  );
}