import { useState } from 'react';
import { ExternalLink, FolderPlus, Pencil, Trash2, Code2 } from 'lucide-react';
import type { Project } from '@/lib/types';
import { deleteProject, fetchProjects } from '@/lib/content';
import { isSafeUrl } from '@/lib/format';
import { useAsyncData } from '@/hooks/useAsyncData';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { ErrorState, LoadingState } from '@/components/ui/StatePanel';
import ProjectFormModal from '@/components/profile/ProjectFormModal';

function ProjectRow({
  project,
  confirming,
  onEdit,
  onAskDelete,
  onCancelDelete,
  onConfirmDelete,
  deleting,
}: {
  project: Project;
  confirming: boolean;
  onEdit: () => void;
  onAskDelete: () => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
  deleting: boolean;
}) {
  const liveUrl = isSafeUrl(project.live_url) ? project.live_url : '';

  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition duration-200 hover:border-slate-300 hover:shadow-md sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-500/20 dark:to-cyan-500/10">
        {isSafeUrl(project.image_url) ? (
          <img src={project.image_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <Code2 className="h-6 w-6 text-blue-600/60 dark:text-blue-400/70" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-bold text-slate-900 dark:text-white">{project.title}</h3>
          {project.tag && (
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
              {project.tag}
            </span>
          )}
        </div>
        {project.description && (
          <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{project.description}</p>
        )}
      </div>

      {confirming ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600 dark:text-slate-300">Delete this project?</span>
          <Button variant="danger" className="px-3 py-2" onClick={onConfirmDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
          <Button variant="ghost" className="px-3 py-2" onClick={onCancelDelete} disabled={deleting}>
            Cancel
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${project.title}`}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          <button
            type="button"
            onClick={onEdit}
            aria-label={`Edit ${project.title}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onAskDelete}
            aria-label={`Delete ${project.title}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}
    </li>
  );
}

export default function ProjectsManager() {
  const { state, reload } = useAsyncData(fetchProjects);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditing(project);
    setFormOpen(true);
  };

  async function handleDelete(id: string) {
    setDeletingId(id);
    setActionError(null);
    try {
      await deleteProject(id);
      setConfirmingId(null);
      await reload();
    } catch (error) {
      console.error(error);
      setActionError('The project could not be deleted. Please try again.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Projects</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Add, edit or remove the work shown on your portfolio.</p>
        </div>
        <Button onClick={openCreate} className="sm:shrink-0">
          <FolderPlus className="h-4 w-4" />
          Add project
        </Button>
      </div>

      {actionError && <Alert tone="error">{actionError}</Alert>}

      {state.status === 'loading' && <LoadingState label="Loading projects" />}
      {state.status === 'error' && <ErrorState message="Projects could not be loaded." onRetry={reload} />}
      {state.status === 'ready' && state.data.length === 0 && (
        <p className="rounded-3xl border border-dashed border-slate-300 p-12 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No projects yet. Add your first one to show it on the portfolio.
        </p>
      )}
      {state.status === 'ready' && state.data.length > 0 && (
        <ul className="space-y-3">
          {state.data.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              confirming={confirmingId === project.id}
              deleting={deletingId === project.id}
              onEdit={() => openEdit(project)}
              onAskDelete={() => setConfirmingId(project.id)}
              onCancelDelete={() => setConfirmingId(null)}
              onConfirmDelete={() => handleDelete(project.id)}
            />
          ))}
        </ul>
      )}

      {formOpen && (
        <ProjectFormModal
          project={editing}
          onClose={() => setFormOpen(false)}
          onSaved={reload}
        />
      )}
    </div>
  );
}
