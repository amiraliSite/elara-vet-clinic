import React from 'react';
import type { Language, TranslationBundle } from '../i18n/translations';

interface FooterProps {
  t: TranslationBundle;
  lang: Language;
  onChangeLang: (lang: Language) => void;
}

export const Footer: React.FC<FooterProps> = ({ t, lang, onChangeLang }) => {
  return (
    <footer className="bg-[#0F1714] text-[#D8DFDB] py-14 border-t border-white/10">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/10">
          <div className="md:col-span-4">
            <a
              href="#sanctuary-slider"
              className={`font-semibold text-[#F6F5F0] ${
                lang === 'fa' ? 'font-nastaliq text-2xl' : 'font-display text-xl'
              }`}
            >
              {t.brand}
            </a>
            <p className="mt-2.5 text-sm text-[#9FB0A7] leading-relaxed max-w-xs">
              {t.footer.tagline}
            </p>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold text-[#D4AF63] mb-2">
              {t.footer.hoursTitle}
            </h4>
            <p className="text-sm text-[#DCE3DF] tabular-nums">{t.footer.hoursDetail}</p>
            <p className="mt-1 text-xs text-[#9FB0A7]">{t.footer.emergencyDetail}</p>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold text-[#D4AF63] mb-2">
              {t.footer.locationsTitle}
            </h4>
            <p className="text-sm text-[#DCE3DF] leading-relaxed">{t.footer.locationsDetail}</p>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold text-[#D4AF63] mb-2">
              {t.footer.languageTitle}
            </h4>
            <div className="flex flex-col items-start gap-1.5 text-sm">
              {(
                [
                  { code: 'fa', label: 'فارسی' },
                  { code: 'en', label: 'English' },
                  { code: 'de', label: 'Deutsch' },
                ] as const
              ).map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => onChangeLang(item.code)}
                  className={`transition-colors cursor-pointer ${
                    lang === item.code
                      ? 'text-[#F6F5F0] font-medium underline underline-offset-4 decoration-[#D4AF63]'
                      : 'text-[#9FB0A7] hover:text-[#F6F5F0]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#8E9E95]">
          <p>{t.footer.copyright}</p>
          <div className="flex items-center gap-5">
            <a href="#sanctuary-slider" className="hover:text-[#F6F5F0] transition-colors">
              {t.nav.sanctuary}
            </a>
            <a href="#explorer-3d" className="hover:text-[#F6F5F0] transition-colors">
              {t.nav.explorer3d}
            </a>
            <a href="#specialties" className="hover:text-[#F6F5F0] transition-colors">
              {t.nav.specialties}
            </a>
            <a href="#gallery" className="hover:text-[#F6F5F0] transition-colors">
              {t.nav.gallery}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
