import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { getGreeting } from '../../utils/formatDate';

/** Inline SVG owl mascot — warm amber tones */
function OwlMascot() {
  return (
    <svg
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-label="Productivity owl mascot"
    >
      {/* Body */}
      <ellipse cx="60" cy="76" rx="30" ry="32" fill="#f59e0b" />
      {/* Belly */}
      <ellipse cx="60" cy="82" rx="18" ry="22" fill="#fde68a" />
      {/* Head */}
      <circle cx="60" cy="44" r="28" fill="#f59e0b" />
      {/* Ear tufts */}
      <polygon points="37,22 42,36 32,36" fill="#d97706" />
      <polygon points="83,22 88,36 78,36" fill="#d97706" />
      {/* Left eye ring */}
      <circle cx="49" cy="44" r="11" fill="white" />
      {/* Right eye ring */}
      <circle cx="71" cy="44" r="11" fill="white" />
      {/* Left pupil */}
      <circle cx="49" cy="44" r="7" fill="#1e293b" />
      {/* Right pupil */}
      <circle cx="71" cy="44" r="7" fill="#1e293b" />
      {/* Eye shine left */}
      <circle cx="52" cy="41" r="2.5" fill="white" />
      {/* Eye shine right */}
      <circle cx="74" cy="41" r="2.5" fill="white" />
      {/* Beak */}
      <polygon points="60,50 55,57 65,57" fill="#d97706" />
      {/* Wings */}
      <ellipse cx="34" cy="78" rx="10" ry="18" fill="#d97706" transform="rotate(-10 34 78)" />
      <ellipse cx="86" cy="78" rx="10" ry="18" fill="#d97706" transform="rotate(10 86 78)" />
      {/* Feet */}
      <line x1="50" y1="106" x2="45" y2="114" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="106" x2="50" y2="115" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="106" x2="55" y2="114" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
      <line x1="70" y1="106" x2="65" y2="114" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
      <line x1="70" y1="106" x2="70" y2="115" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
      <line x1="70" y1="106" x2="75" y2="114" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
      {/* Belly stripes */}
      <ellipse cx="60" cy="78" rx="7" ry="4" fill="#fcd34d" opacity="0.6" />
      <ellipse cx="60" cy="86" rx="5" ry="3" fill="#fcd34d" opacity="0.5" />
    </svg>
  );
}

export function DashboardHeader() {
  const { user } = useAuth();

  const displayName = user?.fullName || user?.name || 'there';
  const firstName   = displayName.split(' ')[0];
  const initials    = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  });

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border border-amber-100 shadow-sm">
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100 rounded-full -translate-y-1/2 translate-x-1/3 opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 left-20 w-40 h-40 bg-orange-100 rounded-full translate-y-1/2 opacity-30 pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-7 py-6">
        {/* Left — greeting + user card */}
        <div className="flex items-center gap-4">
          {/* User avatar */}
          {/* <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-amber-200">
            {initials}
          </div> */}

          {/* Text */}
          <div>
            <p className="text-2xl font-semibold text-amber-600 uppercase tracking-wider mb-0.5">
              {getGreeting()} {firstName} 👋
            </p>
            {/* <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
              {firstName}
            </h2> */}
            <div className="flex items-center gap-2 mt-1">
              {/* <p className="text-xs text-slate-500">{user?.email}</p> */}
              {/* <span className="text-slate-300">·</span> */}
              <p className="text-md font-semibold text-slate-900">{today}</p>
            </div>
          </div>
        </div>

        {/* Right — owl mascot + status badge */}
        <div className="flex items-end gap-4">
          {/* Status pill */}
          <div className="flex flex-col items-end gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-amber-200 rounded-full text-xs font-semibold text-amber-700 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Productive mode on
            </div>
            <p className="text-xs text-amber-600/70 font-medium">Your companion is watching 🦉</p>
          </div>

          {/* Animated owl */}
          <motion.div
            className="w-24 h-24 flex-shrink-0"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <OwlMascot />
          </motion.div>
        </div>
      </div>
    </div>
  );
}