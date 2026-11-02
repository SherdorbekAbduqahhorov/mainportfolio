import { ArrowUpRight, Code2, Github } from 'lucide-react';
import type { Project } from '@/lib/types';
import { isSafeUrl } from '@/lib/format';
import { buttonClasses } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';

type ProjectsProps = {
  projects: Project[];
};

function ProjectCard({ project }: { project: Project }) {
  const liveUrl = isSafeUrl(project.live_url) ? project.live_url : '';
  const repoUrl = isSafeUrl(project.repo_url) ? project.repo_url : '';
  const imageUrl = isSafeUrl(project.image_url) ? project.image_url : '';

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/40">
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-blue-100 via-slate-100 to-cyan-100 dark:from-blue-500/20 dark:via-slate-900 dark:to-cyan-500/10">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Code2 className="h-12 w-12 text-blue-600/50 transition duration-500 group-hover:scale-110 dark:text-blue-400/60" />
          </div>
        )}
        {project.tag && (
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-800 backdrop-blur dark:bg-slate-950/80 dark:text-slate-100">
            {project.tag}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{project.title}</h3>
        {project.description && (
          <p className="mt-2 flex-1 text-sm leading-[1.5] text-slate-600 dark:text-slate-400">{project.description}</p>
        )}

        {(liveUrl || repoUrl) && (
          <div className="mt-6 flex flex-wrap gap-3">
            {liveUrl && (
              <a href={liveUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses('primary', 'px-4 py-2')}>
                View project
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
            {repoUrl && (
              <a href={repoUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses('secondary', 'px-4 py-2')}>
                <Github className="h-4 w-4" />
                Source
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default function Projects({ projects }: ProjectsProps) {
  return (
    <section id="projects" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24">
      <Reveal>
        <p className="eyebrow">Selected work</p>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">My Projects</h2>
      </Reveal>

      {projects.length === 0 ? (
        <p className="mt-12 rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
          Projects will appear here soon.
        </p>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Reveal key={project.id} delay={(index % 3) * 100}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
