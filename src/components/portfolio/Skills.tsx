import { useEffect, useRef, useState } from 'react';
import type { Skill } from '@/lib/types';
import { getSkillIcon } from '@/lib/skillIcons';
import { Reveal } from '@/components/ui/Reveal';

type SkillsProps = {
  skills: Skill[];
};

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  const Icon = getSkillIcon(skill.icon);
  const ref = useRef<HTMLDivElement>(null);
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setFilled(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFilled(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const level = Math.min(100, Math.max(0, skill.level));

  return (
    <div
      ref={ref}
      className="group rounded-3xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/40"
      style={{ transitionDelay: `${index * 40}ms` }}
    >
      <div className="flex items-center justify-between">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition duration-300 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-500/10 dark:text-blue-400 dark:group-hover:bg-blue-500 dark:group-hover:text-white">
          <Icon className="h-6 w-6" />
        </span>
        <span className="text-sm font-bold tabular-nums text-slate-700 dark:text-slate-200">{level}%</span>
      </div>

      <p className="mt-5 text-base font-bold text-slate-900 dark:text-white">{skill.name}</p>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-[width] duration-[1200ms] ease-out dark:from-blue-500 dark:to-cyan-300"
          style={{ width: filled ? `${level}%` : '0%', transitionDelay: `${index * 60}ms` }}
        />
      </div>
    </div>
  );
}

export default function Skills({ skills }: SkillsProps) {
  return (
    <section id="skills" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24">
      <Reveal>
        <p className="eyebrow">Toolkit</p>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">My Skills</h2>
      </Reveal>

      {skills.length === 0 ? (
        <p className="mt-12 rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
          Skills will appear here soon.
        </p>
      ) : (
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill, index) => (
            <SkillCard key={skill.id} skill={skill} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}
