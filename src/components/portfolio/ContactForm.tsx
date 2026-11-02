import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Send } from 'lucide-react';
import { sendMessage } from '@/lib/content';
import { Field, inputClass } from '@/components/ui/Field';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormValues = { name: string; email: string; message: string };

const EMPTY_VALUES: FormValues = { name: '', email: '', message: '' };

function validate(values: FormValues): string | null {
  if (!values.name.trim()) return 'Please enter your name.';
  if (!EMAIL_PATTERN.test(values.email.trim())) return 'Please enter a valid email address.';
  if (!values.message.trim()) return 'Please write a message.';
  if (values.name.trim().length > 100) return 'Your name is too long.';
  if (values.message.trim().length > 2000) return 'Your message is too long (2000 characters max).';
  return null;
}

export default function ContactForm() {
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const update = (field: keyof FormValues) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validate(values);
    if (validationError) {
      setError(validationError);
      setStatus('error');
      return;
    }

    setStatus('sending');
    setError(null);
    try {
      await sendMessage({
        name: values.name.trim(),
        email: values.email.trim(),
        message: values.message.trim(),
      });
      setValues(EMPTY_VALUES);
      setStatus('sent');
    } catch (sendError) {
      console.error(sendError);
      setError('Your message could not be sent. Please try again.');
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="min-w-0 space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5 sm:p-8 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name">
          <input className={inputClass} value={values.name} onChange={update('name')} placeholder="Jane Doe" maxLength={100} autoComplete="name" />
        </Field>
        <Field label="Your email">
          <input className={inputClass} type="email" value={values.email} onChange={update('email')} placeholder="you@example.com" maxLength={200} autoComplete="email" />
        </Field>
      </div>
      <Field label="Message">
        <textarea className={`${inputClass} min-h-[140px] resize-y`} value={values.message} onChange={update('message')} placeholder="Tell me about your project or idea..." maxLength={2000} />
      </Field>

      {status === 'error' && error && <Alert tone="error">{error}</Alert>}
      {status === 'sent' && <Alert tone="success">Thanks, your message was sent. I will get back to you soon.</Alert>}

      <Button type="submit" disabled={status === 'sending'} className="w-full sm:w-auto">
        <Send className="h-4 w-4" />
        {status === 'sending' ? 'Sending...' : 'Send message'}
      </Button>
    </form>
  );
}
