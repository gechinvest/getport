import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import Home from './pages/Home';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Experience from './components/Experience'; 
import Socials from './pages/Socials';
import NotFound from './pages/NotFound';
import About from './components/About';
import Admin from './pages/Admin';

function AppContent() {
  const { loading: portfolioLoading } = usePortfolio();
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Route - No Navbar/Footer */}
        <Route path="/admin" element={<Admin />} />
        
        {/* All Other Routes - With Navbar/Footer */}
        <Route path="*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/socials" element={<Socials />} />
              <Route path='/skills' element={<Skills />} />
              <Route path='/about' element={<About />} />
              <Route path='/projects' element={<Projects />} />
              <Route path='/experience' element={<Experience />} />
              <Route path='/contact' element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider>
      <PortfolioProvider>
        <AppContent />
      </PortfolioProvider>
    </ThemeProvider>
  );
}

export default App;