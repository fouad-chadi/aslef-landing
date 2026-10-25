import { useId, useState, type FormEvent, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, Check, LayoutGrid, MessageCircle, UserCog, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Container } from './ui/Container';
import { Eyebrow } from './ui/Heading';
import { ArrowIcon, Button } from './ui/Button';
import { CLIENT_CRECHES } from '../lib/clients';
import { DEFAULT_CAPACITY, type Capacity } from '../lib/pricing';
import { fadeInUp, staggerContainer } from '../lib/motion';
import type { TranslationKey } from '../i18n/fr';

const WHATSAPP_NUMBER = '213562716833';

const inputClasses =
  'w-full min-h-12 rounded-xl border border-[var(--color-line)] bg-white px-4 py-3 text-[16px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-soft)]/60 transition-[border-color,box-shadow] focus:border-[var(--color-aslef-blue)] focus:shadow-[0_0_0_4px_rgba(23,134,206,0.12)] focus:outline-none aria-[invalid=true]:border-[#C24A3A]';

const nextSteps: { icon: typeof MessageCircle; titleKey: TranslationKey; descKey: TranslationKey }[] = [
  { icon: MessageCircle, titleKey: 'how.step1.title', descKey: 'how.step1.desc' },
  { icon: UserCog, titleKey: 'how.step2.title', descKey: 'how.step2.desc' },
  { icon: LayoutGrid, titleKey: 'how.step3.title', descKey: 'how.step3.desc' },
  { icon: Users, titleKey: 'how.step4.title', descKey: 'how.step4.desc' },
];

function Field({ id, label, hint, children }: { id: string; label: ReactNode; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13.5px] font-semibold text-[var(--color-ink)]">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mb-2 text-[12.5px] text-[var(--color-ink-soft)]">
          {hint}
        </p>
      )}
      {children}
    </div>
  );
}

export function Registration() {
  const { t } = useLanguage();
  const uid = useId();
  const fid = (name: string) => `${uid}-${name}`;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [crecheName, setCrecheName] = useState('');
  const [crechePhone, setCrechePhone] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [capacity, setCapacity] = useState<Capacity>(DEFAULT_CAPACITY);
  const [error, setError] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!crecheName.trim() || !crechePhone.trim()) {
      setError(true);
      setSent(false);
      return;
    }
    setError(false);

    // The message goes to the Aslef team, so it stays in French whatever the page language.
    const lines = [
      '🔔 Nouvelle demande d’inscription Aslef',
      '',
      `🏫 Crèche: ${crecheName.trim()}`,
      `📞 Téléphone: ${crechePhone.trim()}`,
      `👤 Responsable: ${[firstName, lastName].filter(Boolean).join(' ') || '-'}`,
      wilaya.trim() ? `📍 Wilaya: ${wilaya.trim()}` : null,
      `👨‍👩‍👧 Capacité: ${capacity} comptes parents`,
    ].filter((line): line is string => line !== null);

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setSent(true);
  };

  const required = (
    <>
      <span aria-hidden className="text-[var(--color-aslef-blue)]">
        {' '}
        *
      </span>
      <span className="sr-only"> {t('register.field.required')}</span>
    </>
  );

  return (
    <section id="inscription" className="relative overflow-hidden bg-[var(--color-paper)]">
      <div aria-hidden className="aslef-dotgrid pointer-events-none absolute inset-0" />
      <Container className="relative py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
          {/* What happens next */}
          <motion.div initial="hidden" animate="visible" variants={staggerContainer(0.08)} className="lg:col-span-5">
            <motion.div variants={fadeInUp}>
              <Eyebrow>{t('register.badge')}</Eyebrow>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="aslef-display mt-4 text-[clamp(2rem,1.3rem+2.8vw,3.1rem)] font-bold leading-[1.08] text-[var(--color-ink)]">
              {t('register.headline')}
            </motion.h1>
            <motion.p variants={fadeInUp} className="aslef-pretty mt-4 max-w-[480px] text-[16.5px] leading-relaxed text-[var(--color-ink-soft)]">
              {t('register.sub')}
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-9">
              <h2 className="text-[13px] font-bold text-[var(--color-ink)]">{t('register.steps.title')}</h2>
              <ol className="relative mt-4 space-y-5">
                <span aria-hidden className="absolute bottom-5 start-[19px] top-5 border-s-2 border-dotted border-[var(--color-aslef-blue)]/35" />
                {nextSteps.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <li key={step.titleKey} className="relative flex gap-4">
                      <span className="relative z-[1] flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-line)] bg-white text-[var(--color-aslef-blue)]">
                        <Icon size={17} aria-hidden />
                      </span>
                      <div className="pt-0.5">
                        <h3 className="text-[15.5px] font-bold text-[var(--color-ink)]">
                          <span className="text-[var(--color-ink-soft)]">{i + 1}. </span>
                          {t(step.titleKey)}
                        </h3>
                        <p className="mt-0.5 text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">{t(step.descKey)}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-8 flex items-start gap-3 rounded-2xl border border-[var(--color-line)] bg-white p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-aslef-green-light)] text-[var(--color-aslef-green-dark)]">
                <BadgeCheck size={19} aria-hidden />
              </span>
              <div>
                <p className="text-[15px] font-bold text-[var(--color-ink)]">{t('how.free.title')}</p>
                <p className="text-[14px] text-[var(--color-ink-soft)]">{t('how.free.desc')}</p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-8">
              <p className="text-[13px] font-semibold text-[var(--color-ink-soft)]">{t('clients.label')}</p>
              <ul className="mt-3 flex items-center gap-3">
                {CLIENT_CRECHES.map((client) => (
                  <li key={client.name}>
                    <img
                      src={client.logo}
                      alt={client.name}
                      title={client.name}
                      width={client.width}
                      height={client.height}
                      loading="lazy"
                      decoding="async"
                      className="h-12 w-12 rounded-[14px] object-cover shadow-[0_0_0_1px_var(--color-line)]"
                    />
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          {/* The form */}
          <motion.form
            onSubmit={handleSubmit}
            noValidate
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="self-start rounded-[1.75rem] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-float)] sm:p-9 lg:col-span-7"
            aria-labelledby={fid('title')}
          >
            <h2 id={fid('title')} className="aslef-display text-[22px] font-bold text-[var(--color-ink)]">
              {t('register.formTitle')}
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field id={fid('first')} label={t('register.field.firstName')}>
                <input id={fid('first')} value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" className={inputClasses} />
              </Field>
              <Field id={fid('last')} label={t('register.field.lastName')}>
                <input id={fid('last')} value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" className={inputClasses} />
              </Field>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4">
              <Field
                id={fid('creche')}
                label={
                  <>
                    {t('register.field.crecheName')}
                    {required}
                  </>
                }
              >
                <input
                  id={fid('creche')}
                  value={crecheName}
                  onChange={(e) => setCrecheName(e.target.value)}
                  autoComplete="organization"
                  required
                  aria-required="true"
                  aria-invalid={error && !crecheName.trim() ? true : undefined}
                  aria-describedby={error ? fid('error') : undefined}
                  className={inputClasses}
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  id={fid('phone')}
                  label={
                    <>
                      {t('register.field.crechePhone')}
                      {required}
                    </>
                  }
                >
                  <input
                    id={fid('phone')}
                    value={crechePhone}
                    onChange={(e) => setCrechePhone(e.target.value)}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    dir="ltr"
                    required
                    aria-required="true"
                    aria-invalid={error && !crechePhone.trim() ? true : undefined}
                    aria-describedby={error ? fid('error') : undefined}
                    className={`${inputClasses} text-start rtl:text-end`}
                  />
                </Field>
                <Field
                  id={fid('wilaya')}
                  label={
                    <>
                      {t('register.field.wilaya')}{' '}
                      <span className="font-normal text-[var(--color-ink-soft)]">{t('register.field.wilaya.optional')}</span>
                    </>
                  }
                >
                  <input id={fid('wilaya')} value={wilaya} onChange={(e) => setWilaya(e.target.value)} autoComplete="address-level1" className={inputClasses} />
                </Field>
              </div>

              <Field id={fid('capacity')} label={t('register.field.capacity')} hint={t('register.field.capacity.help')}>
                <input
                  id={fid('capacity')}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={capacity}
                  onChange={(e) => setCapacity(Math.max(1, Number(e.target.value) || 1))}
                  aria-describedby={`${fid('capacity')}-hint`}
                  className={`${inputClasses} sm:max-w-[200px]`}
                />
              </Field>
            </div>

            <div className="mt-8">
              <div aria-live="polite">
                {error && (
                  <p id={fid('error')} role="alert" className="mb-3 text-[14px] font-semibold text-[#B23A2B]">
                    {t('register.error.required')}
                  </p>
                )}
                {sent && (
                  <p role="status" className="mb-3 flex items-center gap-2 rounded-xl bg-[var(--color-aslef-green-light)] px-3.5 py-2.5 text-[14px] font-semibold text-[var(--color-aslef-green-dark)]">
                    <Check size={16} strokeWidth={3} aria-hidden className="shrink-0" />
                    {t('register.success')}
                  </p>
                )}
              </div>
              <Button type="submit" size="lg" className="w-full">
                {t('register.submit')}
                <ArrowIcon />
              </Button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[13px] text-[var(--color-ink-soft)]">
                <MessageCircle size={14} aria-hidden className="text-[var(--color-aslef-green-dark)]" />
                {t('register.whatsappNote')}
              </p>
            </div>
          </motion.form>
        </div>
      </Container>
    </section>
  );
}
