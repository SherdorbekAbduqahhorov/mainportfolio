import { useState, type FormEvent } from 'react';
import type { ProjectInput } from '@/lib/types';
import { createProject, updateProject } from '@/lib/content';
import { isSafeUrl } from '@/lib/format';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Field, inputClass } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import ImageUploadField from '@/components/profile/ImageUploadField';
import type { Project } from '@/lib/types';

type ProjectFormModalProps = {
  project: Project | null;
  onClose: () => void;
  onSaved: () => void;
};

function toInput(project: Project | null): ProjectInput {
  return {
    title: project?.title ?? '',
    description: project?.description ?? '',
    tag: project?.tag ?? '',
    live_url: project?.live_url ?? '',
    repo_url: project?.repo_url ?? '',
    image_url: project?.image_url ?? '',
  };
}

function validate(input: ProjectInput): string | null {
  if (!input.title.trim()) return 'Please enter a project title.';
  if (input.description.length > 1000) return 'The description is too long (1000 characters max).';
  const links = [input.live_url, input.repo_url, input.image_url];
  if (links.some((link) => link && !isSafeUrl(link))) return 'Links must start with https://';
  return null;
}

export default function ProjectFormModal({ project, onClose, onSaved }: ProjectFormModalProps) {
  const [form, setForm] = useState<ProjectInput>(() => toInput(project));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setField = (key: keyof ProjectInput) => (event: { target: { value: string } }) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleaned: ProjectInput = {
      title: form.title.trim(),
      description: form.description.trim(),
      tag: form.tag.trim(),
      live_url: form.live_url.trim(),
      repo_url: form.repo_url.trim(),
      image_url: form.image_url.trim(),
    };
    const validationError = validate(cleaned);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (project) {
        await updateProject(project.id, cleaned);
      } else {
        await createProject(cleaned);
      }
      onSaved();
      onClose();
    } catch (saveError) {
      console.error(saveError);
      setError('This project could not be saved. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={project ? 'Edit project' : 'Add a project'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Project title">
          <input className={inputClass} value={form.title} onChange={setField('title')} maxLength={120} placeholder="Blogify" />
        </Field>
        <Field label="Category tag">
          <input className={inputClass} value={form.tag} onChange={setField('tag')} maxLength={40} placeholder="Website" />
        </Field>
        <ImageUploadField
          label="Cover image"
          hint="Optional cover photo shown on the project card."
          value={form.image_url}
          folder="projects"
          onChange={(url) => setForm((current) => ({ ...current, image_url: url }))}
        />
        <Field label="Description">
          <textarea className={`${inputClass} min-h-[110px] resize-y`} value={form.description} onChange={setField('description')} maxLength={1000} placeholder="What does this project do?" />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Live link">
            <input className={inputClass} type="url" value={form.live_url} onChange={setField('live_url')} placeholder="https://..." />
          </Field>
          <Field label="Source code link">
            <input className={inputClass} type="url" value={form.repo_url} onChange={setField('repo_url')} placeholder="https://github.com/..." />
          </Field>
        </div>

        {error && <Alert tone="error">{error}</Alert>}

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : project ? 'Save changes' : 'Add project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
