import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { Language, TranslationBundle } from '../i18n/translations';

interface HeaderProps {
  t: TranslationBundle;
  lang: Language;
}

export const Header: React.FC<HeaderProps> = ({ t, lang }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: '#sanctuary-slider', label: t.nav.sanctuary },
    { href: '#explorer-3d', label: t.nav.explorer3d },
    { href: '#specialties', label: t.nav.specialties },
    { href: '#gallery', label: t.nav.gallery },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0F1714]/96 border-b border-[#D4AF63]/20 shadow-[0_10px_30px_rgba(0,0,0,0.32)]">
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#sanctuary-slider"
          className={`text-xl font-semibold text-[#F6F5F0] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF63] ${
            lang === 'fa' ? 'font-nastaliq text-2xl py-1' : 'font-display tracking-tight'
          }`}
        >
          {t.brand}
        </a>

        {/* Zone 2: Clean single-line 3D elevated nav links */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#C8D3CD]"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative py-1.5 hover:text-[#F6F5F0] transition-all duration-200 hover:-translate-y-[1px] whitespace-nowrap shrink-0 after:content-[''] after:absolute after:inset-x-0 after:bottom-0 after:h-[1.5px] after:bg-[#D4AF63] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single Primary 3D Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="#booking"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-[#111916] bg-gradient-to-b from-[#E3C178] to-[#C29B4D] hover:from-[#ECD08D] hover:to-[#CEA758] rounded-lg shadow-[0_4px_14px_rgba(212,175,99,0.28),inset_0_1px_0_rgba(255,255,255,0.45)] hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF63]"
          >
            {t.nav.book}
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            className="md:hidden p-2 rounded-lg text-[#D8DFDB] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#111A16] px-6 py-4 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-medium text-[#D8DFDB] hover:text-[#D4AF63] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
