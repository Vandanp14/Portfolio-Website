import { useState, type CSSProperties, type ReactNode } from 'react';
import { profile } from '../content/portfolio';
import { sendContact } from '../lib/contact';
import { SplitLines } from './motion/SplitLines';
import { ButtonPrimary, Shell } from './primitives';

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

// Derived from profile.linkedin / profile.github so the displayed handle
// can never drift from the actual link.
const linkedinHandle = profile.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '').replace(/\/$/, '');
const githubHandle = profile.github.replace(/^https?:\/\/(www\.)?github\.com\//, '').replace(/\/$/, '');

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
    errors.message = 'Say a bit more — at least 20 characters.';
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
    <section
      id="contact"
      data-nav-section
      aria-labelledby="contact-title"
      className="band band-mist relative overflow-hidden py-[var(--section)]"
    >
      <Shell>
        <div className="contact-layout grid gap-[var(--gutter)] lg:grid-cols-2">
          {/* Statement panel */}
          <div
            data-reveal="clip"
            className="contact-statement band band-slate flex flex-col justify-between gap-16 p-[clamp(24px,4vw,56px)] lg:min-h-[640px]"
          >
            <div>
              <div className="flex items-baseline justify-between gap-6">
                <p className="t-eyebrow text-[var(--text-3)]">Contact</p>
                <span className="t-index text-[var(--text-3)]">/0.4</span>
              </div>
              <SplitLines
                as="h2"
                id="contact-title"
                text="Let's build the next system."
                delay={200}
                className="t-display mt-10 block text-[clamp(3rem,6vw,6.25rem)] uppercase text-[var(--text)]"
              />
              <p
                className="reveal mt-8 max-w-[40ch] text-[18px] leading-[1.45] text-[var(--text-2)]"
                style={{ '--reveal-delay': '420ms' } as CSSProperties}
              >
                I read every message myself and reply personally — no ticket queue, no autoresponder. Tell me
                what you&apos;re working on, or just say hello.
              </p>
            </div>

            <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <MetaItem label="Email" delay={500}>
                <a href={`mailto:${profile.email}`} className="link-draw break-all text-[var(--text)]">
                  {profile.email}
                </a>
              </MetaItem>
              <MetaItem label="Location" delay={560}>
                <span className="text-[var(--text)]">{profile.location}</span>
              </MetaItem>
              <MetaItem label="GitHub" delay={620}>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-draw-in inline-flex min-h-[28px] items-center gap-1.5 text-[var(--text)]"
                >
                  {githubHandle}
                  <span className="arrow-nudge" aria-hidden="true">↗</span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </MetaItem>
              <MetaItem label="LinkedIn" delay={680}>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-draw-in inline-flex min-h-[28px] items-center gap-1.5 text-[var(--text)]"
                >
                  {linkedinHandle}
                  <span className="arrow-nudge" aria-hidden="true">↗</span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </MetaItem>
            </dl>
          </div>

          {/* Form panel */}
          <div
            className="contact-form-panel reveal flex flex-col bg-[var(--surface)] p-[clamp(24px,4vw,56px)]"
            style={{ '--reveal-delay': '160ms' } as CSSProperties}
          >
            <div className="flex items-baseline justify-between gap-6 border-t border-[var(--line-strong)] pt-4">
              <p className="t-eyebrow text-[var(--text-3)]">Write to me</p>
              <span className="t-index text-[var(--text-3)]">
                {status === 'success' ? 'SENT' : sending ? 'SENDING' : 'FORM'}
              </span>
            </div>

            {status === 'success' ? (
              <div key="success" className="flex flex-1 flex-col justify-center py-16" aria-live="polite">
                <p className="t-display anim-rise text-[clamp(3rem,6vw,5.5rem)] uppercase text-[var(--text)]">
                  Message sent.
                </p>
                <p
                  className="anim-rise mt-6 max-w-[38ch] text-[18px] leading-[1.45] text-[var(--text-2)]"
                  style={{ '--i': 2 } as CSSProperties}
                >
                  I&apos;ll reply to {form.email.trim() || 'the address you gave'}.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="anim-rise t-eyebrow mt-10 inline-flex min-h-[44px] items-center gap-2 self-start text-[var(--text)]"
                  style={{ '--i': 4 } as CSSProperties}
                >
                  <span className="link-draw">Send another</span>
                  <span className="arrow-nudge-x inline-block transition-transform duration-[var(--t-base)] ease-[var(--ease-out-expo)]" aria-hidden="true">
                    →
                  </span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="mt-10 flex flex-1 flex-col">
                <div className="flex flex-col gap-8">
                  <Field id="contact-name" label="Name" error={errors.name}>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      className="field disabled:cursor-not-allowed disabled:opacity-50"
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
                      className="field disabled:cursor-not-allowed disabled:opacity-50"
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
                      className="field disabled:cursor-not-allowed disabled:opacity-50"
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
                      className="field min-h-[140px] resize-y disabled:cursor-not-allowed disabled:opacity-50"
                      value={form.message}
                      onChange={handleChange('message')}
                      disabled={sending}
                      aria-invalid={errors.message ? 'true' : undefined}
                      aria-describedby={errors.message ? 'contact-message-error' : undefined}
                    />
                  </Field>
                </div>

                {status === 'error' && submitError && (
                  <div
                    role="alert"
                    className="anim-rise mt-8 border-l border-[var(--signal)] pl-3 text-[15px] leading-[1.5] text-[var(--signal)]"
                  >
                    <p>{submitError}</p>
                    <a
                      href={`mailto:${profile.email}`}
                      className="link-draw mt-2 inline-flex min-h-[28px] items-center gap-1.5 text-[var(--text)]"
                    >
                      Email me directly
                      <span className="arrow-nudge" aria-hidden="true">↗</span>
                    </a>
                  </div>
                )}

                <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-12">
                  <p className="t-eyebrow text-[var(--text-3)]">All fields required</p>
                  <ButtonPrimary type="submit" disabled={sending} className="w-full sm:w-auto">
                    {sending ? (
                      'Sending…'
                    ) : (
                      <>
                        Send message
                        <span
                          aria-hidden="true"
                          className="arrow-nudge-x inline-block transition-transform duration-[var(--t-base)] ease-[var(--ease-out-expo)]"
                        >
                          →
                        </span>
                      </>
                    )}
                  </ButtonPrimary>
                </div>
              </form>
            )}
          </div>
        </div>
      </Shell>
    </section>
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
      <label htmlFor={id} className="t-eyebrow block text-[var(--text-3)]">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-[13px] text-[var(--signal)]">
          {error}
        </p>
      )}
    </div>
  );
}

function MetaItem({ label, delay, children }: { label: string; delay: number; children: ReactNode }) {
  return (
    <div
      className="reveal border-l border-[var(--line-strong)] pl-2.5"
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      <dt className="t-eyebrow text-[var(--text-3)]">{label}</dt>
      <dd className="mt-1.5 text-[15px] leading-[1.4]">{children}</dd>
    </div>
  );
}
