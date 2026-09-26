import { useEffect } from 'react';
import { Hero } from '../components/Hero';
import { TrustBar } from '../components/TrustBar';
import { ProblemSolution } from '../components/ProblemSolution';
import { Roles } from '../components/Roles';
import { Security } from '../components/Security';
import { HowItWorks } from '../components/HowItWorks';
import { About } from '../components/About';
import { FAQ } from '../components/FAQ';
import { FinalCTA } from '../components/FinalCTA';

export function HomePage() {
  useEffect(() => {
    if (!window.location.hash) return;
    const el = document.querySelector(window.location.hash);
    el?.scrollIntoView();
  }, []);

  return (
    <main>
      <Hero />
      <TrustBar />
      <ProblemSolution />
      <Roles />
      <Security />
      <HowItWorks />
      <About />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
