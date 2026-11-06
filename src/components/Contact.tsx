import { useState, type ReactNode } from 'react';
import { RESUME_URL, profile } from '../content/portfolio';
import { sendContact } from '../lib/contact';
import { ButtonPrimary, SectionTitle, TextLink } from './primitives';

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_FORM: FormState = { name: '', email: '', subject: '', message: '' };

function validate(values: FormState): FieldErrors {
  const errors: FieldErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const subject = values.subject.trim();
  const message = values.message.trim();

  if (!name) {
    errors.name = 'Enter your name.';
  }

  if (!email) {
    errors.email = 'Enter your email.';
  } else if (!EMAIL_RE.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!subject) {
    errors.subject = 'Enter a subject.';
  }

  if (!message) {
    errors.message = 'Enter a message.';
  } else if (message.length < 20) {
    errors.message = 'Write at least 20 characters.';
  }

  return errors;
}

export function Contact() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleChange(field: keyof FormState) {
    return (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target;
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    };
  }

  function handleReset() {
    setForm(EMPTY_FORM);
    setErrors({});
    setSubmitError(null);
    setStatus('idle');
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus('sending');
    setSubmitError(null);

    const result = await sendContact({
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
      company: '',
    });

    if (result.ok) {
      setStatus('success');
    } else {
      setSubmitError(result.error);
      setStatus('error');
    }
  }

  const sending = status === 'sending';

  return (
    <div>
      <p>
        The best way to reach me is email.{' '}
        <TextLink href={`mailto:${profile.email}`}>{profile.email}</TextLink>
      </p>
      <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[var(--text-2)]">
        <TextLink href={profile.github}>GitHub</TextLink>
        <TextLink href={profile.linkedin}>LinkedIn</TextLink>
        <TextLink to={RESUME_URL}>Résumé</TextLink>
      </p>

      <div className="mt-12">
        <SectionTitle>Or send a message</SectionTitle>

        {status === 'success' ? (
          <div className="mt-4" role="status" aria-live="polite">
            <p>Message sent. I&apos;ll reply to {form.email.trim() || 'the address you gave'}.</p>
            <button type="button" onClick={handleReset} className="text-link mt-4 min-h-[44px]">
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-4 flex flex-col gap-6">
            <Field id="contact-name" label="Name" error={errors.name}>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                className="field"
                value={form.name}
                onChange={handleChange('name')}
                disabled={sending}
                aria-invalid={errors.name ? 'true' : undefined}
                aria-describedby={errors.name ? 'contact-name-error' : undefined}
              />
            </Field>

            <Field id="contact-email" label="Email" error={errors.email}>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                className="field"
                value={form.email}
                onChange={handleChange('email')}
                disabled={sending}
                aria-invalid={errors.email ? 'true' : undefined}
                aria-describedby={errors.email ? 'contact-email-error' : undefined}
              />
            </Field>

            <Field id="contact-subject" label="Subject" error={errors.subject}>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                autoComplete="off"
                className="field"
                value={form.subject}
                onChange={handleChange('subject')}
                disabled={sending}
                aria-invalid={errors.subject ? 'true' : undefined}
                aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
              />
            </Field>

            <Field id="contact-message" label="Message" error={errors.message}>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                className="field min-h-[140px] resize-y"
                value={form.message}
                onChange={handleChange('message')}
                disabled={sending}
                aria-invalid={errors.message ? 'true' : undefined}
                aria-describedby={errors.message ? 'contact-message-error' : undefined}
              />
            </Field>

            {status === 'error' && submitError && (
              <div role="alert" className="border-l-2 border-[var(--signal)] pl-3 text-[var(--signal)]">
                <p>{submitError}</p>
                <p className="mt-1">
                  <TextLink href={`mailto:${profile.email}`}>Email me directly</TextLink>
                </p>
              </div>
            )}

            <div>
              <ButtonPrimary type="submit" disabled={sending} className="w-full sm:w-auto">
                {sending ? 'Sending…' : 'Send message'}
              </ButtonPrimary>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[14px] text-[var(--text-2)]">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-[14px] text-[var(--signal)]">
          {error}
        </p>
      )}
    </div>
  );
}
