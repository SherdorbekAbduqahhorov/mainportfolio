import { useState, type FormEvent } from 'react';
import { ArrowLeft, Lock, LogIn, UserPlus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { fetchIsOwner } from '@/lib/content';
import { navigate } from '@/hooks/useRoute';
import { Field, inputClass } from '@/components/ui/Field';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

type Mode = 'signin' | 'signup';

function friendlyAuthError(error: unknown): string {
  const message = error instanceof Error ? error.message : '';
  if (message.includes('Invalid login credentials')) {
    return 'Email or password is incorrect. If this account does not exist yet, choose Create account.';
  }
  if (message.includes('already registered')) {
    return 'An account with this email already exists. Choose Sign in instead.';
  }
  if (message.includes('does not have access')) {
    return 'This account does not have access to the profile page.';
  }
  return 'Something went wrong. Please try again.';
}

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const isSignUp = mode === 'signup';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setSubmitting(true);

    const credentials = { email: email.trim(), password };
    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp(credentials);
        if (signUpError) throw signUpError;
        if (!data.session) {
          setNotice('Account created. Switch to Sign in to continue.');
          setMode('signin');
          return;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword(credentials);
        if (signInError) throw signInError;
      }

      const owner = await fetchIsOwner();
      if (!owner) {
        await supabase.auth.signOut();
        throw new Error('This account does not have access to the profile.');
      }
      navigate('/profile');
    } catch (submitError) {
      console.error(submitError);
      setError(friendlyAuthError(submitError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-16">
      <div className="hero-grid pointer-events-none absolute inset-0 -z-10" />
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="absolute left-5 right-5 top-5 flex items-center justify-between sm:left-8 sm:right-8">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to portfolio
        </button>
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md animate-fade-up rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-xl sm:p-10 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/40">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-600/30">
          <Lock className="h-5 w-5" />
        </span>

        <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {isSignUp ? 'Use the owner email to set up your profile access.' : 'Sign in to manage your portfolio.'}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <Field label="Email">
            <input
              className={inputClass}
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </Field>
          <Field label="Password" hint={isSignUp ? 'At least 6 characters.' : undefined}>
            <input
              className={inputClass}
              type="password"
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your password"
            />
          </Field>

          {error && <Alert tone="error">{error}</Alert>}
          {notice && <Alert tone="success">{notice}</Alert>}

          <Button type="submit" disabled={submitting} className="w-full">
            {isSignUp ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
            {submitting ? 'Please wait...' : isSignUp ? 'Create account' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          {isSignUp ? 'Already have an account?' : 'First time here?'}{' '}
          <button
            type="button"
            onClick={() => {
              setError(null);
              setNotice(null);
              setMode(isSignUp ? 'signin' : 'signup');
            }}
            className="font-medium text-blue-600 transition hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {isSignUp ? 'Sign in' : 'Create account'}
          </button>
        </p>
      </div>
    </div>
  );
}
