import React, { useEffect, useState } from 'react';
import { Images, Box, Stethoscope, Sparkles, CalendarCheck } from 'lucide-react';
import type { Language, TranslationBundle } from '../i18n/translations';

interface HeaderProps {
  t: TranslationBundle;
  lang: Language;
  onChangeLang: (lang: Language) => void;
}

const ClinicEmblem3D: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'md' }) => (
  <span
    aria-hidden="true"
    className={`badge-3d-emblem relative inline-flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3 ${
      size === 'sm' ? 'w-9 h-9 rounded-xl' : 'w-11 h-11 rounded-2xl'
    }`}
  >
    <span className="pointer-events-none absolute inset-x-1 top-0.5 h-1/3 rounded-full bg-white/30" />
    <svg
      viewBox="0 0 36 36"
      className={size === 'sm' ? 'w-5 h-5' : 'w-6 h-6'}
      fill="none"
    >
      <circle cx="10.5" cy="13" r="2.7" fill="#FFFBF5" />
      <circle cx="18" cy="9.5" r="2.8" fill="#FFFBF5" />
      <circle cx="25.5" cy="13" r="2.7" fill="#FFFBF5" />
      <path
        d="M18 28.5c-4.9 0-8.6-3.1-8.6-6.8 0-2.9 2.3-5.4 5.3-6 1.2-.25 2.35.2 3.3 1.05.95-.85 2.1-1.3 3.3-1.05 3 .6 5.3 3.1 5.3 6 0 3.7-3.7 6.8-8.6 6.8Z"
        fill="#FFFBF5"
      />
      <path
        d="M18 19.3v4.4M15.8 21.5h4.4"
        stroke="#0D9488"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
    </svg>
  </span>
);

export const Header: React.FC<HeaderProps> = ({ t, lang, onChangeLang }) => {
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
      {/* Mobile Top Bar with 3D Emblem Icon + Language Switcher */}
      <div className="md:hidden bg-[#FFF9F1] border-b-2 border-[#EEDCC6] px-4 h-14 flex items-center justify-between gap-2 shadow-xs">
        <a
          href="#sanctuary-slider"
          className="group flex items-center gap-2.5 whitespace-nowrap shrink-0"
        >
          <ClinicEmblem3D size="sm" />
          <span
            className={`font-semibold text-[#172A28] ${
              lang === 'fa' ? 'font-persian-display text-xl' : 'font-display text-lg'
            }`}
          >
            {t.brand}
          </span>
        </a>

        {/* Tactile 3D Bilingual Toggle on Mobile Header */}
        <div
          role="group"
          aria-label="Language Switcher"
          className="nav-tray-3d inline-flex items-center gap-1 p-1 rounded-xl border border-[#DFCBB2]"
        >
          {(
            [
              { code: 'fa', label: 'فارسی' },
              { code: 'en', label: 'EN' },
            ] as const
          ).map((item) => {
            const active = lang === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => onChangeLang(item.code)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  active
                    ? 'nav-pill-3d-active text-[#0F766E]'
                    : 'text-[#5A6E6B] hover:text-[#172A28]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop 3D Tactile Sculpted Floating Navbar */}
      <header className="hidden md:block sticky top-3.5 z-40 px-5 pointer-events-none">
        <div
          className="pointer-events-auto max-w-[1260px] mx-auto px-4 lg:px-5 h-[72px] rounded-[24px] border border-[#EED9BF] nav-3d-joy flex items-center justify-between gap-4 transition-transform duration-300"
        >
          {/* Zone 1: 3D Clinic Emblem Icon + Brand Wordmark */}
          <a
            href="#sanctuary-slider"
            className="group flex items-center gap-3 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0D9488]"
          >
            <ClinicEmblem3D size="md" />
            <span
              className={`font-semibold text-[#172A28] transition-colors group-hover:text-[#0F766E] ${
                lang === 'fa' ? 'font-persian-display text-2xl' : 'font-display text-xl tracking-tight'
              }`}
            >
              {t.brand}
            </span>
          </a>

          {/* Zone 2: Recessed 3D Tactile Nav Tray with Pop-up Icon Pills */}
          <nav
            aria-label="Primary"
            className="nav-tray-3d flex items-center gap-1.5 p-1.5 rounded-2xl border border-[#DFCBB2]/80"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeId === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setActiveId(item.href)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs lg:text-sm font-semibold rounded-xl transition-all duration-200 whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'nav-pill-3d-active text-[#0F766E] -translate-y-0.5'
                      : 'text-[#4D6260] hover:text-[#172A28] hover:bg-white/75 hover:-translate-y-0.5'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-[#F97316]' : 'text-[#0D9488]/75'
                    }`}
                  />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Bilingual 3D Switcher + Extruded 3D Coral CTA */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div
              role="group"
              aria-label="Language Switcher"
              className="nav-tray-3d inline-flex items-center gap-1 p-1 rounded-xl border border-[#DFCBB2]/80"
            >
              {(
                [
                  { code: 'fa', label: 'فارسی' },
                  { code: 'en', label: 'English' },
                ] as const
              ).map((item) => {
                const active = lang === item.code;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => onChangeLang(item.code)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'nav-pill-3d-active text-[#0F766E] -translate-y-[1px]'
                        : 'text-[#5A6E6B] hover:text-[#172A28] hover:bg-white/60'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <a
              href="#booking"
              className="btn-joy-3d inline-flex items-center gap-1.5 px-4 lg:px-5 py-2.5 text-xs lg:text-sm font-bold text-white rounded-xl transition-all duration-200 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F97316]"
            >
              <CalendarCheck className="w-4 h-4 shrink-0" />
              <span>{t.nav.book}</span>
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom 3D Navigation Dock */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-2.5 inset-x-2.5 z-50 h-16 rounded-2xl border border-[#EED9BF] nav-3d-joy px-1.5 grid grid-cols-5 items-center gap-1"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeId === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setActiveId(item.href)}
              className={`h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-all px-1 ${
                isActive
                  ? 'nav-pill-3d-active text-[#0F766E] -translate-y-0.5'
                  : 'text-[#546966] hover:text-[#172A28]'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#F97316]' : 'text-[#0D9488]'}`} />
              <span className="truncate max-w-full">{item.label}</span>
            </a>
          );
        })}

        <a
          href="#booking"
          onClick={() => setActiveId('#booking')}
          className={`h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold px-1 transition-all ${
            activeId === '#booking'
              ? 'btn-joy-3d text-white -translate-y-0.5'
              : 'bg-[#FFF1E0] text-[#EA580C] border border-[#FDBA74] border-b-[3px] border-b-[#F97316]'
          }`}
        >
          <CalendarCheck className="w-4 h-4 shrink-0" />
          <span className="truncate max-w-full">{t.nav.book}</span>
        </a>
      </nav>
    </>
  );
};
