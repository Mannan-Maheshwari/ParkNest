import { Link } from "react-router-dom";

export default function NotFound() {
  return <main className="grid min-h-[70vh] place-items-center bg-slate-50 px-4 text-center"><div><p className="text-7xl font-extrabold text-blue-600">404</p><h1 className="mt-3 text-2xl font-bold text-slate-900">Page not found</h1><p className="mt-2 text-slate-500">The page you're looking for doesn't exist.</p><Link to="/" className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 font-bold text-white">Back Home</Link></div></main>;
}