import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ListTodo,
  Tags,
  History,
  Settings,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { cn } from '../utils/cn';
// import { CURRENT_USER } from '../data/mockData';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'My Tasks',  path: '/my-tasks',  icon: ListTodo        },
  { name: 'Categories',path: '/categories',icon: Tags                         },
  { name: 'History',   path: '/history',   icon: History                      },
  { name: 'Settings',  path: '/settings',  icon: Settings                     },
];

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onMobileClose: () => void;
}

export default function Sidebar({ collapsed, mobileOpen, onToggle, onMobileClose }: SidebarProps) {
  // const initials = CURRENT_USER.name.split(' ').map((n) => n[0]).join('');

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
            onClick={onMobileClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          'fixed top-0 left-0 h-screen z-50 bg-white border-r border-slate-200',
          'flex flex-col shrink-0 overflow-hidden',
          // Mobile: slide in/out
          'lg:relative lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        style={{ width: collapsed ? 72 : 256 }}
      >
        {/* Logo */}
        <div className="h-[68px] flex items-center px-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-sm">
              <CheckSquare size={18} className="text-white" strokeWidth={2.5} />
            </div>

            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-bold text-xl text-slate-900 whitespace-nowrap overflow-hidden"
                >
                  TaskFlow
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile close button */}
          <button
            onClick={onMobileClose}
            className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Workspace label */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="px-5 pt-5 pb-1">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  Workspace
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <nav className={cn('flex-1 py-3 flex flex-col gap-0.5', collapsed ? 'px-2' : 'px-3')}>
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path}>
              {({ isActive }) => (
                <motion.div
                  whileHover={{ x: collapsed ? 0 : 3 }}
                  transition={{ duration: 0.15 }}
                  className={cn(
                    'relative flex items-center rounded-xl px-3 py-2.5 mb-0.5 transition-colors duration-150 group',
                    collapsed ? 'justify-center' : 'justify-between',
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-blue-600 rounded-r-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}

                  <div className={cn('flex items-center', collapsed ? 'gap-0' : 'gap-3')}>
                    <item.icon
                      size={20}
                      className={cn(
                        'shrink-0',
                        isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'
                      )}
                    />

                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="font-medium text-sm whitespace-nowrap overflow-hidden"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Badge */}
                  {item.badge && !collapsed && (
                    <span className="min-w-[22px] h-[22px] rounded-full bg-blue-600 text-white text-[11px] flex items-center justify-center font-bold shrink-0">
                      {item.badge}
                    </span>
                  )}

                  {/* Collapsed badge dot */}
                  {item.badge && collapsed && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
                  )}
                </motion.div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Profile & collapse */}
        <div className={cn('border-t border-slate-100 py-4 shrink-0', collapsed ? 'px-2' : 'px-4')}>
          {/* Profile */}
          {/* <div className={cn('flex items-center', collapsed ? 'justify-center' : 'gap-3 mb-3')}>
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
              {initials}
            </div>

            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden flex-1 min-w-0"
                >
                  <p className="font-semibold text-slate-900 text-sm truncate">{CURRENT_USER.name}</p>
                  <p className="text-xs text-slate-500 truncate">{CURRENT_USER.email}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div> */}

          {/* Collapse toggle — desktop only */}
          <button
            onClick={onToggle}
            className={cn(
              'hidden lg:flex items-center gap-2 text-slate-500 hover:text-slate-800 text-xs font-medium transition-colors rounded-lg py-1.5 w-full',
              collapsed ? 'justify-center px-2' : 'px-1'
            )}
          >
            {collapsed ? <ChevronRight size={16} /> : (
              <>
                <ChevronLeft size={16} />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </motion.aside>
    </>
  );
}