import { Github, Instagram, Mail, Phone, Send } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Profile } from '@/lib/types';
import { handleFromUrl, isSafeUrl } from '@/lib/format';
import { Reveal } from '@/components/ui/Reveal';
import ContactForm from '@/components/portfolio/ContactForm';

type ContactProps = {
  profile: Profile;
};

type ContactLink = {
  label: string;
  value: string;
  href: string;
  icon: LucideIcon;
  external: boolean;
};

function buildLinks(profile: Profile): ContactLink[] {
  const links: ContactLink[] = [];
  if (profile.phone) {
    links.push({ label: 'Phone', value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, '')}`, icon: Phone, external: false });
  }
  if (isSafeUrl(profile.instagram_url)) {
    links.push({ label: 'Instagram', value: `@${handleFromUrl(profile.instagram_url)}`, href: profile.instagram_url, icon: Instagram, external: true });
  }
  if (isSafeUrl(profile.telegram_url)) {
    links.push({ label: 'Telegram', value: `@${handleFromUrl(profile.telegram_url)}`, href: profile.telegram_url, icon: Send, external: true });
  }
  if (profile.email) {
    links.push({ label: 'Email', value: profile.email, href: `mailto:${profile.email}`, icon: Mail, external: false });
  }
  if (isSafeUrl(profile.github_url)) {
    links.push({ label: 'GitHub', value: handleFromUrl(profile.github_url), href: profile.github_url, icon: Github, external: true });
  }
  return links;
}

export default function Contact({ profile }: ContactProps) {
  const links = buildLinks(profile);

  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow">Get in touch</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">Let’s Connect</h2>
          <p className="mt-4 text-base leading-[1.5] text-slate-600 dark:text-slate-300">
            Have a project in mind or just want to say hello? Send a message or reach out directly on any channel below.
          </p>

          <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="group flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg sm:gap-4 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/40"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-500/10 dark:text-blue-400 dark:group-hover:bg-blue-500 dark:group-hover:text-white">
                  <link.icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">{link.label}</span>
                  <span className="mt-0.5 block break-all text-sm font-medium text-slate-900 dark:text-slate-100">{link.value}</span>
                </span>
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={150}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
