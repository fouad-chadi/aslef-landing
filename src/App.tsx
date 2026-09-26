import { MotionConfig } from 'framer-motion';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { RegistrationPage } from './pages/RegistrationPage';

function App() {
  const isRegistrationPage = typeof window !== 'undefined' && window.location.pathname.replace(/\/$/, '') === '/inscription';

  return (
    <MotionConfig reducedMotion="user">
      <LanguageProvider>
        <Navbar />
        {isRegistrationPage ? <RegistrationPage /> : <HomePage />}
        <Footer />
      </LanguageProvider>
    </MotionConfig>
  );
}

export default App;
