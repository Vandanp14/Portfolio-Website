import { useState } from 'react';
import { ArrowUpRight, Check, Loader2, Send } from 'lucide-react';
import { profile } from '../content/portfolio';
import { sendContact } from '../lib/contact';
import { ButtonPrimary, SectionHeading, Shell } from './primitives';

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
  const [company, setCompany] = useState(''); // honeypot
  const [startedAt, setStartedAt] = useState(() => Date.now());
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
    setCompany('');
    setStartedAt(Date.now());
    setErrors({});
    setSubmitError(null);
    setStatus('idle');
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    // Anti-spam: a filled honeypot or a sub-2s submission is almost
    // certainly a bot. Drop it silently and show success anyway, so
    // nothing is ever sent and the bot learns nothing.
    const looksLikeBot = company.trim() !== '' || Date.now() - startedAt < 2000;
    if (looksLikeBot) {
      setStatus('success');
      return;
    }

    setStatus('sending');
    setSubmitError(null);

    const result = await sendContact({
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
      company,
      startedAt,
    });

    if (result.ok) {
      setStatus('success');
    } else {
      setSubmitError(result.error);
      setStatus('error');
    }
  }

  return (
    <section
      id="contact"
      data-nav-section
      aria-labelledby="contact-title"
      className="band band-paper relative overflow-hidden py-[var(--section)]"
    >
      <Shell>
        <div className="grid gap-[clamp(48px,6vw,80px)] lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading
              index="04"
              kicker="Contact"
              title="Tell me what you're building."
              lede="I read every message myself and reply personally — no ticket queue, no autoresponder. Tell me what you're working on, or just say hello."
              id="contact-title"
            />

            <ul
              className="reveal mt-10 divide-y divide-[var(--line)] border-y border-[var(--line)]"
              style={{ '--reveal-delay': '80ms' } as React.CSSProperties}
            >
              <li className="flex items-center justify-between gap-4 py-5">
                <span className="label text-[var(--text-3)]">Email</span>
                <a
                  href={`mailto:${profile.email}`}
                  className="group flex items-center gap-1.5 text-[15px] text-[var(--text)] transition-colors duration-[var(--t-fast)] ease-[var(--ease-out-expo)] hover:text-[var(--accent)]"
                >
                  {profile.email}
                  <ArrowUpRight
                    className="h-4 w-4 shrink-0 transition-transform duration-[var(--t-fast)] ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              </li>
              <li className="flex items-center justify-between gap-4 py-5">
                <span className="label text-[var(--text-3)]">LinkedIn</span>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-1.5 text-[15px] text-[var(--text)] transition-colors duration-[var(--t-fast)] ease-[var(--ease-out-expo)] hover:text-[var(--accent)]"
                >
                  {linkedinHandle}
                  <ArrowUpRight
                    className="h-4 w-4 shrink-0 transition-transform duration-[var(--t-fast)] ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              </li>
              <li className="flex items-center justify-between gap-4 py-5">
                <span className="label text-[var(--text-3)]">GitHub</span>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-1.5 text-[15px] text-[var(--text)] transition-colors duration-[var(--t-fast)] ease-[var(--ease-out-expo)] hover:text-[var(--accent)]"
                >
                  {githubHandle}
                  <ArrowUpRight
                    className="h-4 w-4 shrink-0 transition-transform duration-[var(--t-fast)] ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              </li>
              <li className="flex items-center justify-between gap-4 py-5">
                <span className="label text-[var(--text-3)]">Location</span>
                <span className="text-[15px] text-[var(--text-2)]">{profile.location}</span>
              </li>
            </ul>
          </div>

          {/* --surface is only an 8% chalk wash on cobalt, and a heavy shadow
              reads muddy against a saturated ground — so the panel is held
              together with a stronger border instead of elevation. */}
          <div
            className="reveal rounded-[var(--r-xl)] border border-[var(--line-strong)] bg-[var(--surface)] p-[clamp(20px,3vw,32px)]"
            style={{ '--reveal-delay': '140ms' } as React.CSSProperties}
          >
            {status === 'success' ? (
              <div className="flex flex-col items-center py-6 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-soft)]">
                  <Check className="h-6 w-6 text-[var(--accent)]" aria-hidden="true" />
                </span>
                <h3 className="font-display mt-6 text-[22px] text-[var(--text)]">Message sent.</h3>
                <p className="mt-2 max-w-[34ch] text-[15px] leading-[1.6] text-[var(--text-2)]">
                  I&apos;ll reply to {form.email.trim() || 'the address you gave'}.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="label mt-7 text-[var(--text-2)] underline decoration-[var(--line-strong)] underline-offset-4 transition-colors duration-[var(--t-fast)] ease-[var(--ease-out-expo)] hover:text-[var(--accent)]"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {/* Honeypot — hidden from sighted and screen-reader users,
                    and unreachable by keyboard. A bot that fills this in
                    is dropped silently in handleSubmit. */}
                <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
                  <input
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    value={company}
                    onChange={(event) => setCompany(event.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-5">
                  <div>
                    <label htmlFor="contact-name" className="label text-[var(--text-2)]">
                      Name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      className="field mt-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={form.name}
                      onChange={handleChange('name')}
                      disabled={status === 'sending'}
                      aria-invalid={errors.name ? 'true' : undefined}
                      aria-describedby={errors.name ? 'contact-name-error' : undefined}
                    />
                    {errors.name && (
                      <p id="contact-name-error" role="alert" className="mt-1.5 text-[13px] text-[var(--signal)]">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="label text-[var(--text-2)]">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="field mt-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={form.email}
                      onChange={handleChange('email')}
                      disabled={status === 'sending'}
                      aria-invalid={errors.email ? 'true' : undefined}
                      aria-describedby={errors.email ? 'contact-email-error' : undefined}
                    />
                    {errors.email && (
                      <p id="contact-email-error" role="alert" className="mt-1.5 text-[13px] text-[var(--signal)]">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="label text-[var(--text-2)]">
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      autoComplete="off"
                      className="field mt-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={form.subject}
                      onChange={handleChange('subject')}
                      disabled={status === 'sending'}
                      aria-invalid={errors.subject ? 'true' : undefined}
                      aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                    />
                    {errors.subject && (
                      <p id="contact-subject-error" role="alert" className="mt-1.5 text-[13px] text-[var(--signal)]">
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="label text-[var(--text-2)]">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      className="field mt-2 min-h-[140px] resize-y disabled:cursor-not-allowed disabled:opacity-50"
                      value={form.message}
                      onChange={handleChange('message')}
                      disabled={status === 'sending'}
                      aria-invalid={errors.message ? 'true' : undefined}
                      aria-describedby={errors.message ? 'contact-message-error' : undefined}
                    />
                    {errors.message && (
                      <p id="contact-message-error" role="alert" className="mt-1.5 text-[13px] text-[var(--signal)]">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {status === 'error' && submitError && (
                    <div
                      role="alert"
                      className="rounded-[var(--r-md)] border border-[var(--line)] bg-[color-mix(in_srgb,var(--signal)_18%,transparent)] px-4 py-3 text-[13px] leading-[1.55] text-[var(--text)]"
                    >
                      <p>{submitError}</p>
                      <a
                        href={`mailto:${profile.email}`}
                        className="mt-1 inline-flex items-center gap-1 font-medium text-[var(--accent)] hover:underline"
                      >
                        Email me directly
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    </div>
                  )}

                  <ButtonPrimary type="submit" disabled={status === 'sending'} className="w-full sm:w-auto">
                    {status === 'sending' ? (
                      <>
                        Sending…
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      </>
                    ) : (
                      <>
                        Send message
                        <Send className="h-4 w-4" aria-hidden="true" />
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
