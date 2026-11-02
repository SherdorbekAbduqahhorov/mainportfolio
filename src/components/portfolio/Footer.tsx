import { Code2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:px-8 dark:text-slate-400">
        <p className="inline-flex items-center gap-2">
          <Code2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          Built with passion • Frontend Developer
        </p>
        <p>© {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </footer>
  );
}
