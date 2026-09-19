import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, isOwner, userData, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const close = () => setOpen(false);

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition ${isActive ? "text-blue-600" : "text-slate-600 hover:text-blue-600"}`;

  const handleLogout = () => {
    logout();
    close();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" onClick={close} className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 font-extrabold text-white shadow-sm">P</span>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Park<span className="text-blue-600">Nest</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/find-parking" className={linkClass}>Find Parking</NavLink>
          <NavLink to="/faq" className={linkClass}>FAQ</NavLink>
          {isAuthenticated && (
            <NavLink to={isOwner ? "/owner/dashboard" : "/dashboard"} className={linkClass}>
              Dashboard
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={toggleDarkMode}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-slate-500 lg:inline">
                Hi, {userData?.name?.split(" ")[0] || "there"}
              </span>
              <button onClick={handleLogout} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Login</Link>
              <Link to="/register" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">Get Started</Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleDarkMode}
            className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            aria-label="Toggle dark mode"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
          <button
          onClick={() => setOpen(!open)}
          className="rounded-xl border border-slate-200 p-2 md:hidden"
          aria-label="Toggle menu"
        >
          <span className="block h-0.5 w-5 bg-slate-700" />
          <span className="mt-1.5 block h-0.5 w-5 bg-slate-700" />
          <span className="mt-1.5 block h-0.5 w-5 bg-slate-700" />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            <NavLink onClick={close} to="/" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Home</NavLink>
            <NavLink onClick={close} to="/find-parking" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Find Parking</NavLink>
            <NavLink onClick={close} to="/faq" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">FAQ</NavLink>
            {isAuthenticated ? (
              <>
                <NavLink onClick={close} to={isOwner ? "/owner/dashboard" : "/dashboard"} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Dashboard</NavLink>
                <button onClick={handleLogout} className="mt-1 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">Logout</button>
              </>
            ) : (
              <div className="mt-2 flex gap-2 border-t border-slate-100 pt-3">
                <Link onClick={close} to="/login" className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold">Login</Link>
                <Link onClick={close} to="/register" className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}