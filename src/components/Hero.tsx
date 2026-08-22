import type { ReactNode } from 'react';
import { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { Heart, MessageCircle, ShieldCheck, BarChart3, Wifi, Bell, Smile, ShieldCheck as ShieldIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Container } from './ui/Container';
import { Button } from './ui/Button';
import { CountUp } from './ui/CountUp';
import { HeartDoodle, PaperPlaneDoodle, StarDoodle } from './ui/Doodles';
import { fadeInUp, staggerContainer, viewportOnce } from '../lib/motion';
import type { TranslationKey } from '../i18n/fr';

const babyPhoto = '/baby.jpg';

const trustPoints: { key: 'hero.trust.1' | 'hero.trust.2' | 'hero.trust.3' }[] = [
  { key: 'hero.trust.1' },
  { key: 'hero.trust.2' },
  { key: 'hero.trust.3' },
];

const floatingCards: {
  icon: ReactNode;
  bg: string;
  fg: string;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  className: string;
  delay: number;
}[] = [
  {
    icon: <MessageCircle size={20} aria-hidden />,
    bg: 'bg-[var(--color-aslef-blue-light)]',
    fg: 'text-[var(--color-aslef-blue)]',
    titleKey: 'hero.float.communication',
    descKey: 'hero.float.communicationDesc',
    className: 'top-4 -end-4 sm:-end-10',
    delay: 0,
  },
  {
    icon: <ShieldCheck size={20} aria-hidden />,
    bg: 'bg-[var(--color-aslef-green-light)]',
    fg: 'text-[var(--color-aslef-green)]',
    titleKey: 'hero.float.security',
    descKey: 'hero.float.securityDesc',
    className: 'top-1/2 -translate-y-1/2 -end-8 sm:-end-14',
    delay: 0.6,
  },
  {
    icon: <BarChart3 size={20} aria-hidden />,
    bg: 'bg-[var(--color-aslef-yellow-light)]',
    fg: 'text-[var(--color-aslef-yellow)]',
    titleKey: 'hero.float.tracking',
    descKey: 'hero.float.trackingDesc',
    className: 'bottom-6 -end-4 sm:-end-10',
    delay: 1.1,
  },
];

const strip: { icon: ReactNode; bg: string; fg: string; titleKey: TranslationKey; descKey: TranslationKey }[] = [
  { icon: <Wifi size={20} aria-hidden />, bg: 'bg-[var(--color-aslef-blue-light)]', fg: 'text-[var(--color-aslef-blue)]', titleKey: 'strip.connected.title', descKey: 'strip.connected.desc' },
  { icon: <ShieldIcon size={20} aria-hidden />, bg: 'bg-[var(--color-aslef-green-light)]', fg: 'text-[var(--color-aslef-green)]', titleKey: 'strip.secure.title', descKey: 'strip.secure.desc' },
  { icon: <Bell size={20} aria-hidden />, bg: 'bg-[var(--color-aslef-yellow-light)]', fg: 'text-[var(--color-aslef-yellow)]', titleKey: 'strip.notifications.title', descKey: 'strip.notifications.desc' },
  { icon: <Smile size={20} aria-hidden />, bg: 'bg-[var(--color-aslef-blue-light)]', fg: 'text-[var(--color-aslef-blue)]', titleKey: 'strip.simple.title', descKey: 'strip.simple.desc' },
];

export function Hero() {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  const photoRef = useRef<HTMLDivElement>(null);
  const rotateXRaw = useMotionValue(0);
  const rotateYRaw = useMotionValue(0);
  const rotateX = useSpring(rotateXRaw, { stiffness: 150, damping: 18 });
  const rotateY = useSpring(rotateYRaw, { stiffness: 150, damping: 18 });
  const glowX = useTransform(rotateY, [-6, 6], [0, 100]);
  const glowY = useTransform(rotateX, [-6, 6], [100, 0]);
  const glowBackground = useTransform(
    [glowX, glowY],
    (latest) => `radial-gradient(280px circle at ${latest[0]}% ${latest[1]}%, rgba(255,255,255,0.25), transparent 60%)`,
  );

  const handlePhotoMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = photoRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateYRaw.set((px - 0.5) * 12);
    rotateXRaw.set((0.5 - py) * 12);
  };

  const handlePhotoMouseLeave = () => {
    rotateXRaw.set(0);
    rotateYRaw.set(0);
  };

  return (
    <div id="top" className="relative overflow-hidden bg-[var(--color-bg-soft)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -end-24 h-[420px] w-[420px] rounded-full bg-[var(--color-aslef-blue)]/10 blur-3xl"
        style={{ animation: 'aslef-drift 9s ease-in-out infinite' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -start-32 h-[360px] w-[360px] rounded-full bg-[var(--color-aslef-green)]/10 blur-3xl"
        style={{ animation: 'aslef-drift 11s ease-in-out infinite 1.5s' }}
      />

      <HeartDoodle
        className="pointer-events-none absolute left-2 top-40 hidden h-11 w-11 lg:block"
        color="var(--color-aslef-blue)"
        style={prefersReducedMotion ? undefined : { animation: 'aslef-float 6s ease-in-out infinite' }}
      />
      <PaperPlaneDoodle
        className="pointer-events-none absolute right-[30%] top-6 hidden h-16 w-24 lg:block"
        color="var(--color-aslef-blue)"
        style={prefersReducedMotion ? undefined : { animation: 'aslef-float 7s ease-in-out infinite 0.5s' }}
      />

      <Container className="relative pt-14 pb-16 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer(0.12)} className="text-center lg:text-start">
            <motion.span
              variants={fadeInUp}
              className="mx-auto lg:mx-0 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 py-1.5 text-[13px] font-semibold text-[var(--color-aslef-blue)] shadow-[var(--shadow-card)]"
            >
              <Heart size={14} className="fill-current" aria-hidden />
              {t('hero.badge')}
            </motion.span>

            <motion.h1
              variants={fadeInUp}
              className="mt-5 font-hero font-bold text-[34px] leading-[1.15] tracking-tight text-[var(--color-ink)] sm:text-[44px] lg:text-[52px]"
            >
              {t('hero.headline')}
            </motion.h1>
            <motion.p variants={fadeInUp} className="mx-auto mt-5 max-w-[520px] text-[16.5px] leading-relaxed text-[var(--color-ink-soft)] lg:mx-0 sm:text-[18px]">
              {t('hero.sub')}
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Button as="a" href="#contact" size="lg" className="w-full sm:w-auto">
                {t('hero.cta.primary')}
              </Button>
              <Button as="a" href="#application" variant="secondary" size="lg" className="w-full sm:w-auto">
                {t('hero.cta.secondary')}
              </Button>
            </motion.div>

            <motion.ul variants={fadeInUp} className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:justify-start">
              {trustPoints.map((point) => (
                <li key={point.key} className="flex items-center gap-2 text-[13.5px] font-medium text-[var(--color-ink-soft)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-aslef-green)]" />
                  {t(point.key)}
                </li>
              ))}
            </motion.ul>

            <motion.div variants={fadeInUp} className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 lg:justify-start">
              <div className="flex items-center gap-2.5">
                <div className="flex -space-x-2.5">
                  {['#1786CE', '#45B85A', '#FFB51B'].map((c) => (
                    <span key={c} className="h-8 w-8 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <div className="text-start">
                  <p className="text-[14px] font-bold text-[var(--color-ink)]">
                    <CountUp to={5000} prefix="+" />
                  </p>
                  <p className="text-[11.5px] text-[var(--color-ink-soft)]">{t('hero.trust.usersDesc')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-aslef-yellow-light)] text-[var(--color-aslef-yellow)]">
                  <ShieldCheck size={16} aria-hidden />
                </span>
                <div className="text-start">
                  <p className="text-[14px] font-bold text-[var(--color-ink)]">{t('hero.trust.secure')}</p>
                  <p className="text-[11.5px] text-[var(--color-ink-soft)]">{t('hero.trust.secureDesc')}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-[440px] lg:max-w-none lg:me-6"
          >
            <div className="relative" style={{ perspective: 1000 }}>
              <motion.div
                ref={photoRef}
                onMouseMove={handlePhotoMouseMove}
                onMouseLeave={handlePhotoMouseLeave}
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                className="relative overflow-hidden rounded-[2rem] shadow-[var(--shadow-card-lg)] aspect-[4/5] lg:aspect-[4/4.4]"
              >
                <img
                  src={babyPhoto}
                  alt="Enfant souriant à la crèche Aslef"
                  className="h-full w-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-aslef-green)]/25 via-transparent to-transparent" />
                {!prefersReducedMotion && (
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
                    style={{ background: glowBackground }}
                  />
                )}
              </motion.div>

              {floatingCards.map((card) => (
                <motion.div
                  key={card.titleKey}
                  initial={{ opacity: 0, y: 12, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 + card.delay, ease: [0.16, 1, 0.3, 1] }}
                  className={`absolute hidden md:flex items-center gap-2.5 rounded-2xl border border-[var(--color-border)] bg-white/95 px-3.5 py-2.5 shadow-[var(--shadow-card)] backdrop-blur ${card.className}`}
                  style={
                    prefersReducedMotion
                      ? undefined
                      : { animation: `aslef-float 5.5s ease-in-out ${card.delay}s infinite` }
                  }
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${card.bg} ${card.fg}`}>
                    {card.icon}
                  </span>
                  <span className="whitespace-nowrap">
                    <span className="block text-[13.5px] font-bold text-[var(--color-ink)]">{t(card.titleKey)}</span>
                    <span className="block text-[11.5px] text-[var(--color-ink-soft)]">{t(card.descKey)}</span>
                  </span>
                </motion.div>
              ))}

              <HeartDoodle
                className="pointer-events-none absolute -end-10 bottom-16 hidden h-10 w-10 lg:block"
                color="var(--color-aslef-green)"
                style={prefersReducedMotion ? undefined : { animation: 'aslef-float 6.5s ease-in-out infinite 1s' }}
              />
              <StarDoodle
                className="pointer-events-none absolute -end-4 -bottom-6 hidden h-9 w-9 lg:block"
                color="var(--color-aslef-yellow)"
                style={prefersReducedMotion ? undefined : { animation: 'aslef-float 5.5s ease-in-out infinite 1.5s' }}
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.1)}
          className="mt-14 grid grid-cols-2 gap-6 rounded-[1.75rem] border border-[var(--color-border)] bg-white p-8 shadow-[var(--shadow-card)] sm:gap-8 lg:grid-cols-4"
        >
          {strip.map((item) => (
            <motion.div key={item.titleKey} variants={fadeInUp} className="group flex items-start gap-3.5">
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 ${item.bg} ${item.fg}`}>
                {item.icon}
              </span>
              <div>
                <h3 className="text-[15px] font-bold text-[var(--color-ink)]">{t(item.titleKey)}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-[var(--color-ink-soft)]">{t(item.descKey)}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>

      <style>{`
        @keyframes aslef-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
