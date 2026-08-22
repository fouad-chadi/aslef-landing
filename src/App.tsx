import { MotionConfig } from 'framer-motion';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustBar } from './components/TrustBar';
import { ProblemSolution } from './components/ProblemSolution';
import { Roles } from './components/Roles';
import { Features } from './components/Features';
import { ProductShowcase } from './components/ProductShowcase';
import { Security } from './components/Security';
import { HowItWorks } from './components/HowItWorks';
import { About } from './components/About';
import { FAQ } from './components/FAQ';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LanguageProvider>
        <Navbar />
        <main>
          <Hero />
          <TrustBar />
          <ProblemSolution />
          <Roles />
          <Features />
          <ProductShowcase />
          <Security />
          <HowItWorks />
          <About />
          <FAQ />
          <FinalCTA />
        </main>
        <Footer />
      </LanguageProvider>
    </MotionConfig>
  );
}

export default App;
