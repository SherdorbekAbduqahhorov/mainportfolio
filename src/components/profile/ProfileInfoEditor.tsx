import { useState, type FormEvent } from 'react';
import { Save } from 'lucide-react';
import type { Profile, ProfileInput } from '@/lib/types';
import { fetchProfile, updateProfile } from '@/lib/content';
import { isSafeUrl, paragraphsToText, textToParagraphs } from '@/lib/format';
import { useAsyncData } from '@/hooks/useAsyncData';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Field, inputClass } from '@/components/ui/Field';
import { ErrorState, LoadingState } from '@/components/ui/StatePanel';
import ImageUploadField from '@/components/profile/ImageUploadField';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function toInput(profile: Profile): ProfileInput {
  return {
    name: profile.name,
    greeting: profile.greeting,
    job_title: profile.job_title,
    location: profile.location,
    available: profile.available,
    avatar_url: profile.avatar_url,
    about_title: profile.about_title,
    about_paragraphs: profile.about_paragraphs,
    languages: profile.languages,
    education: profile.education,
    ielts_score: profile.ielts_score,
    email: profile.email,
    phone: profile.phone,
    instagram_url: profile.instagram_url,
    telegram_url: profile.telegram_url,
    github_url: profile.github_url,
  };
}

function validate(input: ProfileInput, paragraphs: string[]): string | null {
  if (!input.name.trim()) return 'Please enter your name.';
  if (!input.job_title.trim()) return 'Please enter your job title.';
  if (!input.about_title.trim()) return 'Please enter a headline for your about section.';
  if (paragraphs.length === 0) return 'Please write at least one paragraph about yourself.';
  if (input.email && !EMAIL_PATTERN.test(input.email.trim())) return 'Please enter a valid contact email.';
  const links = [input.avatar_url, input.instagram_url, input.telegram_url, input.github_url];
  if (links.some((link) => link && !isSafeUrl(link))) return 'Links must start with https://';
  return null;
}

function ProfileForm({ initial }: { initial: Profile }) {
  const [form, setForm] = useState<ProfileInput>(() => toInput(initial));
  const [aboutText, setAboutText] = useState(() => paragraphsToText(initial.about_paragraphs));
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ tone: 'error' | 'success'; message: string } | null>(null);

  const setField = <K extends keyof ProfileInput>(key: K, value: ProfileInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const paragraphs = textToParagraphs(aboutText);
    const validationError = validate(form, paragraphs);
    if (validationError) {
      setResult({ tone: 'error', message: validationError });
      return;
    }

    setSaving(true);
    setResult(null);
    try {
      await updateProfile({ ...form, about_paragraphs: paragraphs });
      setResult({ tone: 'success', message: 'Your profile is saved and live on the portfolio.' });
    } catch (error) {
      console.error(error);
      setResult({ tone: 'error', message: 'Your changes could not be saved. Please try again.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Hero section</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">The first thing visitors see.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name">
            <input className={inputClass} value={form.name} onChange={(e) => setField('name', e.target.value)} />
          </Field>
          <Field label="Greeting">
            <input className={inputClass} value={form.greeting} onChange={(e) => setField('greeting', e.target.value)} />
          </Field>
          <Field label="Job title">
            <input className={inputClass} value={form.job_title} onChange={(e) => setField('job_title', e.target.value)} />
          </Field>
          <Field label="Location">
            <input className={inputClass} value={form.location} onChange={(e) => setField('location', e.target.value)} />
          </Field>
          <ImageUploadField
            label="Profile photo"
            hint="Optional. Leave empty to show your initials."
            value={form.avatar_url}
            folder="profile"
            onChange={(url) => setField('avatar_url', url)}
          />
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-300 px-4 py-2.5 dark:border-slate-700">
            <span>
              <span className="block text-sm font-medium text-slate-700 dark:text-slate-300">Available for work</span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">Shows an &quot;Available now&quot; badge.</span>
            </span>
            <input
              type="checkbox"
              className="h-5 w-5 accent-blue-600"
              checked={form.available}
              onChange={(e) => setField('available', e.target.checked)}
            />
          </label>
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">About section</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Separate paragraphs with a blank line.</p>
        </div>
        <Field label="Headline">
          <input className={inputClass} value={form.about_title} onChange={(e) => setField('about_title', e.target.value)} />
        </Field>
        <Field label="About paragraphs">
          <textarea className={`${inputClass} min-h-[220px] resize-y leading-[1.5]`} value={aboutText} onChange={(e) => setAboutText(e.target.value)} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Languages & tech">
            <input className={inputClass} value={form.languages} onChange={(e) => setField('languages', e.target.value)} placeholder="HTML, CSS, React" />
          </Field>
          <Field label="Education">
            <input className={inputClass} value={form.education} onChange={(e) => setField('education', e.target.value)} />
          </Field>
          <Field label="IELTS score">
            <input className={inputClass} value={form.ielts_score} onChange={(e) => setField('ielts_score', e.target.value)} placeholder="7" />
          </Field>
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Contact details</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Shown in the contact section and social icons.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Email">
            <input className={inputClass} type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} />
          </Field>
          <Field label="Phone">
            <input className={inputClass} value={form.phone} onChange={(e) => setField('phone', e.target.value)} />
          </Field>
          <Field label="Instagram link">
            <input className={inputClass} type="url" value={form.instagram_url} onChange={(e) => setField('instagram_url', e.target.value)} placeholder="https://instagram.com/..." />
          </Field>
          <Field label="Telegram link">
            <input className={inputClass} type="url" value={form.telegram_url} onChange={(e) => setField('telegram_url', e.target.value)} placeholder="https://t.me/..." />
          </Field>
          <Field label="GitHub link">
            <input className={inputClass} type="url" value={form.github_url} onChange={(e) => setField('github_url', e.target.value)} placeholder="https://github.com/..." />
          </Field>
        </div>
      </section>

      <div className="sticky bottom-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900/90">
        <div className="min-w-0 flex-1">
          {result && <Alert tone={result.tone}>{result.message}</Alert>}
        </div>
        <Button type="submit" disabled={saving} className="sm:shrink-0">
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
}

export default function ProfileInfoEditor() {
  const { state, reload } = useAsyncData(fetchProfile);

  if (state.status === 'loading') return <LoadingState label="Loading your profile" />;
  if (state.status === 'error') {
    return <ErrorState message="Your profile could not be loaded." onRetry={reload} />;
  }
  return <ProfileForm initial={state.data} />;
}
