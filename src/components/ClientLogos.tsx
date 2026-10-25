import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Container, Section } from './ui/Container';
import { CLIENT_CRECHES } from '../lib/clients';
import { fadeInUp, revealItem, viewportOnce } from '../lib/motion';

/** "Ils nous font confiance": the real crèches already using Aslef (logos and names exactly as
 *  supplied in lib/clients.ts), shown near the end of the page, just before the final call to
 *  action. The logos are full illustrations on their own backgrounds (not transparent marks), so
 *  each sits in a rounded tile at one consistent size, on an equal white card with the name below.
 *  The soft decorations are inline SVG, hidden from assistive tech. */
export function ClientLogos() {
  const { t } = useLanguage();

  // The last word of the title carries the brand gradient ("confiance" / "بنا").
  const title = t('clients.title');
  const cut = title.lastIndexOf(' ');
  const lead = cut > 0 ? title.slice(0, cut + 1) : '';
  const accent = cut > 0 ? title.slice(cut + 1) : title;

  return (
    <Section
      id="clients"
      aria-labelledby="clients-title"
      background="white"
      className="relative overflow-hidden !py-16 sm:!py-20 lg:!py-24"
      style={{ background: 'linear-gradient(180deg, #FFFDF9 0%, #FFFFFF 100%)' }}
    >
      <style>{`
        @keyframes ci-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-9px) } }
        @keyframes ci-drift { from { transform: translateX(-10px) } to { transform: translateX(14px) } }
        @keyframes ci-twinkle { 0%,100% { opacity: .45; transform: scale(.85) rotate(0deg) } 50% { opacity: 1; transform: scale(1.12) rotate(14deg) } }
        @keyframes ci-beat { 0%,100% { transform: scale(1) } 18% { transform: scale(1.14) } 36% { transform: scale(1) } 54% { transform: scale(1.1) } 72% { transform: scale(1) } }
        @keyframes ci-march { to { stroke-dashoffset: -30 } }
        @keyframes ci-shimmer { from { background-position: 0% 50% } to { background-position: 100% 50% } }
        .ci-float { animation: ci-float 6s ease-in-out infinite }
        .ci-float-slow { animation: ci-float 8.5s ease-in-out -2s infinite }
        .ci-drift { animation: ci-drift 12s ease-in-out infinite alternate }
        .ci-twinkle { transform-box: fill-box; transform-origin: center; animation: ci-twinkle 2.6s ease-in-out infinite }
        .ci-twinkle-b { transform-box: fill-box; transform-origin: center; animation: ci-twinkle 3.2s ease-in-out -1.2s infinite }
        .ci-beat { transform-origin: center; animation: ci-beat 2.8s ease-in-out infinite }
        .ci-march { animation: ci-march 2.4s linear infinite }
        .ci-shimmer { background-size: 220% 100%; animation: ci-shimmer 5s ease-in-out infinite alternate }
        @media (prefers-reduced-motion: reduce) {
          .ci-float, .ci-float-slow, .ci-drift, .ci-twinkle, .ci-twinkle-b, .ci-beat, .ci-march, .ci-shimmer { animation: none }
        }
      `}</style>
      <Decorations />

      <Container className="relative">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeInUp} className="mx-auto max-w-[720px] text-center">
          <h2 id="clients-title" className="aslef-display text-[clamp(2rem,1.4rem+2.4vw,3.25rem)] font-bold leading-[1.1] text-[var(--color-ink)]">
            {lead}
            <span className="ci-shimmer bg-[linear-gradient(90deg,var(--color-aslef-blue),var(--color-aslef-green),var(--color-aslef-blue))] bg-clip-text text-transparent">{accent}</span>
          </h2>
          <p className="aslef-pretty mx-auto mt-4 max-w-[520px] text-[16px] text-[var(--color-ink-soft)] sm:text-[18px]">{t('clients.sub')}</p>
        </motion.div>

        <ul className="mx-auto mt-10 grid max-w-[1040px] grid-cols-2 gap-3 sm:mt-14 sm:grid-cols-4 sm:gap-5 lg:gap-6">
          {CLIENT_CRECHES.map((client, i) => (
            <motion.li
              key={client.name}
              {...revealItem(i, 4, 0.08)}
            >
              <div className="aslef-lift group flex flex-col items-center gap-3 rounded-[1.25rem] border border-[var(--color-line)]/70 bg-white px-2 py-5 shadow-[0_10px_30px_-18px_rgba(18,39,58,0.25)] sm:gap-5 sm:rounded-[1.75rem] sm:px-4 sm:py-8 h-full">
                <div className="overflow-hidden rounded-[18px] bg-white shadow-[0_0_0_1px_var(--color-line),0_10px_24px_-12px_rgba(18,39,58,0.35)] sm:rounded-[28px]">
                  <img
                    src={client.logo}
                    alt=""
                    width={client.width}
                    height={client.height}
                    loading="lazy"
                    decoding="async"
                    className="h-[88px] w-[88px] object-cover transition-transform duration-500 ease-out group-hover:scale-[1.07] sm:h-[96px] sm:w-[96px] lg:h-[120px] lg:w-[120px]"
                  />
                </div>
                <span dir="auto" className="aslef-balance text-center text-[12.5px] font-bold leading-tight text-[var(--color-ink)] sm:text-[16px]">
                  {client.name}
                </span>
              </div>
            </motion.li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

/** Soft blobs and waves plus a few hand-drawn touches (star on a dashed trail, cloud, heart,
 *  sparkles, a loop) - kept pale so the logos stay the focus. Purely decorative, animated gently
 *  on every screen size (switched off for prefers-reduced-motion). */
function Decorations() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* soft shapes, all sizes */}
      <svg className="absolute -start-24 -top-24 h-[340px] w-[340px] text-[#E6F1FA]" viewBox="0 0 200 200" fill="currentColor">
        <path d="M0 0h200c8 40-20 70-60 80-40 10-50 40-90 60C20 155 0 130 0 100z" opacity="0.85" />
      </svg>
      <svg className="absolute inset-x-0 bottom-0 h-[150px] w-full text-[#EEF4FB] sm:h-[200px]" viewBox="0 0 1440 200" preserveAspectRatio="none" fill="currentColor">
        <path d="M0 120c180-70 360-60 560-20s420 70 560 10c120-50 220-40 320-10v100H0z" opacity="0.9" />
      </svg>

      {/* details: smaller on phones, kept in the margins so they never crowd the cards */}
      <svg className="ci-float absolute start-[2%] top-[2%] h-[58px] w-[98px] lg:start-[4%] lg:top-[10%] lg:h-[130px] lg:w-[220px]" viewBox="0 0 220 130" fill="none">
        <path d="M2 118C40 60 80 40 130 50s60-5 78-28" stroke="#9CCBEF" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 9" className="ci-march" />
        <path d="M205 4l5 11 12 2-9 8 3 12-11-6-11 6 3-12-9-8 12-2z" fill="#FFD66B" transform="translate(-8 4)" className="ci-twinkle" />
      </svg>
      <svg className="ci-drift absolute end-[3%] top-[3%] h-[44px] w-[70px] text-[#E3EEF9] lg:end-[5%] lg:top-[8%] lg:h-[90px] lg:w-[140px]" viewBox="0 0 140 90" fill="currentColor">
        <path d="M30 78a22 22 0 0 1 2-44 30 30 0 0 1 58-6 26 26 0 0 1 24 50z" />
      </svg>
      <svg className="ci-twinkle-b absolute end-[30%] top-[3%] h-[26px] w-[32px] text-[var(--color-aslef-green)] lg:end-[20%] lg:top-[10%] lg:h-[40px] lg:w-[50px]" viewBox="0 0 50 40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <path d="M6 30l3-14" />
        <path d="M22 12l14-8" />
        <path d="M30 28l14-2" />
      </svg>
      <svg className="ci-beat absolute start-[4%] top-[36%] h-[24px] w-[24px] text-[var(--color-aslef-blue)] lg:start-[7%] lg:top-[56%] lg:h-[44px] lg:w-[44px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M12 21s-8-5.2-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 5.8-8 11-8 11z" opacity="0.7" />
      </svg>
      <svg className="ci-twinkle absolute end-[5%] top-[37%] h-[24px] w-[24px] text-[var(--color-aslef-green)] lg:end-[7%] lg:top-[52%] lg:h-[40px] lg:w-[40px]" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
        <path d="M8 14l14-8" />
        <path d="M6 28l16-4" />
      </svg>
      <svg className="ci-float-slow absolute bottom-[1.5%] end-[3%] h-[44px] w-[60px] lg:bottom-auto lg:end-[4%] lg:top-[64%] lg:h-[90px] lg:w-[120px]" viewBox="0 0 120 90" fill="none" stroke="#F2C9A0" strokeWidth="2.4" strokeLinecap="round">
        <path d="M4 70c20 6 44 8 62-4 22-14 20-46-2-46-18 0-22 22-6 30 16 8 44 4 62-12" />
      </svg>
    </div>
  );
}
