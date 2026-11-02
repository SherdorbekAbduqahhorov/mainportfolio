import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import type { Skill } from '@/lib/types';
import { deleteSkill, fetchSkills } from '@/lib/content';
import { getSkillIcon } from '@/lib/skillIcons';
import { useAsyncData } from '@/hooks/useAsyncData';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { ErrorState, LoadingState } from '@/components/ui/StatePanel';
import SkillFormModal from '@/components/profile/SkillFormModal';

export default function SkillsManager() {
  const { state, reload } = useAsyncData(fetchSkills);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (skill: Skill) => {
    setEditing(skill);
    setFormOpen(true);
  };

  async function handleDelete(id: string) {
    setDeletingId(id);
    setActionError(null);
    try {
      await deleteSkill(id);
      setConfirmingId(null);
      await reload();
    } catch (error) {
      console.error(error);
      setActionError('The skill could not be deleted. Please try again.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Skills</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage the skills and proficiency levels shown on your portfolio.</p>
        </div>
        <Button onClick={openCreate} className="sm:shrink-0">
          <Plus className="h-4 w-4" />
          Add skill
        </Button>
      </div>

      {actionError && <Alert tone="error">{actionError}</Alert>}

      {state.status === 'loading' && <LoadingState label="Loading skills" />}
      {state.status === 'error' && <ErrorState message="Skills could not be loaded." onRetry={reload} />}
      {state.status === 'ready' && state.data.length === 0 && (
        <p className="rounded-3xl border border-dashed border-slate-300 p-12 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No skills yet. Add your first one to show it on the portfolio.
        </p>
      )}
      {state.status === 'ready' && state.data.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2">
          {state.data.map((skill) => {
            const Icon = getSkillIcon(skill.icon);
            const confirming = confirmingId === skill.id;
            const deleting = deletingId === skill.id;
            return (
              <li
                key={skill.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-slate-900 dark:text-white">{skill.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{skill.level}% proficiency</p>
                  </div>
                  {!confirming && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(skill)}
                        aria-label={`Edit ${skill.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmingId(skill.id)}
                        aria-label={`Delete ${skill.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" style={{ width: `${skill.level}%` }} />
                </div>

                {confirming && (
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm text-slate-600 dark:text-slate-300">Delete this skill?</span>
                    <div className="flex gap-2">
                      <Button variant="danger" className="px-3 py-2" onClick={() => handleDelete(skill.id)} disabled={deleting}>
                        {deleting ? 'Deleting...' : 'Delete'}
                      </Button>
                      <Button variant="ghost" className="px-3 py-2" onClick={() => setConfirmingId(null)} disabled={deleting}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {formOpen && (
        <SkillFormModal skill={editing} onClose={() => setFormOpen(false)} onSaved={reload} />
      )}
    </div>
  );
}
