import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Hero3DSlider } from './components/Hero3DSlider';
import { PhilosophySection } from './components/PhilosophySection';
import { VetCanvas3D } from './components/VetCanvas3D';
import { SpecialtiesSection } from './components/SpecialtiesSection';
import { GallerySection } from './components/GallerySection';
import { BookingSection } from './components/BookingSection';
import { Footer } from './components/Footer';
import { TRANSLATIONS, type Language } from './i18n/translations';

export default function App() {
  const [lang, setLang] = useState<Language>('fa');
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;
  }, [lang, t.dir]);

  return (
    <div dir={t.dir} className="min-h-screen bg-[#F6F5F0] text-[#17201C] flex flex-col">
      <Header t={t} lang={lang} />
      <main className="flex-1">
        <Hero3DSlider t={t} lang={lang} onChangeLang={setLang} />
        <PhilosophySection t={t} lang={lang} />
        <VetCanvas3D t={t} lang={lang} />
        <SpecialtiesSection t={t} lang={lang} />
        <GallerySection t={t} lang={lang} />
        <BookingSection t={t} lang={lang} />
      </main>
      <Footer t={t} lang={lang} onChangeLang={setLang} />
    </div>
  );
}
