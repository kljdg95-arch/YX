import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LanguageProvider } from '@/i18n/language';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Background from '@/components/Background';
import Loader from '@/components/Loader';
import CommandPalette from '@/components/CommandPalette';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Technology from '@/pages/Technology';
import TechFieldDetail from '@/pages/TechFieldDetail';
import DivisionDetail from '@/pages/DivisionDetail';
import Projects from '@/pages/Projects';
import ProjectDetail from '@/pages/ProjectDetail';
import Labs from '@/pages/Labs';
import LabEntryDetail from '@/pages/LabEntryDetail';
import Journal from '@/pages/Journal';
import ArticleDetail from '@/pages/ArticleDetail';
import Roadmap from '@/pages/Roadmap';
import Innovation from '@/pages/Innovation';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/NotFound';
import Liner from '@/pages/Liner';
import LinerApp from '@/pages/LinerApp';
import Yqro from '@/pages/Yqro';
import YqroApp from '@/pages/YqroApp';
import Yxai, { YxaiApp } from '@/pages/Yxai';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

function Shell() {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="relative min-h-screen">
      <Loader />
      <Background />
      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
      <Navbar onOpenSearch={() => setSearchOpen(true)} />
      <main className="relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/technology/:slug" element={<TechFieldDetail />} />
          <Route path="/divisions/:slug" element={<DivisionDetail />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/labs" element={<Labs />} />
          <Route path="/labs/:slug" element={<LabEntryDetail />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/journal/:slug" element={<ArticleDetail />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/innovation" element={<Innovation />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/liner" element={<Liner />} />
          <Route path="/liner/app" element={<LinerApp />} />
          <Route path="/yqro" element={<Yqro />} />
          <Route path="/yqro/app" element={<YqroApp />} />
          <Route path="/yxai" element={<Yxai />} />
          <Route path="/yxai/app" element={<YxaiApp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Shell />
      </BrowserRouter>
    </LanguageProvider>
  );
}
