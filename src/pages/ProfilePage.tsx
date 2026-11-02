import { LogOut, ShieldAlert } from 'lucide-react';
import type { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { navigate } from '@/hooks/useRoute';
import ProfileDashboard from '@/components/profile/ProfileDashboard';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/StatePanel';

function AccessMessage({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-md animate-fade-up rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <ShieldAlert className="h-7 w-7" />
        </span>
        <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">{children}</div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { session, isOwner, loading, signOut } = useAuth();

  if (loading) return <LoadingState label="Checking access" />;

  if (!session) {
    return (
      <AccessMessage title="Sign in required" description="Please sign in to open your profile.">
        <Button onClick={() => navigate('/login')}>Go to sign in</Button>
        <Button variant="ghost" onClick={() => navigate('/')}>Back to portfolio</Button>
      </AccessMessage>
    );
  }

  if (!isOwner) {
    return (
      <AccessMessage title="No access" description="This account is not allowed to edit the portfolio.">
        <Button variant="secondary" onClick={() => signOut()}>
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
        <Button variant="ghost" onClick={() => navigate('/')}>Back to portfolio</Button>
      </AccessMessage>
    );
  }

  return <ProfileDashboard onSignOut={signOut} />;
}
