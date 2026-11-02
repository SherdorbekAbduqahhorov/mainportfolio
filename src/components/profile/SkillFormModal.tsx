import { useState, type FormEvent } from 'react';
import type { SkillInput, Skill } from '@/lib/types';
import { createSkill, updateSkill } from '@/lib/content';
import { SKILL_ICON_KEYS, getSkillIcon } from '@/lib/skillIcons';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Field, inputClass } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';

type SkillFormModalProps = {
  skill: Skill | null;
  onClose: () => void;
  onSaved: () => void;
};

export default function SkillFormModal({ skill, onClose, onSaved }: SkillFormModalProps) {
  const [name, setName] = useState(skill?.name ?? '');
  const [icon, setIcon] = useState(skill?.icon ?? SKILL_ICON_KEYS[0]);
  const [level, setLevel] = useState(skill?.level ?? 80);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input: SkillInput = { name: name.trim(), icon, level };
    if (!input.name) {
      setError('Please enter a skill name.');
      return;
    }
    if (!Number.isInteger(level) || level < 0 || level > 100) {
      setError('Level must be a whole number between 0 and 100.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (skill) {
        await updateSkill(skill.id, input);
      } else {
        await createSkill(input);
      }
      onSaved();
      onClose();
    } catch (saveError) {
      console.error(saveError);
      setError('This skill could not be saved. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={skill ? 'Edit skill' : 'Add a skill'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Field label="Skill name">
          <input className={inputClass} value={name} maxLength={60} onChange={(e) => setName(e.target.value)} placeholder="React.js" />
        </Field>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Icon</span>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {SKILL_ICON_KEYS.map((key) => {
              const Icon = getSkillIcon(key);
              const selected = icon === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setIcon(key)}
                  aria-label={key}
                  aria-pressed={selected}
                  className={`flex h-11 items-center justify-center rounded-xl border transition duration-200 ${
                    selected
                      ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/25 dark:border-blue-500 dark:bg-blue-500'
                      : 'border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </button>
              );
            })}
          </div>
        </div>

        <Field label={`Proficiency: ${level}%`}>
          <input
            type="range"
            min={0}
            max={100}
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </Field>

        {error && <Alert tone="error">{error}</Alert>}

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : skill ? 'Save changes' : 'Add skill'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
