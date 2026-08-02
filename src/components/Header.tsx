import { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, LogOut, Settings, User } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
// import { SearchInput } from './ui/SearchInput';
// import { Button } from './ui/Button';
import { useClickOutside } from '../hooks/useClickOutside';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onMobileMenuOpen: () => void;
  onNewTask?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/dashboard':  { title: 'Dashboard',        subtitle: 'Overview of your workspace' },
  '/my-tasks':   { title: 'My Tasks',          subtitle: 'Manage and track your tasks' },
  '/categories': { title: 'Categories',        subtitle: 'Organize tasks into categories' },
  '/history':    { title: 'Activity History',  subtitle: 'All changes and updates' },
  '/settings':   { title: 'Settings',          subtitle: 'Manage your account' },
};


export default function Header({ onMobileMenuOpen }: HeaderProps) {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useAuth();
  // const [search, setSearch]           = useState('');
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  useClickOutside(profileRef, () => setProfileOpen(false));

  const pageInfo = PAGE_TITLES[location.pathname] ?? { title: 'TaskFlow', subtitle: '' };
  // Support both fullName (backend) and name (legacy mock)
  const displayName = user?.fullName || user?.name || 'User';
  const initials = displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <header className="h-[68px] bg-white border-b border-slate-200 flex items-center px-6 gap-4 sticky top-0 z-30 shrink-0">
      {/* Mobile hamburger */}
      <button
        onClick={onMobileMenuOpen}
        className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Page title — hidden on very small screens */}
      <div className="hidden sm:block min-w-0">
        <h1 className="text-lg font-semibold text-slate-900 truncate">{pageInfo.title}</h1>
        <p className="text-xs text-slate-500 truncate leading-tight">{pageInfo.subtitle}</p>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      {/* <SearchInput
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onClear={() => setSearch('')}
        className="w-56 lg:w-72"
      /> */}

      {/* Refresh */}
      {/* <button
        onClick={onRefresh}
        className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all duration-200"
        title="Refresh"
      >
        <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
      </button> */}

      {/* Bell */}
      {/* <button
        className="relative p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all duration-200"
        title="Notifications"
      >
        <Bell size={16} />
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
      </button> */}

      {/* New Task */}
      {/* <Button
        onClick={onNewTask}
        icon={<Plus size={16} />}
        size="md"
        className="hidden sm:inline-flex"
      >
        New Task
      </Button> */}

      {/* Profile dropdown */}
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => setProfileOpen((v) => !v)}
          className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl hover:bg-slate-100 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
            {initials}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-slate-800 leading-tight">{displayName}</p>
            <p className="text-xs text-slate-400 leading-tight truncate max-w-[140px]">{user?.email}</p>
          </div>
          <ChevronDown
            size={14}
            className={cn('text-slate-400 transition-transform duration-200', profileOpen && 'rotate-180')}
          />
        </button>

        <AnimatePresence>
          {profileOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden z-50"
            >
              <div className="p-3 border-b border-slate-100">
                <p className="font-semibold text-slate-900 text-sm">{displayName}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
              <div className="p-1.5">
                <DropdownItem icon={<User size={15} />} onClick={() => { navigate('/settings'); setProfileOpen(false); }}>
                  Profile
                </DropdownItem>
                <DropdownItem icon={<Settings size={15} />} onClick={() => { navigate('/settings'); setProfileOpen(false); }}>
                  Settings
                </DropdownItem>
                <div className="my-1 border-t border-slate-100" />
                <DropdownItem icon={<LogOut size={15} />} onClick={logout} danger>
                  Sign out
                </DropdownItem>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

function DropdownItem({
  icon,
  children,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors',
        danger
          ? 'text-red-600 hover:bg-red-50'
          : 'text-slate-700 hover:bg-slate-100'
      )}
    >
      {icon}
      {children}
    </button>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
