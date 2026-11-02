import { useState } from 'react';
import { LogOut, Mail, Sparkles, User, FolderOpen, Home, type LucideIcon } from 'lucide-react';
import { navigate } from '@/hooks/useRoute';
import { initials } from '@/lib/format';
import { useAuth } from '@/contexts/AuthContext';
import ProfileInfoEditor from '@/components/profile/ProfileInfoEditor';
import ProjectsManager from '@/components/profile/ProjectsManager';
import SkillsManager from '@/components/profile/SkillsManager';
import MessagesInbox from '@/components/profile/MessagesInbox';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

type Tab = 'overview' | 'projects' | 'skills' | 'messages';

const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: 'overview', label: 'Profile', icon: User },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'skills', label: 'Skills', icon: Sparkles },
  { id: 'messages', label: 'Messages', icon: Mail },
];

type ProfileDashboardProps = {
  onSignOut: () => Promise<void>;
};

export default function ProfileDashboard({ onSignOut }: ProfileDashboardProps) {
  const { session } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');
  const email = session?.user.email ?? '';

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-sm font-bold text-white">
              {initials(email || 'Owner')}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-white">Profile dashboard</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => navigate('/')}>
              <Home className="h-4 w-4" />
              View site
            </Button>
            <ThemeToggle />
            <Button variant="secondary" onClick={() => onSignOut()}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>

        <div className="mx-auto max-w-6xl overflow-x-auto px-5 sm:px-8">
          <div role="tablist" className="flex gap-2 pb-3">
            {TABS.map((item) => {
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  onClick={() => setTab(item.id)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition duration-200 ${
                    active
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 dark:bg-blue-500'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <div key={tab} className="animate-fade-up">
          {tab === 'overview' && <ProfileInfoEditor />}
          {tab === 'projects' && <ProjectsManager />}
          {tab === 'skills' && <SkillsManager />}
          {tab === 'messages' && <MessagesInbox />}
        </div>
      </main>
    </div>
  );
}
