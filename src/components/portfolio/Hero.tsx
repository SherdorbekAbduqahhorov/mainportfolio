import { ArrowRight, Github, Instagram, MapPin, Send } from 'lucide-react';
import type { Profile } from '@/lib/types';
import { handleFromUrl, initials, isSafeUrl, splitList } from '@/lib/format';
import { buttonClasses } from '@/components/ui/Button';

type HeroProps = {
  profile: Profile;
};

export default function Hero({ profile }: HeroProps) {
  const technologies = splitList(profile.languages);
  const socials = [
    { href: profile.instagram_url, label: 'Instagram', icon: Instagram },
    { href: profile.telegram_url, label: 'Telegram', icon: Send },
    { href: profile.github_url, label: 'GitHub', icon: Github },
  ].filter((item) => isSafeUrl(item.href));

  return (
    <section id="top" className="relative overflow-hidden pb-20 pt-28 sm:pb-24 sm:pt-40">
      <div className="hero-grid pointer-events-none absolute inset-0 -z-10" />
      <div className="pointer-events-none absolute left-1/2 top-16 -z-10 h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl dark:bg-blue-500/15" />

      <div className="mx-auto grid max-w-6xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-[1.15fr_1fr]">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {profile.greeting}
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-[1.15] tracking-tight text-slate-900 sm:text-6xl dark:text-white">
            I’m{' '}
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent dark:from-blue-400 dark:via-blue-300 dark:to-cyan-300">
              {profile.name}
            </span>
          </h1>

          <p className="mt-4 text-xl font-medium text-slate-600 dark:text-slate-300">{profile.job_title}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            {profile.location && (
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                {profile.location}
              </span>
            )}
            {profile.available && (
              <span className="inline-flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                Available now
              </span>
            )}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a href="#projects" className={buttonClasses('primary')}>
              View Projects
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#contact" className={buttonClasses('secondary')}>
              Contact Me
            </a>
          </div>

          {socials.length > 0 && (
            <div className="mt-10 flex items-center gap-3">
              {socials.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  title={handleFromUrl(item.href)}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition duration-200 hover:-translate-y-0.5 hover:border-blue-500 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-400 dark:hover:text-blue-400"
                >
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="relative mx-auto w-full max-w-sm animate-fade-up [animation-delay:150ms]">
          <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-blue-500 via-cyan-400 to-emerald-400 opacity-25 blur-2xl" />
          <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-200 shadow-2xl dark:border-slate-800 dark:from-slate-900 dark:to-slate-800">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-7xl font-bold text-slate-400 dark:text-slate-500">
                {initials(profile.name)}
              </div>
            )}
          </div>

          {profile.ielts_score && (
            <div className="absolute -left-2 top-6 animate-float sm:-left-4 sm:top-10 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs text-slate-500 dark:text-slate-400">IELTS score</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{profile.ielts_score}</p>
            </div>
          )}
          {technologies[0] && (
            <div className="absolute -right-2 bottom-6 animate-float sm:-right-4 sm:bottom-12 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl [animation-delay:1.5s] dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs text-slate-500 dark:text-slate-400">Core stack</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{technologies.slice(0, 3).join(' · ')}</p>
            </div>
          )}
        </div>
      </div>

      {technologies.length > 0 && (
        <div className="mt-16 overflow-hidden border-y sm:mt-20 border-slate-200 bg-white/60 py-5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/60">
          <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
            {[...technologies, ...technologies].map((tech, index) => (
              <span key={`${tech}-${index}`} className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
