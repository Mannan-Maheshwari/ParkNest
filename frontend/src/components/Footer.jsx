import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <div className="text-lg font-extrabold text-slate-900">Park<span className="text-blue-600">Nest</span></div>
          <p className="mt-1 text-sm text-slate-500">Find a spot. Book it. Park with confidence.</p>
        </div>
        <div className="flex gap-5 text-sm text-slate-500">
          <Link to="/faq" className="hover:text-blue-600">FAQ</Link>
          <Link to="/contact" className="hover:text-blue-600">Contact</Link>
        </div>
      </div>
    </footer>
  );
}