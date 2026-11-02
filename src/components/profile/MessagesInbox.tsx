import { useState } from 'react';
import { Mail, MailOpen, Trash2 } from 'lucide-react';
import type { Message } from '@/lib/types';
import { deleteMessage, fetchMessages, setMessageRead } from '@/lib/content';
import { formatDate } from '@/lib/format';
import { useAsyncData } from '@/hooks/useAsyncData';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { ErrorState, LoadingState } from '@/components/ui/StatePanel';

function MessageItem({
  message,
  expanded,
  onToggle,
  onToggleRead,
  onDelete,
  confirmingDelete,
  onAskDelete,
  onCancelDelete,
  busy,
}: {
  message: Message;
  expanded: boolean;
  onToggle: () => void;
  onToggleRead: () => void;
  onDelete: () => void;
  confirmingDelete: boolean;
  onAskDelete: () => void;
  onCancelDelete: () => void;
  busy: boolean;
}) {
  return (
    <li
      className={`rounded-2xl border bg-white transition duration-200 dark:bg-slate-900 ${
        message.is_read ? 'border-slate-200 dark:border-slate-800' : 'border-blue-300 shadow-md shadow-blue-600/5 dark:border-blue-500/40'
      }`}
    >
      <button type="button" onClick={onToggle} className="flex w-full items-start gap-4 p-5 text-left">
        <span
          className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            message.is_read ? 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' : 'bg-blue-600 text-white'
          }`}
        >
          {message.is_read ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">{message.name}</span>
            {!message.is_read && (
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">New</span>
            )}
          </span>
          <span className="block truncate text-sm text-slate-500 dark:text-slate-400">{message.email}</span>
          {!expanded && <span className="mt-2 line-clamp-1 block text-sm text-slate-600 dark:text-slate-300">{message.message}</span>}
        </span>
        <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">{formatDate(message.created_at)}</span>
      </button>

      {expanded && (
        <div className="animate-fade-in space-y-5 border-t border-slate-200 px-5 pb-5 pt-5 dark:border-slate-800">
          <p className="whitespace-pre-line text-sm leading-[1.5] text-slate-700 dark:text-slate-200">{message.message}</p>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`mailto:${message.email}?subject=${encodeURIComponent('Re: your message')}`}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
            >
              <Mail className="h-4 w-4" />
              Reply
            </a>
            <Button variant="secondary" className="px-4 py-2" onClick={onToggleRead} disabled={busy}>
              {message.is_read ? 'Mark as unread' : 'Mark as read'}
            </Button>
            {confirmingDelete ? (
              <div className="flex items-center gap-2">
                <Button variant="danger" className="px-4 py-2" onClick={onDelete} disabled={busy}>
                  {busy ? 'Deleting...' : 'Confirm delete'}
                </Button>
                <Button variant="ghost" className="px-4 py-2" onClick={onCancelDelete} disabled={busy}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button variant="ghost" className="px-4 py-2 text-rose-600 hover:text-rose-500 dark:text-rose-400" onClick={onAskDelete}>
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        </div>
      )}
    </li>
  );
}

export default function MessagesInbox() {
  const { state, reload } = useAsyncData(fetchMessages);
  const [openId, setOpenId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function runAction(id: string, action: () => Promise<void>, failure: string) {
    setBusyId(id);
    setActionError(null);
    try {
      await action();
      await reload();
    } catch (error) {
      console.error(error);
      setActionError(failure);
    } finally {
      setBusyId(null);
    }
  }

  async function handleOpen(message: Message) {
    const nextOpen = openId === message.id ? null : message.id;
    setOpenId(nextOpen);
    setConfirmingId(null);
    if (nextOpen && !message.is_read) {
      await runAction(message.id, () => setMessageRead(message.id, true), 'The message could not be updated.');
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Messages</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Messages sent through the contact form on your portfolio.</p>
      </div>

      {actionError && <Alert tone="error">{actionError}</Alert>}

      {state.status === 'loading' && <LoadingState label="Loading messages" />}
      {state.status === 'error' && <ErrorState message="Messages could not be loaded." onRetry={reload} />}
      {state.status === 'ready' && state.data.length === 0 && (
        <p className="rounded-3xl border border-dashed border-slate-300 p-12 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No messages yet. New messages from your contact form will appear here.
        </p>
      )}
      {state.status === 'ready' && state.data.length > 0 && (
        <ul className="space-y-3">
          {state.data.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              expanded={openId === message.id}
              onToggle={() => handleOpen(message)}
              busy={busyId === message.id}
              onToggleRead={() =>
                runAction(message.id, () => setMessageRead(message.id, !message.is_read), 'The message could not be updated.')
              }
              confirmingDelete={confirmingId === message.id}
              onAskDelete={() => setConfirmingId(message.id)}
              onCancelDelete={() => setConfirmingId(null)}
              onDelete={() =>
                runAction(message.id, () => deleteMessage(message.id), 'The message could not be deleted.')
              }
            />
          ))}
        </ul>
      )}
    </div>
  );
}
