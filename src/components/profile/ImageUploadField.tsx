import { useRef, useState, type ChangeEvent } from 'react';
import { ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { uploadImage } from '@/lib/content';
import { inputClass } from '@/components/ui/Field';

const ACCEPTED_TYPES = 'image/jpeg,image/png,image/webp,image/gif';

type ImageUploadFieldProps = {
  label: string;
  hint?: string;
  value: string;
  folder: string;
  onChange: (url: string) => void;
};

export default function ImageUploadField({ label, hint, value, folder, onChange }: ImageUploadFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      onChange(await uploadImage(file, folder));
    } catch (uploadError) {
      console.error(uploadError);
      setError('The image could not be uploaded. Use a JPG, PNG, WebP or GIF under 5 MB.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:col-span-2">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>

      <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-slate-300 p-4 sm:flex-row sm:items-center dark:border-slate-700">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-6 w-6 text-slate-400" />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            {uploading ? 'Uploading...' : value ? 'Replace image' : 'Upload image'}
          </button>
          {value && !uploading && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          )}
          <input ref={fileRef} type="file" accept={ACCEPTED_TYPES} className="hidden" onChange={handleFile} />
        </div>
      </div>

      <input
        className={inputClass}
        type="url"
        aria-label={`${label} link`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="or paste an image link: https://..."
      />

      {error && (
        <p role="alert" className="text-xs font-medium text-rose-600 dark:text-rose-400">
          {error}
        </p>
      )}
      {hint && <span className="text-xs text-slate-500 dark:text-slate-400">{hint}</span>}
    </div>
  );
}
