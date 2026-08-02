import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Lock, AlertTriangle, LogOut, Save, Eye, EyeOff,
   Check, ShieldAlert, Key, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Skeleton } from '../components/ui/LoadingSkeleton';
import { useAuth } from '../context/AuthContext';
import { CURRENT_USER } from '../data/mockData';
// import { COMPANIONS } from '../data/companions';

// ─── Theme Helper ─────────────────────────────────────────────────────────────

type ThemeMode = 'light' | 'dark' | 'system';

function applyGlobalTheme(mode: ThemeMode) {
  const root = document.documentElement;
  if (mode === 'dark') {
    root.classList.add('dark');
  } else if (mode === 'light') {
    root.classList.remove('dark');
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}

// ─── Horizontal Block Card Wrapper ───────────────────────────────────────────

function HorizontalCard({
  icon: Icon,
  title,
  description,
  children,
  headerAction,
  className = '',
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200rounded-2xl p-5 sm:p-6 shadow-2xs transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between ${className}`}>
      {/* Horizontal Top Header */}
      <div className="flex items-start justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 shrink-0">
            <Icon size={18} />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">{title}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
          </div>
        </div>
        {headerAction}
      </div>

      {/* Main Content Area */}
      <div className="flex-1">{children}</div>
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0 border-b last:border-0 border-slate-100">
      <div>
        <p className="text-sm font-medium text-slate-800">{label}</p>
        {description && (
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ${
          checked ? "bg-blue-600" : "bg-slate-200"
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform duration-200 ${
            checked ? "translate-x-[18px]" : "translate-x-[3px]"
          }`}
        />
      </button>
    </div>
  );
}

// ─── Main Settings Component ──────────────────────────────────────────────────

export default function Settings() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Simulated initial loading state
  const [loading, setLoading] = useState(true);

  // User Profile default values from Auth context
  const activeUserEmail = user?.email || CURRENT_USER.email;
  const activeUserName = user?.fullName || user?.name || CURRENT_USER.name;

  // Saved baseline state
  const [savedName, setSavedName] = useState(activeUserName);
  const [savedEmail, setSavedEmail] = useState(activeUserEmail);
  const [savedTheme, setSavedTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('taskflow_theme') as ThemeMode) || 'light';
  });
  const [savedCompanionId, setSavedCompanionId] = useState<string>(() => {
    return localStorage.getItem('taskflow_companion') || 'owl';
  });
  const [savedCompanionTheme, setSavedCompanionTheme] = useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem('taskflow_companion_theme') as 'light' | 'dark' | 'system') || 'light';
  });

  // Active form state
  const [name, setName] = useState(activeUserName);
  const [email, setEmail] = useState(activeUserEmail);
  const [theme, _setTheme] = useState<ThemeMode>(savedTheme);
  const [selectedCompanionId, _setSelectedCompanionId] = useState<string>(savedCompanionId);
  const [companionTheme, _setCompanionTheme] = useState<'light' | 'dark' | 'system'>(savedCompanionTheme);

  // Sync state if auth user loads later
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
      setSavedEmail(user.email);
    }
    if (user?.name || user?.fullName) {
      const uname = user.fullName || user.name || '';
      setName(uname);
      setSavedName(uname);
    }
  }, [user]);

  // Save animation state
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSavedSuccess, setProfileSavedSuccess] = useState(false);

  // Password state
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [pwError, setPwError] = useState('');
  const [isSavingPw, setIsSavingPw] = useState(false);
  const [pwSavedSuccess, setPwSavedSuccess] = useState(false);

  // // Notifications
  // const [notifs, setNotifs] = useState({
  //   taskCreated: true,
  //   taskDue: true,
  //   taskCompleted: false,
  //   weeklyDigest: true,
  //   marketing: false,
  // });

  // Danger zone dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Simulate loading on mount
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(timer);
  }, []);

  // // Instant Theme application
  // const handleThemeSelect = (newTheme: ThemeMode) => {
  //   setTheme(newTheme);
  //   applyGlobalTheme(newTheme);
  //   localStorage.setItem('taskflow_theme', newTheme);
  //   window.dispatchEvent(new Event('theme-change'));
  // };

  // // Instant Companion Selection update
  // const handleCompanionSelect = (id: string) => {
  //   setSelectedCompanionId(id);
  //   localStorage.setItem('taskflow_companion', id);
  //   window.dispatchEvent(new Event('companion-change'));
  // };

  // // Instant Companion Theme update
  // const handleCompanionThemeSelect = (cTheme: 'light' | 'dark' | 'system') => {
  //   setCompanionTheme(cTheme);
  //   localStorage.setItem('taskflow_companion_theme', cTheme);
  // };

  // Sync theme changes with global DOM
  useEffect(() => {
    applyGlobalTheme(theme);
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyGlobalTheme('system');
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  // Check if main form has unsaved changes
  const isDirty =
    name !== savedName ||
    email !== savedEmail ||
    theme !== savedTheme ||
    selectedCompanionId !== savedCompanionId ||
    companionTheme !== savedCompanionTheme;

  // Save all main settings
  const handleSaveSettings = useCallback(() => {
    setIsSavingProfile(true);
    setTimeout(() => {
      localStorage.setItem('taskflow_theme', theme);
      localStorage.setItem('taskflow_companion', selectedCompanionId);
      localStorage.setItem('taskflow_companion_theme', companionTheme);

      window.dispatchEvent(new Event('companion-change'));
      window.dispatchEvent(new Event('theme-change'));

      setSavedName(name);
      setSavedEmail(email);
      setSavedTheme(theme);
      setSavedCompanionId(selectedCompanionId);
      setSavedCompanionTheme(companionTheme);

      setIsSavingProfile(false);
      setProfileSavedSuccess(true);
      toast.success('Settings saved successfully!');
      setTimeout(() => setProfileSavedSuccess(false), 2500);
    }, 350);
  }, [name, email, theme, selectedCompanionId, companionTheme]);

  // Save Password
  const handlePasswordSave = () => {
    if (!currentPw) { setPwError('Current password is required'); return; }
    if (newPw.length < 8) { setPwError('New password must be at least 8 characters'); return; }
    if (newPw !== confirmPw) { setPwError('Passwords do not match'); return; }

    setPwError('');
    setIsSavingPw(true);
    setTimeout(() => {
      setIsSavingPw(false);
      setPwSavedSuccess(true);
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
      toast.success('Password updated successfully!');
      setTimeout(() => setPwSavedSuccess(false), 2500);
    }, 450);
  };

  // Keyboard shortcut listener (Ctrl + S / Cmd + S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (isDirty) {
          handleSaveSettings();
        } else if (currentPw || newPw || confirmPw) {
          handlePasswordSave();
        } else {
          toast.success('Settings are up to date!');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDirty, currentPw, newPw, confirmPw, handleSaveSettings]);

  const handleDeleteAccount = () => {
    setDeleteDialogOpen(false);
    toast.success('Account scheduled for deletion');
    navigate('/login');
  };

  // const activeCompanion = COMPANIONS.find((c) => c.id === selectedCompanionId) || COMPANIONS[0];

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 rounded-md" />
          <Skeleton className="h-4 w-72 rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 max-w-6xl mx-auto pb-16"
    >
      {/* Top Header */}
      <div 
      // className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs"
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-br from-white via-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-5 shadow-sm">
      
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
           Update your profile and preferences.   
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span 
          // className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium text-slate-600 bg-white border border-slate-200 shadow-sm">
            <Key size={12} className="text-slate-400" />
            <span>Ctrl + S</span>
          </span>
          {isDirty && (
            <Button
              size="sm"
              icon={isSavingProfile ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              onClick={handleSaveSettings}
              disabled={isSavingProfile}
            >
              Save Changes
            </Button>
          )}
        </div>
      </div>

      {/* Row 1 Grid: Horizontal Blocks for Profile Information & Appearance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
        {/* Profile Information */}
        <HorizontalCard
          icon={User}
          className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50 shadow-sm"
          title="Profile Information"
          description="Update your display details and email address."
        >
          <div className="space-y-4">
            <Input
              label="Full Name"
              // className=''
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="flex items-center gap-3 pt-2">
              <Button
                icon={
                  isSavingProfile ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : profileSavedSuccess ? (
                    <Check size={14} className="text-emerald-300" />
                  ) : (
                    <Save size={14} />
                  )
                }
                onClick={handleSaveSettings}
                size="sm"
                disabled={isSavingProfile}
              >
                {isSavingProfile ? 'Saving...' : 'Save Profile'}
              </Button>

              <AnimatePresence>
                {profileSavedSuccess && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-emerald-600 font-semibold flex items-center gap-1 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-lg"
                  >
                    <Check size={13} /> Saved!
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </HorizontalCard>

        {/* Appearance Section */}
        {/* <HorizontalCard
          icon={Moon}
          title="Appearance"
          description="Choose theme mode for TaskFlow on your device."
        >
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Theme Preference</label>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'light', label: 'Light', icon: Sun, desc: 'Clean theme' },
                { id: 'dark', label: 'Dark', icon: Moon, desc: 'Sleek dark' },
                { id: 'system', label: 'System', icon: Laptop, desc: 'Device match' },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = theme === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => handleThemeSelect(item.id as ThemeMode)}
                    className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all duration-200 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-blue-500/20 shadow-2xs'
                        : 'border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl mb-2 ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.label}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </HorizontalCard> */}
        {/* Change Password */}
        <HorizontalCard
          icon={Lock}
          className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50 shadow-sm"
          title="Change Password"
          description="Ensure your account uses a secure password."
        >
          <div className="space-y-3">
            <Input
              label="Current Password"
              type={showPw ? "text" : "password"}
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              placeholder="••••••••"
              rightIcon={
                currentPw.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                ) : null
              }
            />
            <Input
              label="New Password"
              type={showPw ? 'text' : 'password'}
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="••••••••"
              hint="At least 8 characters"
            />
            <Input
              label="Confirm New Password"
              type={showPw ? 'text' : 'password'}
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="••••••••"
              error={pwError}
            />
            <div className="flex items-center gap-3 pt-1">
              <Button
                icon={
                  isSavingPw ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : pwSavedSuccess ? (
                    <Check size={14} className="text-emerald-300" />
                  ) : (
                    <Key size={14} />
                  )
                }
                onClick={handlePasswordSave}
                size="sm"
                disabled={isSavingPw}
              >
                {isSavingPw ? 'Updating...' : 'Update Password'}
              </Button>
              {pwSavedSuccess && (
                <span className="text-xs text-emerald-600 font-medium">✓ Password updated!</span>
              )}
            </div>
          </div>
        </HorizontalCard>
      </div>

      {/* Row 2: Full-Width Horizontal Block for Productivity Companion */}
      {/* <HorizontalCard
        icon={Sparkles}
        title="Productivity Companion"
        description="Select your personal focus companion. The active companion will be reflected on your Dashboard header."
      >
        <div className="space-y-5">
          {/* Active Companion Horizontal Preview Banner }
          <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 bg-gradient-to-r from-slate-50 via-white to-blue-50/40 dark:from-slate-800/80 dark:via-slate-900 dark:to-blue-950/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border shadow-2xs shrink-0 ${activeCompanion.avatarBg} ${activeCompanion.borderColor}`}>
                {activeCompanion.icon}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{activeCompanion.name}</h3>
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 border border-blue-200/60 dark:border-blue-700/60">
                    {activeCompanion.badge}
                  </span>
                  <span className="text-xs font-mono text-slate-400 dark:text-slate-500">{activeCompanion.species}</span>
                </div>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">{activeCompanion.role}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{activeCompanion.description}</p>
              </div>
            </div>

            {/* Companion Theme Mode Pill }
            {/* <div className="flex items-center gap-1.5 self-end sm:self-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1.5 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 px-2 uppercase tracking-wider">Style:</span>
              {[
                { id: 'light', label: 'Light' },
                { id: 'dark', label: 'Dark' },
                { id: 'system', label: 'Match System' },
              ].map((opt) => {
                const isSelected = companionTheme === opt.id;
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => handleCompanionThemeSelect(opt.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150 ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div> }
          </div>

          {/* Horizontal Companion Selector Grid }
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Available Companions</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {COMPANIONS.map((companion) => {
                const isSelected = selectedCompanionId === companion.id;
                return (
                  <button
                    type="button"
                    key={companion.id}
                    onClick={() => handleCompanionSelect(companion.id)}
                    className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all duration-200 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-blue-500/20 shadow-2xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl border mb-2 shrink-0 ${companion.avatarBg} ${companion.borderColor}`}>
                      {companion.icon}
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate w-full">{companion.name}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate w-full mt-0.5">{companion.species}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </HorizontalCard> */}

      {/* Row 3 Grid: Notifications */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notifications }
        <HorizontalCard
          icon={Bell}
          className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50 shadow-sm"
          title="Notification Preferences"
          description="Choose which event alerts you receive."
        >
          <div className="divide-y divide-slate-100">
            <Toggle
              checked={notifs.taskCreated}
              onChange={(v) => setNotifs((n) => ({ ...n, taskCreated: v }))}
              label="Task Created"
              description="Notifications when a task is added"
            />
            <Toggle
              checked={notifs.taskDue}
              onChange={(v) => setNotifs((n) => ({ ...n, taskDue: v }))}
              label="Task Due Reminders"
              description="Alerts 24h prior to deadline"
            />
            <Toggle
              checked={notifs.taskCompleted}
              onChange={(v) => setNotifs((n) => ({ ...n, taskCompleted: v }))}
              label="Task Completed"
              description="Updates when a task is finished"
            />
            <Toggle
              checked={notifs.weeklyDigest}
              onChange={(v) => setNotifs((n) => ({ ...n, weeklyDigest: v }))}
              label="Weekly Digest"
              description="Summary sent every Monday"
            />
          </div>
        </HorizontalCard>
      </div> */}

      {/* Row 4: Full-Width Horizontal Block for Danger Zone */}
      <div className="bg-gradient-to-br from-red-50 via-white to-rose-50 border border-red-200 rounded-2xl p-5 sm:p-6 shadow-sm transition-all duration-200 hover:shadow-sm">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-red-200/60 dark:border-red-900/40">
          <div className="p-2 bg-red-100 rounded-xl border border-red-200 shadow-2xs text-red-600">
            <ShieldAlert size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-red-700">Danger Zone</h2>
            <p className="text-xs text-red-500">Irreversible account actions and session management.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
          // className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-red-200/60 dark:border-red-900/40"
          className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-red-100 hover:border-red-200 transition-all duration-200 shadow-sm hover:shadow-md">
            <div>
              <p className="text-sm font-semibold text-slate-900">Sign Out</p>
              <p className="text-xs text-slate-500">Securely end your current session</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={<LogOut size={14} />}
              onClick={() => navigate('/login')}
            >
              Sign Out
            </Button>
          </div>

          <div 
          // className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-red-200/60 dark:border-red-900/40"
          className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-red-100 hover:border-red-200 transition-all duration-200 shadow-sm hover:shadow-md">
            <div>
              <p className="text-sm font-semibold text-red-700">Delete Account</p>
              <p className="text-xs text-red-500">Permanently erase account & data</p>
            </div>
            <Button
              variant="danger"
              size="sm"
              icon={<AlertTriangle size={14} />}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      {/* Unsaved Changes Banner */}
      <AnimatePresence>
        {isDirty && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 dark:bg-slate-800 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-800 dark:border-slate-700 flex items-center gap-4 text-xs sm:text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-medium">You have unsaved changes</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleSaveSettings}
                disabled={isSavingProfile}
                icon={<Save size={13} />}
              >
                Save Changes (Ctrl + S)
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Account Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        description="This will permanently delete your account, all tasks, and categories. This action cannot be undone."
        confirmLabel="Yes, Delete My Account"
        cancelLabel="Keep Account"
      />
    </motion.div>
  );
}
