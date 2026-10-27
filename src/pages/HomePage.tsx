import { useEffect } from 'react';
import { Hero } from '../components/Hero';
import { ClientLogos } from '../components/ClientLogos';
import { ProblemSolution } from '../components/ProblemSolution';
import { DayStory } from '../components/DayStory';
import { Roles } from '../components/Roles';
import { DemoVideo } from '../components/DemoVideo';
import { Security } from '../components/Security';
import { HowItWorks } from '../components/HowItWorks';
import { About } from '../components/About';
import { FinalCTA } from '../components/FinalCTA';

export function HomePage() {
  // Opening the page on a #hash (shared link, reload, back/forward). The layout above the target keeps
  // moving for a moment after load (web fonts, images, hydration), which pushes the target away from
  // where the browser first scrolled to and leaves the visitor at the wrong place. So: jump there
  // instantly, then re-align each time the page height changes - until the visitor scrolls, taps or
  // presses a key (their input always wins), or 3 seconds have passed.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;

    const align = () => document.getElementById(id)?.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'start' });
    align();

    const observer = new ResizeObserver(align);
    observer.observe(document.body);
    void document.fonts?.ready.then(align);

    const events = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;
    const stop = () => {
      observer.disconnect();
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, stop));
    };
    const timer = window.setTimeout(stop, 3000);
    events.forEach((e) => window.addEventListener(e, stop, { passive: true }));
    return stop;
  }, []);

  return (
    <main id="main">
      <Hero />
      <ProblemSolution />
      <Roles />
      <HowItWorks />
      <DayStory />
      <DemoVideo />
      <Security />
      <About />
      <ClientLogos />
      <FinalCTA />
    </main>
  );
}
