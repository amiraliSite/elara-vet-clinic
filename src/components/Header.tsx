import React, { useEffect, useState } from 'react';
import { Images, Box, Stethoscope, Sparkles, CalendarCheck } from 'lucide-react';
import type { Language, TranslationBundle } from '../i18n/translations';

interface HeaderProps {
  t: TranslationBundle;
  lang: Language;
}

export const Header: React.FC<HeaderProps> = ({ t, lang }) => {
  const [activeId, setActiveId] = useState<string>('#sanctuary-slider');

  const navItems = [
    { href: '#sanctuary-slider', label: t.nav.sanctuary, icon: Images },
    { href: '#explorer-3d', label: t.nav.explorer3d, icon: Box },
    { href: '#specialties', label: t.nav.specialties, icon: Stethoscope },
    { href: '#gallery', label: t.nav.gallery, icon: Sparkles },
  ];

  useEffect(() => {
    const ids = ['#sanctuary-slider', '#explorer-3d', '#specialties', '#gallery', '#booking'];
    const handleScroll = () => {
      const y = window.scrollY + 180;
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.querySelector(ids[i]) as HTMLElement | null;
        if (el && el.offsetTop <= y) {
          setActiveId(ids[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Slim Non-Sticky Brand Bar on Mobile */}
      <div className="md:hidden bg-[#15100D] border-b border-[#D19A6B]/20 px-4 h-12 flex items-center justify-between">
        <a
          href="#sanctuary-slider"
          className={`font-semibold text-[#F5EFE8] whitespace-nowrap shrink-0 ${
            lang === 'fa' ? 'font-nastaliq text-xl py-0.5' : 'font-display text-lg'
          }`}
        >
          {t.brand}
        </a>
        <a
          href="#booking"
          className="btn-bronze-3d px-3.5 py-1.5 text-xs font-semibold text-[#1A120D] rounded-lg whitespace-nowrap shrink-0"
        >
          {t.nav.book}
        </a>
      </div>

      {/* Desktop 3D Sculpted Floating Navbar (3-Zone Top Bar Contract) */}
      <header className="hidden md:block sticky top-3 z-40 px-6 pointer-events-none">
        <div className="pointer-events-auto max-w-[1220px] mx-auto px-5 h-16 rounded-2xl bg-gradient-to-b from-[#251C17]/96 to-[#17110E]/96 border border-[#D19A6B]/30 nav-3d-shell flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#sanctuary-slider"
            className={`font-semibold text-[#F5EFE8] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D19A6B] ${
              lang === 'fa' ? 'font-nastaliq text-2xl py-1' : 'font-display text-xl tracking-tight'
            }`}
          >
            {t.brand}
          </a>

          {/* Zone 2: Recessed 3D Tactile Nav Plinth */}
          <nav
            aria-label="Primary"
            className="flex items-center gap-1.5 p-1 rounded-xl bg-[#110C09]/90 border border-[#D19A6B]/15 shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)]"
          >
            {navItems.map((item) => {
              const isActive = activeId === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setActiveId(item.href)}
                  className={`px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-b from-[#342720] to-[#241B16] text-[#F5EFE8] border border-[#D19A6B]/30 shadow-[0_4px_10px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,224,192,0.18)] -translate-y-[1px]'
                      : 'text-[#C8B9AB] hover:text-[#F5EFE8] hover:bg-white/5 hover:-translate-y-[1px]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Extruded 3D Bronze CTA */}
          <div className="shrink-0">
            <a
              href="#booking"
              className="btn-bronze-3d inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-[#18110C] rounded-xl transition-all duration-200 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D19A6B]"
            >
              {t.nav.book}
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Navigation Dock */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-2.5 inset-x-2.5 z-50 h-14 rounded-2xl bg-gradient-to-b from-[#241B16]/98 to-[#140F0C]/98 border border-[#D19A6B]/30 nav-3d-shell px-1.5 grid grid-cols-5 items-center gap-1"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeId === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setActiveId(item.href)}
              className={`h-11 rounded-xl flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-all px-1 ${
                isActive
                  ? 'bg-[#33261F] text-[#E6B283] border border-[#D19A6B]/30 shadow-[inset_0_1px_0_rgba(255,224,192,0.15)]'
                  : 'text-[#BFAE9E] hover:text-[#F5EFE8]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate max-w-full">{item.label}</span>
            </a>
          );
        })}

        <a
          href="#booking"
          onClick={() => setActiveId('#booking')}
          className={`h-11 rounded-xl flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold px-1 transition-all ${
            activeId === '#booking'
              ? 'btn-bronze-3d text-[#18110C]'
              : 'bg-[#B87B4B]/20 text-[#E6B283] border border-[#D19A6B]/30'
          }`}
        >
          <CalendarCheck className="w-4 h-4 shrink-0" />
          <span className="truncate max-w-full">{t.nav.book}</span>
        </a>
      </nav>
    </>
  );
};
