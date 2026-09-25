import { useMemo, useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { UserPlus2, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Container, Section } from './ui/Container';
import { Button } from './ui/Button';
import { fadeInUp, staggerContainer, viewportOnce } from '../lib/motion';
import {
  CAPACITY_OPTIONS,
  ACCESS_OPTIONS,
  PARENT_BASE_PRICE,
  ACCESS_UPGRADE_PRICE,
  pricePerAccount,
  totalEstimate,
  formatDA,
  type Capacity,
  type AccessCount,
} from '../lib/pricing';

const WHATSAPP_NUMBER = '213540176768';

const inputClasses =
  'w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-[15px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-soft)]/60 transition-colors focus:border-[var(--color-aslef-blue)] focus:outline-none';

export function Registration() {
  const { t } = useLanguage();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [crecheName, setCrecheName] = useState('');
  const [crechePhone, setCrechePhone] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [capacity, setCapacity] = useState<Capacity>(20);
  const [access, setAccess] = useState<AccessCount>(2);
  const [error, setError] = useState(false);
  const [sent, setSent] = useState(false);

  const perAccount = useMemo(() => pricePerAccount(access), [access]);
  const total = useMemo(() => totalEstimate(capacity, access), [capacity, access]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!crecheName.trim() || !crechePhone.trim()) {
      setError(true);
      setSent(false);
      return;
    }
    setError(false);

    const lines = [
      '🔔 Nouvelle demande d’inscription Aslef',
      '',
      `🏫 Crèche: ${crecheName.trim()}`,
      `📞 Téléphone: ${crechePhone.trim()}`,
      `👤 Responsable: ${[firstName, lastName].filter(Boolean).join(' ') || '-'}`,
      wilaya.trim() ? `📍 Wilaya: ${wilaya.trim()}` : null,
      `👨‍👩‍👧 Capacité: ${capacity} comptes parents`,
      `👥 Accès: ${access}`,
      `💰 Offre estimée: ${formatDA(perAccount)} DA/compte × ${capacity} = ${formatDA(total)} DA / 3 mois`,
    ].filter((line): line is string => line !== null);

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setSent(true);
  };

  return (
    <Section id="inscription" background="soft">
      <Container>
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={staggerContainer(0.1)} className="mx-auto max-w-[720px] text-center">
          <motion.span
            variants={fadeInUp}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 py-1.5 text-[13px] font-semibold text-[var(--color-aslef-blue)] shadow-[var(--shadow-card)]"
          >
            <UserPlus2 size={14} aria-hidden />
            {t('register.badge')}
          </motion.span>
          <motion.h2 variants={fadeInUp} className="mt-5 font-brand font-semibold text-[26px] sm:text-[32px] tracking-tight text-[var(--color-ink)]">
            {t('register.headline')}
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 text-[15px] leading-relaxed text-[var(--color-ink-soft)]">
            {t('register.sub')}
          </motion.p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.08)}
          className="mx-auto mt-10 grid max-w-[960px] grid-cols-1 gap-6 lg:grid-cols-2"
        >
          <motion.div variants={fadeInUp} className="rounded-[1.75rem] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-[var(--color-ink)]">{t('register.field.firstName')}</label>
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClasses} />
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-[var(--color-ink)]">{t('register.field.lastName')}</label>
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClasses} />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block text-[13px] font-semibold text-[var(--color-ink)]">
                {t('register.field.crecheName')} <span className="text-[var(--color-aslef-blue)]">*</span>
              </label>
              <input value={crecheName} onChange={(e) => setCrecheName(e.target.value)} className={inputClasses} />
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block text-[13px] font-semibold text-[var(--color-ink)]">
                {t('register.field.crechePhone')} <span className="text-[var(--color-aslef-blue)]">*</span>
              </label>
              <input value={crechePhone} onChange={(e) => setCrechePhone(e.target.value)} type="tel" className={inputClasses} />
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block text-[13px] font-semibold text-[var(--color-ink)]">
                {t('register.field.wilaya')} <span className="text-[var(--color-ink-soft)] font-normal">{t('register.field.wilaya.optional')}</span>
              </label>
              <input value={wilaya} onChange={(e) => setWilaya(e.target.value)} className={inputClasses} />
            </div>

            <div className="mt-6">
              <label className="mb-1.5 block text-[13px] font-semibold text-[var(--color-ink)]">{t('register.field.capacity')}</label>
              <p className="mb-2.5 text-[12.5px] text-[var(--color-ink-soft)]">{t('register.field.capacity.help')}</p>
              <div className="flex flex-wrap gap-2">
                {CAPACITY_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setCapacity(option)}
                    className={`rounded-full px-4 py-2 text-[14px] font-semibold transition-colors ${
                      capacity === option
                        ? 'bg-[var(--color-aslef-blue)] text-white shadow-[var(--shadow-card)]'
                        : 'bg-[var(--color-aslef-blue-light)] text-[var(--color-aslef-blue)] hover:brightness-95'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-1.5 block text-[13px] font-semibold text-[var(--color-ink)]">{t('register.field.access')}</label>
              <p className="mb-2.5 text-[12.5px] text-[var(--color-ink-soft)]">{t('register.field.access.help')}</p>
              <div className="flex flex-wrap gap-2">
                {ACCESS_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setAccess(option)}
                    className={`rounded-full px-4 py-2 text-[14px] font-semibold transition-colors ${
                      access === option
                        ? 'bg-[var(--color-aslef-green)] text-white shadow-[var(--shadow-card)]'
                        : 'bg-[var(--color-aslef-green-light)] text-[var(--color-aslef-green)] hover:brightness-95'
                    }`}
                  >
                    {option} {t('register.access.suffix')}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col rounded-[1.75rem] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--color-aslef-blue-light)] px-3.5 py-1.5 text-[12.5px] font-bold text-[var(--color-aslef-blue)]">
              {t('register.subscription.badge')}
            </span>
            <h3 className="mt-4 text-[19px] font-bold text-[var(--color-ink)]">{t('register.subscription.title')}</h3>

            <div className="mt-5 flex items-center justify-between border-b border-[var(--color-border)] pb-4 text-[14.5px]">
              <span className="text-[var(--color-ink-soft)]">{t('register.field.capacity')}</span>
              <span className="font-semibold text-[var(--color-ink)]">
                {capacity} {t('register.capacity.suffix')}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-[var(--color-border)] py-4 text-[14.5px]">
              <span className="text-[var(--color-ink-soft)]">{t('register.field.access')}</span>
              <span className="font-semibold text-[var(--color-ink)]">
                {access} {t('register.access.suffix')}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-[14.5px]">
                <span className="text-[var(--color-ink-soft)]">{t('register.pricing.parent.title')}</span>
                <span className="font-semibold text-[var(--color-ink)]">
                  {formatDA(PARENT_BASE_PRICE)} {t('register.pricing.perQuarter')}
                </span>
              </div>
              {access === 4 && (
                <div className="flex items-center justify-between text-[14.5px]">
                  <span className="text-[var(--color-ink-soft)]">{t('register.pricing.access.title')}</span>
                  <span className="font-semibold text-[var(--color-ink)]">
                    +{formatDA(ACCESS_UPGRADE_PRICE)} {t('register.pricing.perQuarter')}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-dashed border-[var(--color-border)] pt-3 text-[14.5px]">
                <span className="text-[var(--color-ink-soft)]">{t('register.pricing.perAccount.title')}</span>
                <span className="font-semibold text-[var(--color-ink)]">
                  {formatDA(perAccount)} {t('register.pricing.perQuarter')}
                </span>
              </div>
              <div className="flex items-center justify-between text-[14.5px]">
                <span className="text-[var(--color-ink-soft)]">
                  {t('register.pricing.multiplier.title')} × {capacity}
                </span>
              </div>
              <div className="flex items-center justify-between text-[14.5px]">
                <span className="text-[var(--color-ink-soft)]">{t('register.pricing.extraChild.title')}</span>
                <span className="font-semibold text-[var(--color-ink)]">{t('register.pricing.extraChild.value')}</span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-2xl bg-[var(--color-bg-soft)] px-4 py-4">
              <span className="text-[15px] font-bold text-[var(--color-ink)]">{t('register.pricing.total.title')}</span>
              <span className="font-brand text-[22px] font-bold text-[var(--color-aslef-blue)]">
                {formatDA(total)} {t('register.pricing.perQuarter')}
              </span>
            </div>

            <p className="mt-3 text-[12.5px] leading-relaxed text-[var(--color-ink-soft)]">{t('register.pricing.note')}</p>

            <div className="mt-auto pt-6">
              {error && <p className="mb-3 text-[13.5px] font-semibold text-red-500">{t('register.error.required')}</p>}
              {sent && (
                <p className="mb-3 flex items-center gap-1.5 text-[13.5px] font-semibold text-[var(--color-aslef-green)]">
                  <Check size={16} aria-hidden />
                  {t('register.success')}
                </p>
              )}
              <Button type="submit" size="lg" className="w-full">
                {t('register.submit')}
              </Button>
            </div>
          </motion.div>
        </motion.form>
      </Container>
    </Section>
  );
}
