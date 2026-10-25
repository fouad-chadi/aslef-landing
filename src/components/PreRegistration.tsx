import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, ArrowRight, Check, CheckCircle2, Loader2, Pencil, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Container } from './ui/Container';
import { Eyebrow } from './ui/Heading';
import { Button } from './ui/Button';
import { PRIVACY_URL } from '../lib/links';
import { fadeInUp, staggerContainer } from '../lib/motion';
import {
  MAX_CHILDREN,
  MAX_PICKUPS,
  childHasData,
  emptyChild,
  emptyParent,
  emptyPickup,
  fetchCreches,
  normalizeEmail,
  oldestBirthdateIso,
  submitPreinscription,
  todayIso,
  validateChild,
  validateParent,
  type ChildDraft,
  type ErrorCode,
  type Errors,
  type ParentDraft,
  type PublicCreche,
  type SubmitFailure,
} from '../lib/preinscription';
import type { TranslationKey } from '../i18n/fr';

type Step = 'creche' | 'parent' | 'count' | 'child' | 'review' | 'done';
const PROGRESS: { step: Step[]; label: TranslationKey }[] = [
  { step: ['creche'], label: 'pre.step.creche' },
  { step: ['parent'], label: 'pre.step.parent' },
  { step: ['count', 'child'], label: 'pre.step.children' },
  { step: ['review'], label: 'pre.step.review' },
];

const inputClasses =
  'w-full min-h-12 rounded-xl border border-[var(--color-line)] bg-white px-4 py-3 text-[16px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-soft)]/60 transition-[border-color,box-shadow] focus:border-[var(--color-aslef-blue)] focus:shadow-[0_0_0_4px_rgba(23,134,206,0.12)] focus:outline-none aria-[invalid=true]:border-[#C24A3A]';

const fill = (text: string, values: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, k: string) => String(values[k] ?? ''));

function Field({ id, label, required, optional, hint, error, children }: { id: string; label: string; required?: boolean; optional?: boolean; hint?: string; error?: string; children: ReactNode }) {
  const { t } = useLanguage();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[14px] font-semibold text-[var(--color-ink)]">
        {label}
        {required && (
          <span aria-hidden className="text-[var(--color-aslef-blue)]">
            {' '}
            *
          </span>
        )}
        {optional && <span className="ms-1.5 text-[12.5px] font-normal text-[var(--color-ink-soft)]">({t('pre.optional')})</span>}
      </label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-[12.5px] text-[var(--color-ink-soft)]">{hint}</p>}
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-1.5 flex items-start gap-1.5 text-[13px] font-medium text-[#B23A2B]">
          <AlertCircle size={14} aria-hidden className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

export function PreRegistration() {
  const { t, lang } = useLanguage();
  const uid = useId();
  const fid = (name: string) => `${uid}-${name}`;

  const [step, setStep] = useState<Step>('creche');
  const [childIndex, setChildIndex] = useState(0);

  // Crèche list (loaded in the browser: it changes whenever a SUPER_ADMIN opens or closes a crèche).
  const [creches, setCreches] = useState<PublicCreche[] | null>(null);
  const [crechesFailed, setCrechesFailed] = useState(false);
  const [crecheToken, setCrecheToken] = useState('');
  const [crecheConfirmed, setCrecheConfirmed] = useState(false);
  const [lockedToken, setLockedToken] = useState<string | null>(null);
  const [badLink, setBadLink] = useState(false);

  const [parent, setParent] = useState<ParentDraft>(emptyParent);
  const [children, setChildren] = useState<ChildDraft[]>(() => [emptyChild()]);
  const [count, setCount] = useState(1);
  const [pendingCount, setPendingCount] = useState<number | null>(null); // a lower count waiting for the family's confirmation

  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [website, setWebsite] = useState(''); // honeypot
  const [sending, setSending] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const loadCreches = useCallback(() => {
    setCrechesFailed(false);
    setCreches(null);
    fetchCreches().then(
      (list) => {
        setCreches(list);
        const wanted = new URLSearchParams(window.location.search).get('c');
        if (wanted) {
          if (list.some((c) => c.token === wanted)) {
            setLockedToken(wanted);
            setCrecheToken(wanted);
          } else {
            setBadLink(true);
          }
        }
      },
      () => setCrechesFailed(true),
    );
  }, []);
  useEffect(loadCreches, [loadCreches]);

  // Move focus to the step's heading (screen readers + keyboard) and bring the card into view.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, [step, childIndex]);

  const crecheName = creches?.find((c) => c.token === crecheToken)?.name ?? '';
  const progressIndex = Math.max(0, PROGRESS.findIndex((p) => p.step.includes(step)));

  const errText = (code?: ErrorCode, field?: string): string | undefined => {
    if (!code) return undefined;
    if (code === 'invalid' && field && /phone$/i.test(field)) return t('pre.err.phone');
    if (code === 'invalid' && field && /email$/i.test(field)) return t('pre.err.email');
    return t(`pre.err.${code}` as TranslationKey);
  };

  const go = (next: Step) => {
    setErrors({});
    setFormError(null);
    setStep(next);
  };

  // ---- step actions ---------------------------------------------------------------------------------------------------------

  const fromCreche = () => {
    if (!crecheToken || !crecheConfirmed) {
      setErrors({ creche: 'required' });
      return;
    }
    go('parent');
  };

  const fromParent = () => {
    const trimmed = { ...parent, email: normalizeEmail(parent.email) };
    setParent(trimmed);
    const e = validateParent(trimmed);
    if (Object.keys(e).length) {
      setErrors(e);
      setFormError(t('pre.err.fix'));
      return;
    }
    go('count');
  };

  const applyCount = (n: number) => {
    setChildren((prev) => (n >= prev.length ? [...prev, ...Array.from({ length: n - prev.length }, emptyChild)] : prev.slice(0, n)));
    setCount(n);
    setChildIndex((i) => Math.min(i, n - 1));
  };

  const fromCount = () => {
    const removed = children.slice(count);
    if (removed.some(childHasData)) {
      setPendingCount(count);
      return;
    }
    applyCount(count);
    setChildIndex(0);
    go('child');
  };

  const fromChild = () => {
    const e = validateChild(children[childIndex]);
    if (Object.keys(e).length) {
      setErrors(e);
      setFormError(t('pre.err.fix'));
      return;
    }
    if (childIndex < children.length - 1) {
      setChildIndex(childIndex + 1);
      setErrors({});
      setFormError(null);
    } else {
      go('review');
    }
  };

  const backFromChild = () => {
    if (childIndex > 0) {
      setChildIndex(childIndex - 1);
      setErrors({});
      setFormError(null);
    } else {
      go('count');
    }
  };

  const submit = async () => {
    if (!consent) {
      setConsentError(true);
      return;
    }
    setConsentError(false);
    setFormError(null);
    setSending(true);
    try {
      const ref = await submitPreinscription({ crecheToken, parent, children, locale: lang, consent, website });
      setReference(ref);
      // The request is stored server-side: drop the health information from this browser's memory.
      setChildren([]);
      setParent(emptyParent());
      setStep('done');
      setErrors({});
    } catch (raw) {
      const failure = raw as SubmitFailure;
      switch (failure.kind) {
        case 'validation': {
          const m = /^children\[(\d+)\]\.(.+)$/.exec(failure.field);
          if (m) {
            setChildIndex(Number(m[1]));
            setErrors({ [m[2]]: failure.code });
            setStep('child');
          } else if (failure.field === 'consent') {
            setConsentError(true);
          } else if (failure.field === 'children') {
            setStep('count');
          } else {
            setErrors({ [failure.field]: failure.code });
            setStep('parent');
          }
          setFormError(t('pre.err.fix'));
          break;
        }
        case 'duplicate':
          setFormError(t('pre.err.duplicate'));
          break;
        case 'creche':
          setCrecheConfirmed(false);
          setCrecheToken('');
          setLockedToken(null);
          loadCreches();
          setStep('creche');
          setFormError(t('pre.err.creche'));
          break;
        case 'rate':
          setFormError(t('pre.err.rate'));
          break;
        case 'network':
          setFormError(t('pre.err.network'));
          break;
        default:
          setFormError(t('pre.err.server'));
      }
    } finally {
      setSending(false);
    }
  };

  // ---- small updaters -------------------------------------------------------------------------------------------------------
  const setP = (k: keyof ParentDraft, v: string) => {
    setParent((p) => ({ ...p, [k]: v }));
    setFormError(null);
    if (errors[k]) setErrors(({ [k]: _drop, ...rest }) => rest);
  };
  const setC = (patch: Partial<ChildDraft>) => {
    setChildren((list) => list.map((c, i) => (i === childIndex ? { ...c, ...patch } : c)));
    setFormError(null);
    const keys = Object.keys(patch);
    if (keys.some((k) => errors[k])) setErrors((prev) => Object.fromEntries(Object.entries(prev).filter(([k]) => !keys.includes(k))));
  };

  // ---- rendering ------------------------------------------------------------------------------------------------------------

  const stepHeading = (title: string, sub?: string) => (
    <div>
      <h2 ref={headingRef} tabIndex={-1} className="aslef-display text-[24px] font-bold leading-tight text-[var(--color-ink)] focus:outline-none sm:text-[28px]">
        {title}
      </h2>
      {sub && <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-ink-soft)]">{sub}</p>}
    </div>
  );

  const nav = (opts: { onBack?: () => void; onNext: () => void; nextLabel: string; nextDisabled?: boolean; loading?: boolean }) => (
    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
      {opts.onBack ? (
        <button
          type="button"
          onClick={opts.onBack}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-semibold text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]"
        >
          <ArrowLeft size={17} aria-hidden className="rtl:-scale-x-100" />
          {t('pre.back')}
        </button>
      ) : (
        <span />
      )}
      <Button type="button" size="lg" onClick={opts.onNext} disabled={opts.nextDisabled || opts.loading} className="h-auto! min-h-[52px] w-full whitespace-normal! py-3 text-center leading-snug sm:w-auto">
        {opts.loading ? <Loader2 size={18} aria-hidden className="animate-spin" /> : null}
        {opts.nextLabel}
        {!opts.loading && <ArrowRight size={18} aria-hidden className="rtl:-scale-x-100" />}
      </Button>
    </div>
  );

  const banner = formError && (
    <p role="alert" className="mt-6 flex items-start gap-2 rounded-xl bg-[#FBEDEA] px-4 py-3 text-[14px] font-medium text-[#8F2D20]">
      <AlertCircle size={17} aria-hidden className="mt-0.5 shrink-0" />
      {formError}
    </p>
  );

  const child = children[childIndex];

  return (
    <section className="relative overflow-hidden bg-[var(--color-paper)]">
      <div aria-hidden className="aslef-dotgrid pointer-events-none absolute inset-0" />
      <Container className="relative py-10 sm:py-14 lg:py-16">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer(0.08)} className="mx-auto max-w-[720px] text-center">
          <motion.div variants={fadeInUp}>
            <Eyebrow>{t('pre.badge')}</Eyebrow>
          </motion.div>
          <motion.h1 variants={fadeInUp} className="aslef-display mt-4 text-[clamp(2rem,1.3rem+2.8vw,3rem)] font-bold leading-[1.08] text-[var(--color-ink)]">
            {t('pre.title')}
          </motion.h1>
          <motion.p variants={fadeInUp} className="aslef-pretty mx-auto mt-4 max-w-[560px] text-[16.5px] leading-relaxed text-[var(--color-ink-soft)]">
            {t('pre.sub')}
          </motion.p>
        </motion.div>

        <div className="mx-auto mt-8 max-w-[720px]">
          {step !== 'done' && (
            <div className="mb-5">
              <ol className="flex gap-2" aria-label={fill(t('pre.progress'), { n: progressIndex + 1, total: PROGRESS.length })}>
                {PROGRESS.map((p, i) => (
                  <li key={p.label} className="flex-1" aria-current={i === progressIndex ? 'step' : undefined}>
                    <span
                      aria-hidden
                      className={`block h-1.5 rounded-full transition-colors duration-500 ${i <= progressIndex ? 'bg-[linear-gradient(90deg,var(--color-aslef-blue),var(--color-aslef-green))]' : 'bg-[var(--color-line)]'}`}
                    />
                    <span className={`mt-2 hidden text-[12.5px] font-semibold sm:block ${i === progressIndex ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-soft)]'}`}>{t(p.label)}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-2 text-[13px] font-semibold text-[var(--color-ink-soft)] sm:hidden">
                {fill(t('pre.progress'), { n: progressIndex + 1, total: PROGRESS.length })} · {t(PROGRESS[progressIndex].label)}
              </p>
            </div>
          )}

          <div className="rounded-[1.75rem] border border-[var(--color-line)] bg-white p-5 shadow-[var(--shadow-float)] sm:p-9">
            {/* Honeypot: invisible to people, tempting to bots. */}
            <div aria-hidden className="absolute -start-[9999px] h-0 w-0 overflow-hidden">
              <label>
                Website
                <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </label>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={step === 'child' ? `child-${childIndex}` : step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                {step === 'creche' && (
                  <div>
                    {stepHeading(t('pre.creche.title'), t('pre.creche.sub'))}
                    <div className="mt-6 space-y-5">
                      {badLink && <p className="rounded-xl bg-[var(--color-aslef-yellow-light)] px-4 py-3 text-[14px] text-[var(--color-ink)]">{t('pre.creche.badLink')}</p>}
                      {creches === null && !crechesFailed && (
                        <p className="flex items-center gap-2 text-[15px] text-[var(--color-ink-soft)]" role="status">
                          <Loader2 size={17} aria-hidden className="animate-spin" />
                          {t('pre.creche.loading')}
                        </p>
                      )}
                      {crechesFailed && (
                        <div role="alert" className="rounded-xl bg-[#FBEDEA] px-4 py-3 text-[14px] text-[#8F2D20]">
                          <p>{t('pre.creche.error')}</p>
                          <button type="button" onClick={loadCreches} className="mt-2 font-semibold underline underline-offset-4">
                            {t('pre.creche.retry')}
                          </button>
                        </div>
                      )}
                      {creches && creches.length === 0 && <p className="rounded-xl bg-[var(--color-paper)] px-4 py-3 text-[15px] text-[var(--color-ink-soft)]">{t('pre.creche.empty')}</p>}
                      {creches && creches.length > 0 && (
                        <>
                          <Field id={fid('creche')} label={t('pre.creche.label')} required error={errors.creche && !crecheToken ? t('pre.err.required') : undefined}>
                            {lockedToken ? (
                              <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-4 py-3">
                                <p className="text-[12.5px] font-semibold text-[var(--color-ink-soft)]">{t('pre.creche.locked')}</p>
                                <p className="text-[17px] font-bold text-[var(--color-ink)]">{crecheName}</p>
                              </div>
                            ) : (
                              <select
                                id={fid('creche')}
                                value={crecheToken}
                                onChange={(e) => {
                                  setCrecheToken(e.target.value);
                                  setCrecheConfirmed(false);
                                  setErrors({});
                                }}
                                aria-invalid={errors.creche && !crecheToken ? true : undefined}
                                className={inputClasses}
                              >
                                <option value="">{t('pre.creche.placeholder')}</option>
                                {creches.map((c) => (
                                  <option key={c.token} value={c.token}>
                                    {c.name}
                                    {c.wilaya ? ` — ${c.wilaya}` : ''}
                                  </option>
                                ))}
                              </select>
                            )}
                          </Field>
                          {crecheToken && (
                            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--color-line)] p-4 text-[15px] text-[var(--color-ink)]">
                              <input type="checkbox" checked={crecheConfirmed} onChange={(e) => setCrecheConfirmed(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[var(--color-aslef-blue)]" />
                              <span>
                                {t('pre.creche.confirm')} : <strong>{crecheName}</strong>
                              </span>
                            </label>
                          )}
                          {errors.creche && crecheToken && !crecheConfirmed && <p role="alert" className="text-[13px] font-medium text-[#B23A2B]">{t('pre.err.required')}</p>}
                        </>
                      )}
                    </div>
                    {banner}
                    {nav({ onNext: fromCreche, nextLabel: t('pre.next'), nextDisabled: !creches || creches.length === 0 })}
                  </div>
                )}

                {step === 'parent' && (
                  <div>
                    {stepHeading(t('pre.parent.title'), t('pre.parent.sub'))}
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field id={fid('pfn')} label={t('pre.f.firstName')} required error={errText(errors.firstName)}>
                        <input id={fid('pfn')} value={parent.firstName} onChange={(e) => setP('firstName', e.target.value)} autoComplete="given-name" maxLength={80} aria-invalid={errors.firstName ? true : undefined} className={inputClasses} />
                      </Field>
                      <Field id={fid('pln')} label={t('pre.f.lastName')} required error={errText(errors.lastName)}>
                        <input id={fid('pln')} value={parent.lastName} onChange={(e) => setP('lastName', e.target.value)} autoComplete="family-name" maxLength={80} aria-invalid={errors.lastName ? true : undefined} className={inputClasses} />
                      </Field>
                      <Field id={fid('pfa')} label={t('pre.f.firstNameAr')} optional>
                        <input id={fid('pfa')} dir="rtl" lang="ar" value={parent.firstNameAr} onChange={(e) => setP('firstNameAr', e.target.value)} maxLength={80} className={inputClasses} />
                      </Field>
                      <Field id={fid('pla')} label={t('pre.f.lastNameAr')} optional>
                        <input id={fid('pla')} dir="rtl" lang="ar" value={parent.lastNameAr} onChange={(e) => setP('lastNameAr', e.target.value)} maxLength={80} className={inputClasses} />
                      </Field>
                      <Field id={fid('pph')} label={t('pre.f.phone')} required hint={t('pre.f.phone.hint')} error={errText(errors.phone, 'phone')}>
                        <input id={fid('pph')} type="tel" inputMode="tel" dir="ltr" value={parent.phone} onChange={(e) => setP('phone', e.target.value)} autoComplete="tel" maxLength={30} aria-invalid={errors.phone ? true : undefined} className={`${inputClasses} text-start`} />
                      </Field>
                      <Field id={fid('pem')} label={t('pre.f.email')} required hint={t('pre.f.email.hint')} error={errText(errors.email, 'email')}>
                        <input id={fid('pem')} type="email" inputMode="email" dir="ltr" value={parent.email} onChange={(e) => setP('email', e.target.value)} onBlur={(e) => setP('email', normalizeEmail(e.target.value))} autoComplete="email" maxLength={150} aria-invalid={errors.email ? true : undefined} className={`${inputClasses} text-start`} />
                      </Field>
                    </div>
                    {banner}
                    {nav({ onBack: () => go('creche'), onNext: fromParent, nextLabel: t('pre.next') })}
                  </div>
                )}

                {step === 'count' && (
                  <div>
                    {stepHeading(t('pre.count.title'), t('pre.count.sub'))}
                    <div role="radiogroup" aria-label={t('pre.count.aria')} className="mt-7 grid grid-cols-3 gap-3 sm:grid-cols-6">
                      {Array.from({ length: MAX_CHILDREN }, (_, i) => i + 1).map((n) => (
                        <button
                          key={n}
                          type="button"
                          role="radio"
                          aria-checked={count === n}
                          onClick={() => setCount(n)}
                          className={`aslef-display flex h-16 items-center justify-center rounded-2xl border-2 text-[26px] font-bold transition-all ${
                            count === n
                              ? 'border-[var(--color-aslef-blue)] bg-[var(--color-aslef-blue-light)] text-[var(--color-aslef-blue-dark)] shadow-[0_0_0_4px_rgba(23,134,206,0.12)]'
                              : 'border-[var(--color-line)] text-[var(--color-ink)] hover:border-[var(--color-aslef-blue)]/50'
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    {nav({ onBack: () => go('parent'), onNext: fromCount, nextLabel: t('pre.next') })}
                    {pendingCount !== null && (
                      <div role="alertdialog" aria-labelledby={fid('rm-title')} className="mt-6 rounded-2xl border border-[var(--color-aslef-yellow)]/50 bg-[var(--color-aslef-yellow-light)] p-5">
                        <p id={fid('rm-title')} className="font-bold text-[var(--color-ink)]">{t('pre.count.removeTitle')}</p>
                        <p className="mt-1 text-[14.5px] text-[var(--color-ink-soft)]">{fill(t('pre.count.removeBody'), { n: children.length - pendingCount })}</p>
                        <div className="mt-4 flex flex-wrap gap-3">
                          <Button
                            type="button"
                            size="md"
                            onClick={() => {
                              applyCount(pendingCount);
                              setPendingCount(null);
                              setChildIndex(0);
                              go('child');
                            }}
                          >
                            {t('pre.count.removeOk')}
                          </Button>
                          <button
                            type="button"
                            onClick={() => {
                              setCount(children.length);
                              setPendingCount(null);
                            }}
                            className="min-h-11 rounded-full px-4 text-[15px] font-semibold text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
                          >
                            {t('pre.count.cancel')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {step === 'child' && child && (
                  <div>
                    {stepHeading(fill(t('pre.child.title'), { i: childIndex + 1, n: children.length }), t('pre.child.sub'))}
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field id={fid('cfn')} label={t('pre.f.firstName')} required error={errText(errors.firstName)}>
                        <input id={fid('cfn')} value={child.firstName} onChange={(e) => setC({ firstName: e.target.value })} maxLength={80} aria-invalid={errors.firstName ? true : undefined} className={inputClasses} />
                      </Field>
                      <Field id={fid('cln')} label={t('pre.f.lastName')} required error={errText(errors.lastName)}>
                        <input id={fid('cln')} value={child.lastName} onChange={(e) => setC({ lastName: e.target.value })} maxLength={80} aria-invalid={errors.lastName ? true : undefined} className={inputClasses} />
                      </Field>
                      <Field id={fid('cfa')} label={t('pre.f.firstNameAr')} optional>
                        <input id={fid('cfa')} dir="rtl" lang="ar" value={child.firstNameAr} onChange={(e) => setC({ firstNameAr: e.target.value })} maxLength={80} className={inputClasses} />
                      </Field>
                      <Field id={fid('cla')} label={t('pre.f.lastNameAr')} optional>
                        <input id={fid('cla')} dir="rtl" lang="ar" value={child.lastNameAr} onChange={(e) => setC({ lastNameAr: e.target.value })} maxLength={80} className={inputClasses} />
                      </Field>
                      <fieldset>
                        <legend className="mb-1.5 block text-[14px] font-semibold text-[var(--color-ink)]">
                          {t('pre.f.gender')}
                          <span aria-hidden className="text-[var(--color-aslef-blue)]"> *</span>
                        </legend>
                        <div className="grid grid-cols-2 gap-3">
                          {(['F', 'M'] as const).map((g) => (
                            <label
                              key={g}
                              className={`flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 text-[15.5px] font-semibold transition-colors ${
                                child.gender === g ? 'border-[var(--color-aslef-blue)] bg-[var(--color-aslef-blue-light)] text-[var(--color-aslef-blue-dark)]' : 'border-[var(--color-line)] text-[var(--color-ink)]'
                              }`}
                            >
                              <input type="radio" name={fid('gender')} value={g} checked={child.gender === g} onChange={() => setC({ gender: g })} className="sr-only" />
                              {child.gender === g && <Check size={16} aria-hidden strokeWidth={3} />}
                              {g === 'F' ? t('pre.f.girl') : t('pre.f.boy')}
                            </label>
                          ))}
                        </div>
                        {errors.gender && <p role="alert" className="mt-1.5 text-[13px] font-medium text-[#B23A2B]">{t('pre.err.required')}</p>}
                      </fieldset>
                      <Field id={fid('cbd')} label={t('pre.f.birthdate')} required hint={t('pre.f.birthdate.hint')} error={errText(errors.birthdate)}>
                        <input
                          id={fid('cbd')}
                          type="date"
                          dir="ltr"
                          min={oldestBirthdateIso()}
                          max={todayIso()}
                          value={child.birthdate}
                          onChange={(e) => setC({ birthdate: e.target.value })}
                          aria-invalid={errors.birthdate ? true : undefined}
                          className={`${inputClasses} text-start`}
                        />
                      </Field>
                    </div>

                    <div className="mt-8 rounded-2xl bg-[var(--color-paper)] p-5">
                      <h3 className="flex items-center gap-2 text-[16px] font-bold text-[var(--color-ink)]">
                        <ShieldCheck size={18} aria-hidden className="text-[var(--color-aslef-green-dark)]" />
                        {t('pre.extra.title')}
                      </h3>
                      <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--color-ink-soft)]">{t('pre.extra.why')}</p>
                      <div className="mt-4 grid grid-cols-1 gap-4">
                        <Field id={fid('cal')} label={t('pre.f.allergies')} optional hint={t('pre.f.allergies.hint')} error={errText(errors.allergies)}>
                          <textarea id={fid('cal')} rows={2} maxLength={1000} value={child.allergies} onChange={(e) => setC({ allergies: e.target.value })} className={inputClasses} />
                        </Field>
                        <Field id={fid('cme')} label={t('pre.f.medical')} optional hint={t('pre.f.medical.hint')} error={errText(errors.medicalNotes)}>
                          <textarea id={fid('cme')} rows={2} maxLength={1000} value={child.medicalNotes} onChange={(e) => setC({ medicalNotes: e.target.value })} className={inputClasses} />
                        </Field>
                      </div>

                      <h4 className="mt-6 text-[15px] font-bold text-[var(--color-ink)]">
                        {t('pre.pickup.title')} <span className="text-[12.5px] font-normal text-[var(--color-ink-soft)]">({t('pre.optional')})</span>
                      </h4>
                      <div className="mt-3 space-y-3">
                        {child.pickups.map((p, i) => (
                          <div key={i} className="rounded-xl border border-[var(--color-line)] bg-white p-4">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                              <Field id={fid(`pk${i}n`)} label={t('pre.pickup.name')} error={errText(errors[`pickups.${i}.name`])}>
                                <input id={fid(`pk${i}n`)} value={p.name} maxLength={80} onChange={(e) => setC({ pickups: child.pickups.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)) })} aria-invalid={errors[`pickups.${i}.name`] ? true : undefined} className={inputClasses} />
                              </Field>
                              <Field id={fid(`pk${i}p`)} label={t('pre.pickup.phone')} error={errText(errors[`pickups.${i}.phone`], 'phone')}>
                                <input id={fid(`pk${i}p`)} type="tel" inputMode="tel" dir="ltr" value={p.phone} maxLength={30} onChange={(e) => setC({ pickups: child.pickups.map((x, j) => (j === i ? { ...x, phone: e.target.value } : x)) })} aria-invalid={errors[`pickups.${i}.phone`] ? true : undefined} className={`${inputClasses} text-start`} />
                              </Field>
                              <Field id={fid(`pk${i}r`)} label={t('pre.pickup.relation')} hint={t('pre.pickup.relation.hint')}>
                                <input id={fid(`pk${i}r`)} value={p.relation} maxLength={50} onChange={(e) => setC({ pickups: child.pickups.map((x, j) => (j === i ? { ...x, relation: e.target.value } : x)) })} className={inputClasses} />
                              </Field>
                              <Field id={fid(`pk${i}t`)} label={t('pre.pickup.notes')}>
                                <input id={fid(`pk${i}t`)} value={p.notes} maxLength={200} onChange={(e) => setC({ pickups: child.pickups.map((x, j) => (j === i ? { ...x, notes: e.target.value } : x)) })} className={inputClasses} />
                              </Field>
                            </div>
                            <button
                              type="button"
                              onClick={() => setC({ pickups: child.pickups.filter((_, j) => j !== i) })}
                              className="mt-3 inline-flex min-h-10 items-center gap-1.5 text-[13.5px] font-semibold text-[#B23A2B] hover:underline"
                            >
                              <Trash2 size={15} aria-hidden />
                              {t('pre.pickup.remove')}
                            </button>
                          </div>
                        ))}
                      </div>
                      {child.pickups.length < MAX_PICKUPS && (
                        <button
                          type="button"
                          onClick={() => setC({ pickups: [...child.pickups, emptyPickup()] })}
                          className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-dashed border-[var(--color-aslef-blue)]/50 px-4 text-[14.5px] font-semibold text-[var(--color-aslef-blue-dark)] hover:bg-white"
                        >
                          <Plus size={16} aria-hidden />
                          {t('pre.pickup.add')}
                        </button>
                      )}
                    </div>
                    {banner}
                    {nav({ onBack: backFromChild, onNext: fromChild, nextLabel: childIndex < children.length - 1 ? t('pre.nextChild') : t('pre.toReview') })}
                  </div>
                )}

                {step === 'review' && (
                  <div>
                    {stepHeading(t('pre.review.title'), t('pre.review.sub'))}
                    <div className="mt-6 space-y-4">
                      <ReviewBlock title={t('pre.review.creche')} editLabel={t('pre.review.edit')} onEdit={() => go('creche')}>
                        <p className="font-semibold text-[var(--color-ink)]">{crecheName}</p>
                      </ReviewBlock>
                      <ReviewBlock title={t('pre.review.parent')} editLabel={t('pre.review.edit')} onEdit={() => go('parent')}>
                        <p className="font-semibold text-[var(--color-ink)]">
                          {parent.firstName} {parent.lastName}
                          {(parent.firstNameAr || parent.lastNameAr) && (
                            <span dir="rtl" lang="ar" className="ms-2 font-normal text-[var(--color-ink-soft)]">
                              {parent.firstNameAr} {parent.lastNameAr}
                            </span>
                          )}
                        </p>
                        <p dir="ltr" className="text-start text-[var(--color-ink-soft)]">{parent.phone} · {parent.email}</p>
                      </ReviewBlock>
                      <ReviewBlock title={`${t('pre.review.children')} (${children.length})`}>
                        <ul className="divide-y divide-[var(--color-line)]">
                          {children.map((c, i) => (
                            <li key={c.uid} className="flex items-start justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                              <div>
                                <p className="font-semibold text-[var(--color-ink)]">
                                  {c.firstName} {c.lastName}
                                </p>
                                <p className="text-[13.5px] text-[var(--color-ink-soft)]">
                                  {c.gender === 'F' ? t('pre.f.girl') : t('pre.f.boy')} · {t('pre.review.born')} <span dir="ltr">{c.birthdate.split('-').reverse().join('/')}</span>
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setChildIndex(i);
                                  go('child');
                                }}
                                className="inline-flex min-h-10 shrink-0 items-center gap-1.5 text-[13.5px] font-semibold text-[var(--color-aslef-blue-dark)] hover:underline"
                              >
                                <Pencil size={14} aria-hidden />
                                {t('pre.review.edit')}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </ReviewBlock>
                    </div>

                    <label className="mt-6 flex cursor-pointer items-start gap-3 text-[14.5px] leading-relaxed text-[var(--color-ink)]">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => {
                          setConsent(e.target.checked);
                          setConsentError(false);
                        }}
                        aria-invalid={consentError ? true : undefined}
                        aria-describedby={consentError ? fid('consent-err') : undefined}
                        className="mt-1 h-5 w-5 shrink-0 accent-[var(--color-aslef-blue)]"
                      />
                      <span>
                        {t('pre.consent')}{' '}
                        <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--color-aslef-blue-dark)] underline underline-offset-4">
                          {t('pre.consent.link')}
                        </a>
                      </span>
                    </label>
                    {consentError && <p id={fid('consent-err')} role="alert" className="mt-2 text-[13px] font-medium text-[#B23A2B]">{t('pre.err.consent')}</p>}
                    {banner}
                    {nav({
                      onBack: () => {
                        setChildIndex(children.length - 1);
                        go('child');
                      },
                      onNext: submit,
                      nextLabel: sending ? t('pre.submitting') : t('pre.submit'),
                      loading: sending,
                    })}
                  </div>
                )}

                {step === 'done' && (
                  <div className="py-4 text-center" role="status">
                    <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-aslef-green-light)] text-[var(--color-aslef-green-dark)]">
                      <CheckCircle2 size={34} aria-hidden />
                    </span>
                    <h2 ref={headingRef} tabIndex={-1} className="aslef-display mt-5 text-[28px] font-bold text-[var(--color-ink)] focus:outline-none">
                      {t('pre.done.title')}
                    </h2>
                    <p className="mx-auto mt-3 max-w-[460px] text-[16px] leading-relaxed text-[var(--color-ink-soft)]">{t('pre.done.body')}</p>
                    <div className="mx-auto mt-6 max-w-[320px] rounded-2xl bg-[var(--color-paper)] px-5 py-4">
                      <p className="text-[13px] font-semibold text-[var(--color-ink-soft)]">{t('pre.done.ref')}</p>
                      <p dir="ltr" className="aslef-display mt-1 text-[26px] font-bold tracking-wider text-[var(--color-ink)]">
                        {reference}
                      </p>
                      <p className="mt-1 text-[13px] text-[var(--color-ink-soft)]">{t('pre.done.keep')}</p>
                    </div>
                    <div className="mt-8">
                      <Button as="a" href="/" size="lg">
                        {t('pre.done.home')}
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
}

function ReviewBlock({ title, editLabel, onEdit, children }: { title: string; editLabel?: string; onEdit?: () => void; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--color-line)] p-4 sm:p-5">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-[12.5px] font-bold uppercase tracking-[0.12em] text-[var(--color-ink-soft)]">{title}</h3>
        {onEdit && (
          <button type="button" onClick={onEdit} className="inline-flex min-h-10 items-center gap-1.5 text-[13.5px] font-semibold text-[var(--color-aslef-blue-dark)] hover:underline">
            <Pencil size={14} aria-hidden />
            {editLabel}
          </button>
        )}
      </div>
      <div className="text-[15px] leading-relaxed">{children}</div>
    </div>
  );
}
