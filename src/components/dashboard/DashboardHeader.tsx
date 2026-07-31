import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../../hooks/useDashboard';
import type { DashboardStats } from '../../types/task';
import {
  Flame,
  CheckCircle2,
  Clock,
  Zap,
  Sparkles,
  Sunrise,
  Sun,
  Sunset,
  Moon,
} from 'lucide-react';

interface DashboardHeaderProps {
  stats?: DashboardStats | null;
}

const MOTIVATIONAL_QUOTES = [
  'Small progress is still progress.',
  'Stay consistent and focus on one task at a time.',
  'Done is better than perfect.',
  'Focus on impact, not just activity.',
  "Your future self will thank you for today's effort.",
  'Great things are built one small step at a time.',
  'Clarity precedes mastery. Stay focused.',
];

export function DashboardHeader({ stats: propsStats }: DashboardHeaderProps) {
  const { user } = useAuth();
  const { stats: hookStats } = useDashboard();

  // Use props stats if provided, otherwise fallback to hook stats
  const stats = propsStats !== undefined ? propsStats : hookStats;

  // Extract user's first name
  const displayName = user?.fullName || user?.name || 'there';
  const firstName = displayName?.trim().split(' ')[0] || 'there';

  // Determine current date and time of day (Context-Aware Greeting & Theme)
  const { dateString, timeSlot, greetingText, greetingEmoji, theme } = useMemo(() => {
    const now = new Date();
    const hour = now.getHours();

    const formattedDate = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    let slot: 'morning' | 'afternoon' | 'evening' | 'night';
    let text: string;
    let emoji: string;
    let themeStyles: {
      gradient: string;
      glowColor: string;
      chipBg: string;
      IconComponent: React.ElementType;
    };

    if (hour >= 4 && hour < 12) {
      slot = 'morning';
      text = 'Good Morning';
      emoji = '🌅';
      themeStyles = {
        gradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
        glowColor: 'bg-amber-400',
        chipBg: 'bg-amber-50 text-amber-700 border-amber-200/60',
        IconComponent: Sunrise,
      };
    } else if (hour >= 12 && hour < 17) {
      slot = 'afternoon';
      text = 'Good Afternoon';
      emoji = '☀️';
      themeStyles = {
        gradient: 'from-blue-500/10 via-sky-500/5 to-transparent',
        glowColor: 'bg-sky-400',
        chipBg: 'bg-blue-50 text-blue-700 border-blue-200/60',
        IconComponent: Sun,
      };
    } else if (hour >= 17 && hour < 21) {
      slot = 'evening';
      text = 'Good Evening';
      emoji = '🌇';
      themeStyles = {
        gradient: 'from-indigo-500/10 via-purple-500/5 to-transparent',
        glowColor: 'bg-indigo-400',
        chipBg: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
        IconComponent: Sunset,
      };
    } else {
      slot = 'night';
      text = 'Good Night';
      emoji = '🌙';
      themeStyles = {
        gradient: 'from-slate-700/10 via-indigo-950/10 to-transparent',
        glowColor: 'bg-purple-400',
        chipBg: 'bg-purple-50 text-purple-700 border-purple-200/60',
        IconComponent: Moon,
      };
    }

    return {
      dateString: formattedDate,
      timeSlot: slot,
      greetingText: text,
      greetingEmoji: emoji,
      theme: themeStyles,
    };
  }, []);

  // Compute daily motivation quote based on date hash (remains fixed for the day)
  const dailyQuote = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    let hash = 0;
    for (let i = 0; i < todayStr.length; i++) {
      hash = (hash << 5) - hash + todayStr.charCodeAt(i);
      hash |= 0;
    }
    const index = Math.abs(hash) % MOTIVATIONAL_QUOTES.length;
    return MOTIVATIONAL_QUOTES[index];
  }, []);

  // Compute productivity insight based on stats
  const productivityInsight = useMemo(() => {
    if (!stats) {
      return "🔥 You're on a 4-day productivity streak.";
    }
    if (stats.completed > 0) {
      return `✅ You completed ${stats.completed} task${stats.completed === 1 ? '' : 's'} so far today.`;
    }
    if (stats.pending > 0) {
      return `🎯 Only ${stats.pending} task${stats.pending === 1 ? '' : 's'} left to finish today.`;
    }
    if (stats.highPriority > 0) {
      return `⚡ ${stats.highPriority} high-priority task${stats.highPriority === 1 ? '' : 's'} requiring attention.`;
    }
    return "🔥 You're on a 4-day productivity streak.";
  }, [stats]);

  const TimeIcon = theme.IconComponent;

  return (
    <div
      role="region"
      aria-label="Welcome section"
      className="group relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out"
    >
      {/* CSS Keyframes for Mascot Animations & Accessibility Reduced Motion */}
      <style>{`
        @keyframes mascotFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes mascotBlink {
          0%, 92%, 100% { transform: scaleY(1); }
          96% { transform: scaleY(0.1); }
        }
        @keyframes mascotWave {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(12deg); }
        }
        .animate-mascot-float {
          animation: mascotFloat 4s ease-in-out infinite;
        }
        .animate-mascot-blink {
          transform-origin: center;
          animation: mascotBlink 4s ease-in-out infinite;
        }
        .animate-mascot-wave {
          transform-origin: bottom left;
          animation: mascotWave 3s ease-in-out infinite;
        }
        .group:hover .animate-mascot-wave-hover {
          animation: mascotWave 0.8s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-mascot-float,
          .animate-mascot-blink,
          .animate-mascot-wave,
          .animate-mascot-wave-hover {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Feature 7: Premium Background Decoration (<10% opacity) */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} pointer-events-none transition-opacity duration-500`}
      />
      <div
        className={`absolute -top-12 -right-12 w-48 h-48 rounded-full ${theme.glowColor} opacity-[0.06] blur-2xl pointer-events-none transition-all duration-500 group-hover:opacity-[0.10]`}
      />
      <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-blue-400 opacity-[0.03] blur-xl pointer-events-none" />
      {/* Decorative subtle dot matrix */}
      <svg
        className="absolute bottom-2 right-1/4 w-24 h-24 text-slate-400/10 pointer-events-none"
        fill="currentColor"
        viewBox="0 0 100 100"
      >
        <circle cx="10" cy="10" r="2" />
        <circle cx="30" cy="10" r="2" />
        <circle cx="50" cy="10" r="2" />
        <circle cx="10" cy="30" r="2" />
        <circle cx="30" cy="30" r="2" />
        <circle cx="50" cy="30" r="2" />
      </svg>

      {/* Content Layout */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Left Side: Greeting, Date, Insights, Motivation & Summary Chips */}
        <div className="space-y-3.5 max-w-2xl">
          {/* Greeting Header & Date */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xl sm:text-2xl" role="img" aria-label={greetingText}>
                {greetingEmoji}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {greetingText}, <span className="text-blue-600">{firstName}</span>!
              </h1>
              {/* <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full border ${theme.chipBg}`}
              >
                <TimeIcon size={12} />
                {timeSlot.toUpperCase()}
              </span> */}
            </div>
            <p className="text-md font-medium text-slate-500">{dateString}</p>
          </div>

          {/* Feature 3: Daily Insight & Feature 4: Smart Motivation */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600 bg-slate-50/80 backdrop-blur-sm border border-slate-100 p-2.5 px-3 rounded-xl">
            {/* <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 shrink-0">
              {productivityInsight}
            </span>
            <span className="hidden sm:inline text-slate-300">|</span> */}
            <span className="italic text-slate-500 flex items-center gap-1">
              <Sparkles size={13} className="text-amber-500 shrink-0" />
              "{dailyQuote}"
            </span>
          </div>

          {/* Feature 5: Activity Summary Chips */}
          {/* <div className="flex flex-wrap items-center gap-2 pt-0.5">
            {/* <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200/60 text-xs font-semibold">
              <Flame size={13} className="text-amber-500" />
              <span>4 Day Streak</span>
            </div> }

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-semibold">
              <CheckCircle2 size={13} className="text-emerald-500" />
              <span>{stats?.completed ?? 0} Completed</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/60 text-xs font-semibold">
              <Clock size={13} className="text-blue-500" />
              <span>{stats?.pending ?? 0} Pending</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200/60 text-xs font-semibold">
              <Zap size={13} className="text-rose-500" />
              <span>{stats?.highPriority ?? 0} High Priority</span>
            </div>
          </div> */}
        </div>

        {/* Right Side: Feature 2 — Animated Mascot (Productivity Owl) */}
        <div className="shrink-0 flex items-center justify-end self-end md:self-center">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 animate-mascot-float flex items-center justify-center">
            {/* Mascot Glow */}
            <div className="absolute inset-2 bg-gradient-to-tr from-blue-400/20 to-indigo-500/20 rounded-full blur-lg -z-10 group-hover:scale-105 transition-transform duration-300" />

            {/* Productivity Owl Mascot */}
            <svg
              className="w-full h-full drop-shadow-md overflow-visible"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Productivity Mascot"
            >
              {/* Branch / Perch */}
              <path
                d="M15 102C35 98 85 98 105 102"
                stroke="#CBD5E1"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M25 101C45 97 75 97 95 101"
                stroke="#64748B"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Body */}
              <ellipse cx="60" cy="68" rx="34" ry="30" fill="#3B82F6" />
              {/* Belly */}
              <ellipse cx="60" cy="72" rx="22" ry="20" fill="#EFF6FF" />

              {/* Belly Feather Pattern */}
              <path d="M52 64Q60 67 68 64" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
              <path d="M54 72Q60 75 66 72" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
              <path d="M56 80Q60 82 64 80" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />

              {/* Head */}
              <circle cx="60" cy="42" r="28" fill="#2563EB" />
              {/* Ears */}
              <path d="M38 24L32 10L48 20Z" fill="#1D4ED8" />
              <path d="M82 24L88 10L72 20Z" fill="#1D4ED8" />

              {/* Eye Rings */}
              <circle cx="48" cy="40" r="11" fill="white" />
              <circle cx="72" cy="40" r="11" fill="white" />

              {/* Animated Pupils (Blinking) */}
              <g className="animate-mascot-blink">
                <circle cx="50" cy="40" r="5" fill="#1E293B" />
                <circle cx="74" cy="40" r="5" fill="#1E293B" />
                <circle cx="52" cy="38" r="1.8" fill="white" />
                <circle cx="76" cy="38" r="1.8" fill="white" />
              </g>

              {/* Beak */}
              <polygon points="60,45 55,52 65,52" fill="#F59E0B" />

              {/* Feet */}
              <ellipse cx="48" cy="98" rx="6" ry="3" fill="#F59E0B" />
              <ellipse cx="72" cy="98" rx="6" ry="3" fill="#F59E0B" />

              {/* Left Wing */}
              <path
                d="M28 58Q20 70 30 84"
                stroke="#1D4ED8"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
              />

              {/* Right Wing (Waving Animation) */}
              <g className="animate-mascot-wave animate-mascot-wave-hover">
                <path
                  d="M92 58Q104 50 98 38"
                  stroke="#1D4ED8"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx="98" cy="36" r="5" fill="#F59E0B" />
                <path
                  d="M96 36L98 34L100 38"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </g>

              {/* Time of Day Mascot Accent Badge */}
              <g transform="translate(84, 14)">
                <circle cx="10" cy="10" r="10" fill="white" />
                {timeSlot === 'morning' && <circle cx="10" cy="10" r="6" fill="#F59E0B" />}
                {timeSlot === 'afternoon' && <circle cx="10" cy="10" r="6" fill="#3B82F6" />}
                {timeSlot === 'evening' && <circle cx="10" cy="10" r="6" fill="#6366F1" />}
                {timeSlot === 'night' && (
                  <path d="M12 6A6 6 0 1 1 6 12A5 5 0 0 0 12 6Z" fill="#8B5CF6" />
                )}
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}