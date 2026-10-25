import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Play, Video, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Container, Section } from './ui/Container';
import { DEMO_VIDEO_POSTER, DEMO_VIDEO_URL } from '../lib/links';
import { fadeInUp, viewportOnce } from '../lib/motion';

const isEmbed = (url: string) => /youtube(-nocookie)?\.com\/embed|player\.vimeo\.com|cloudflarestream\.com|videodelivery\.net/.test(url);

/** "Découvrez Aslef en vidéo": a poster with a play button that opens the video in a lightbox.
 *  Renders nothing until DEMO_VIDEO_URL is set in src/lib/links.ts. */
export function DemoVideo() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  if (!DEMO_VIDEO_URL) return null;
  const url = DEMO_VIDEO_URL;

  return (
    <Section id="video" background="white">
      <Container>
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeInUp} className="mx-auto max-w-[640px] text-center">
          <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-soft)] px-4 py-1.5 text-[13px] font-semibold text-[var(--color-aslef-blue)]">
            <Video size={14} aria-hidden />
            {t('video.badge')}
          </span>
          <h2 className="mt-5 font-brand text-[26px] font-semibold tracking-tight text-[var(--color-ink)] sm:text-[34px]">{t('video.headline')}</h2>
          <p className="mt-3 text-[15.5px] text-[var(--color-ink-soft)]">{t('video.sub')}</p>
        </motion.div>

        <motion.button
          type="button"
          onClick={() => setOpen(true)}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="group relative mx-auto mt-12 block aspect-video w-full max-w-[960px] overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,var(--color-aslef-blue),var(--color-aslef-green))] shadow-[var(--shadow-card-lg)]"
          aria-label={t('video.play')}
        >
          {DEMO_VIDEO_POSTER && (
            <img src={DEMO_VIDEO_POSTER} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" loading="lazy" />
          )}
          <span className="absolute inset-0 bg-[linear-gradient(to_top,rgba(14,27,38,0.45),transparent_55%)]" />
          <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[var(--color-aslef-blue)] shadow-[0_12px_40px_-8px_rgba(14,27,38,0.5)] transition-transform duration-300 group-hover:scale-110">
            <span className="aslef-ring absolute inset-0 rounded-full" />
            <Play size={30} className="ms-1 fill-current" aria-hidden />
          </span>
          <span className="absolute bottom-6 start-6 text-start text-[15px] font-bold text-white">{t('video.play')}</span>
        </motion.button>
      </Container>

      <VideoLightbox open={open} onClose={() => setOpen(false)} url={url} />
    </Section>
  );
}

function VideoLightbox({ open, onClose, url }: { open: boolean; onClose: () => void; url: string }) {
  const { t } = useLanguage();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previous?.focus();
    };
  }, [open, onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={t('video.headline')}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0E1B26]/85 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-[1100px] overflow-hidden rounded-2xl bg-black shadow-2xl"
            initial={{ scale: 0.94, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video w-full">
              {isEmbed(url) ? (
                <iframe
                  src={`${url}${url.includes('?') ? '&' : '?'}autoplay=1`}
                  title={t('video.headline')}
                  className="h-full w-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video src={url} className="h-full w-full" controls autoPlay playsInline />
              )}
            </div>
          </motion.div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t('video.close')}
            className="absolute end-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
          >
            <X size={22} aria-hidden />
          </button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
