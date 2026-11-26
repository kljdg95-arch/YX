import { useState, type FormEvent } from 'react';
import { Send, Check, AlertCircle } from 'lucide-react';
import useSeo from '@/hooks/useSeo';
import useReveal from '@/hooks/useReveal';
import PageHeader from '@/components/PageHeader';
import { supabase } from '@/lib/supabase';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

interface FieldErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: { name: string; email: string; subject: string; message: string }): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.name.trim()) errors.name = 'Please enter your name.';
  else if (values.name.length > 120) errors.name = 'Name must be under 120 characters.';
  if (!values.email.trim()) errors.email = 'Please enter your email address.';
  else if (!EMAIL_RE.test(values.email)) errors.email = 'Please enter a valid email address.';
  if (!values.subject.trim()) errors.subject = 'Please enter a subject.';
  else if (values.subject.length > 200) errors.subject = 'Subject must be under 200 characters.';
  if (!values.message.trim()) errors.message = 'Please enter a message.';
  else if (values.message.length > 5000) errors.message = 'Message must be under 5000 characters.';
  return errors;
}

const inputClass =
  'w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-[var(--ink)] placeholder:text-muted transition-colors duration-300 focus:border-[var(--accent)] focus:outline-none';

export default function Contact() {
  useSeo({
    title: 'Contact',
    description:
      'Get in touch with YX. Send a message about projects, research, collaboration, or anything else.',
    path: '/contact',
  });

  const ref = useReveal<HTMLElement>();
  const [values, setValues] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [state, setState] = useState<FormState>('idle');

  const set = (field: keyof typeof values) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: undefined }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const fieldErrors = validate(values);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setState('submitting');
    const { error } = await supabase.from('contact_messages').insert({
      name: values.name.trim(),
      email: values.email.trim(),
      subject: values.subject.trim(),
      message: values.message.trim(),
    });
    if (error) {
      setState('error');
      return;
    }
    setState('success');
    setValues({ name: '', email: '', subject: '', message: '' });
  }

  return (
    <>
      <PageHeader
        label="Contact"
        title="Start a conversation."
        lead="Whether it is a project, a research idea, a collaboration, or a question — messages sent here reach YX directly."
      />

      <section ref={ref} className="reveal py-20 md:py-28">
        <div className="container-yx max-w-2xl">
          {state === 'success' ? (
            <div className="flex flex-col items-center gap-5 rounded-2xl border border-line bg-surface px-8 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--accent)] text-accent">
                <Check size={22} />
              </div>
              <h2 className="text-xl font-semibold tracking-tight">Message received.</h2>
              <p className="max-w-sm text-sm leading-relaxed text-muted">
                Thank you for reaching out. Your message has been delivered and will be read.
              </p>
              <button onClick={() => setState('idle')} className="btn-ghost mt-2">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={values.name}
                    onChange={set('name')}
                    placeholder="Your name"
                    aria-invalid={!!errors.name}
                    className={inputClass}
                  />
                  {errors.name && <p className="mt-2 text-xs text-red-500">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={values.email}
                    onChange={set('email')}
                    placeholder="you@example.com"
                    aria-invalid={!!errors.email}
                    className={inputClass}
                  />
                  {errors.email && <p className="mt-2 text-xs text-red-500">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="mb-2 block text-sm font-medium">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  value={values.subject}
                  onChange={set('subject')}
                  placeholder="What is this about?"
                  aria-invalid={!!errors.subject}
                  className={inputClass}
                />
                {errors.subject && <p className="mt-2 text-xs text-red-500">{errors.subject}</p>}
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  value={values.message}
                  onChange={set('message')}
                  placeholder="Tell us more…"
                  rows={6}
                  aria-invalid={!!errors.message}
                  className={`${inputClass} resize-y`}
                />
                {errors.message && <p className="mt-2 text-xs text-red-500">{errors.message}</p>}
              </div>

              {state === 'error' && (
                <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-500">
                  <AlertCircle size={16} />
                  Something went wrong while sending your message. Please try again.
                </div>
              )}

              <button
                type="submit"
                disabled={state === 'submitting'}
                className="btn-primary self-start disabled:cursor-not-allowed disabled:opacity-60"
              >
                {state === 'submitting' ? 'Sending…' : 'Send message'}
                <Send size={15} />
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
