import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Lock, Moon, Bell, AlertTriangle, LogOut, Save, Eye, EyeOff,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { CURRENT_USER } from '../data/mockData';

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-72 p-6 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm text-slate-600">
              <Icon size={18} />
            </div>
            <h2 className="text-sm font-bold text-slate-900">{title}</h2>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
        </div>
        <div className="flex-1 p-6">{children}</div>
      </div>
    </div>
  );
}

function Toggle({
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
    <div className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0 border-b last:border-0 border-slate-100">
      <div>
        <p className="text-sm font-medium text-slate-800">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none ${checked ? 'bg-blue-600' : 'bg-slate-200'}`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-[18px]' : 'translate-x-[3px]'}`}
        />
      </button>
    </div>
  );
}

export default function Settings() {
  const navigate = useNavigate();

  // Profile state
  const [name, setName]   = useState(CURRENT_USER.name);
  const [email, setEmail] = useState(CURRENT_USER.email);
  const [profileSaved, setProfileSaved] = useState(false);

  // Password state
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw]         = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [pwError, setPwError]     = useState('');
  const [pwSaved, setPwSaved]     = useState(false);

  // Notification prefs
  const [notifs, setNotifs] = useState({
    taskCreated:   true,
    taskDue:       true,
    taskCompleted: false,
    weeklyDigest:  true,
    marketing:     false,
  });

  // Danger zone
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleProfileSave = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handlePasswordSave = () => {
    if (!currentPw) { setPwError('Current password is required'); return; }
    if (newPw.length < 8) { setPwError('New password must be at least 8 characters'); return; }
    if (newPw !== confirmPw) { setPwError('Passwords do not match'); return; }
    setPwError('');
    setPwSaved(true);
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
    setTimeout(() => setPwSaved(false), 2500);
  };

  const handleDeleteAccount = () => {
    setDeleteDialogOpen(false);
    navigate('/login');
  };

  const toggleNotif = (key: keyof typeof notifs) => (v: boolean) =>
    setNotifs((n) => ({ ...n, [key]: v }));

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Profile */}
      <SectionCard icon={User} title="Profile Information" description="Update your display name and email address.">
        <div className="space-y-4 max-w-md">
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className="flex items-center gap-3">
            <Button icon={<Save size={15} />} onClick={handleProfileSave} size="sm">
              Save Changes
            </Button>
            {profileSaved && <span className="text-sm text-emerald-600 font-medium">✓ Saved!</span>}
          </div>
        </div>
      </SectionCard>

      {/* Password */}
      <SectionCard icon={Lock} title="Change Password" description="Ensure your account is using a long, random password to stay secure.">
        <div className="space-y-4 max-w-md">
          <Input
            label="Current Password"
            type={showPw ? 'text' : 'password'}
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
            placeholder="••••••••"
            rightIcon={
              <button onClick={() => setShowPw((v) => !v)} className="text-slate-400 hover:text-slate-600">
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
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
          <div className="flex items-center gap-3">
            <Button icon={<Lock size={15} />} onClick={handlePasswordSave} size="sm">
              Update Password
            </Button>
            {pwSaved && <span className="text-sm text-emerald-600 font-medium">✓ Password updated!</span>}
          </div>
        </div>
      </SectionCard>

      {/* Appearance */}
      <SectionCard icon={Moon} title="Appearance" description="Customize how TaskFlow looks on your device.">
        <div className="max-w-xs">
          <Select
            label="Theme Preference"
            options={[
              { value: 'light',  label: 'Light (Default)' },
              { value: 'dark',   label: 'Dark (Coming Soon)' },
              { value: 'system', label: 'System (Coming Soon)' },
            ]}
            value="light"
            onChange={() => {}}
            hint="Dark mode is coming in the next release."
          />
        </div>
      </SectionCard>

      {/* Notifications */}
      <SectionCard icon={Bell} title="Notification Preferences" description="Choose which notifications you want to receive.">
        <div className="max-w-md divide-y divide-slate-100">
          <Toggle
            checked={notifs.taskCreated}
            onChange={toggleNotif('taskCreated')}
            label="Task Created"
            description="When a new task is added to your workspace"
          />
          <Toggle
            checked={notifs.taskDue}
            onChange={toggleNotif('taskDue')}
            label="Task Due Reminders"
            description="24 hours before a task is due"
          />
          <Toggle
            checked={notifs.taskCompleted}
            onChange={toggleNotif('taskCompleted')}
            label="Task Completed"
            description="When someone completes a task assigned to you"
          />
          <Toggle
            checked={notifs.weeklyDigest}
            onChange={toggleNotif('weeklyDigest')}
            label="Weekly Digest"
            description="A summary of your workspace activity every Monday"
          />
          <Toggle
            checked={notifs.marketing}
            onChange={toggleNotif('marketing')}
            label="Product Updates"
            description="News about TaskFlow features and releases"
          />
        </div>
      </SectionCard>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-72 p-6 border-b md:border-b-0 md:border-r border-red-100 shrink-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white rounded-xl border border-red-200 shadow-sm text-red-600">
                <AlertTriangle size={18} />
              </div>
              <h2 className="text-sm font-bold text-red-900">Danger Zone</h2>
            </div>
            <p className="text-sm text-red-700/80 leading-relaxed">
              Irreversible actions that permanently affect your account.
            </p>
          </div>
          <div className="flex-1 p-6 space-y-4">
            {/* Sign out */}
            <div className="flex items-center justify-between py-3 border-b border-red-100">
              <div>
                <p className="text-sm font-medium text-slate-900">Sign Out</p>
                <p className="text-xs text-slate-500 mt-0.5">Securely sign out of your session</p>
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
            {/* Delete account */}
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-red-700">Delete Account</p>
                <p className="text-xs text-red-600/70 mt-0.5">Permanently delete your account and all data</p>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete account confirm */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        description="This will permanently delete your account, all tasks, and categories. This action cannot be undone."
        confirmLabel="Yes, Delete My Account"
        cancelLabel="Keep Account"
      />
    </div>
  );
}
