import { GraduationCap, Languages, Code2, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Profile } from '@/lib/types';
import { Reveal } from '@/components/ui/Reveal';

type AboutProps = {
  profile: Profile;
};

function InfoRow({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-1 text-base font-medium text-slate-900 dark:text-slate-100">{children}</p>
      </div>
    </div>
  );
}

export default function About({ profile }: AboutProps) {
  const paragraphs = profile.about_paragraphs;

  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24">
      <Reveal>
        <p className="eyebrow">About me</p>
      </Reveal>

      <div className="mt-6 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <Reveal>
          <h2 className="text-3xl font-bold leading-[1.2] tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            {profile.about_title}
            {profile.ielts_score && (
              <span className="ml-3 inline-flex translate-y-[-4px] items-center rounded-full bg-blue-50 px-3 py-1 align-middle text-sm font-medium text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                IELTS {profile.ielts_score}
              </span>
            )}
          </h2>
          <div className="mt-8 space-y-5">
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-base leading-[1.5] text-slate-600 dark:text-slate-300">
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={150}>
          <aside className="space-y-4">
            <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">What drives me</h3>
            {profile.languages && (
              <InfoRow icon={Code2} label="Languages">
                {profile.languages}
              </InfoRow>
            )}
            {profile.education && (
              <InfoRow icon={GraduationCap} label="Education">
                {profile.education}
              </InfoRow>
            )}
            {profile.ielts_score && (
              <InfoRow icon={Languages} label="English proficiency">
                IELTS {profile.ielts_score}
              </InfoRow>
            )}
          </aside>
        </Reveal>
      </div>
    </section>
  );
}
