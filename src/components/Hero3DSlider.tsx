import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { VetHeroSlider3D } from '../scene/VetHeroSlider3D';
import { CLINIC_IMAGES } from '../data/clinicMedia';
import type { Language, TranslationBundle } from '../i18n/translations';

interface Hero3DSliderProps {
  t: TranslationBundle;
  lang: Language;
  onChangeLang: (lang: Language) => void;
}

export const Hero3DSlider: React.FC<Hero3DSliderProps> = ({ t, lang, onChangeLang }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const slider3DRef = useRef<VetHeroSlider3D | null>(null);

  const [activeSlide, setActiveSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [webglFailed, setWebglFailed] = useState(false);

  const slides = t.hero.slides;
  const totalSlides = slides.length;
  const current = slides[activeSlide] ?? slides[0];

  // Mount Three.js 3D curved photo gallery
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const slider = new VetHeroSlider3D(container, {
      onSelectSlide: (idx) => {
        setActiveSlide(idx);
      },
      onWebGLUnavailable: () => {
        setWebglFailed(true);
      },
    });
    slider3DRef.current = slider;

    return () => {
      slider.dispose();
      slider3DRef.current = null;
    };
  }, []);

  // Sync RTL/LTR spatial bias and active slide with Three.js stage
  useEffect(() => {
    slider3DRef.current?.setDirection(t.dir);
  }, [t.dir]);

  useEffect(() => {
    slider3DRef.current?.setActiveSlide(activeSlide);
  }, [activeSlide]);

  // Automatic 3D photo slide timer (every 4.2s)
  useEffect(() => {
    if (!autoPlay) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [autoPlay, totalSlides, activeSlide]);

  const goPrev = () => {
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goNext = () => {
    setActiveSlide((prev) => (prev + 1) % totalSlides);
  };

  return (
    <section
      id="sanctuary-slider"
      className="relative w-full min-h-[700px] lg:h-[calc(100vh-4rem)] lg:max-h-[900px] bg-[#0E1613] overflow-hidden select-none"
    >
      {/* Dedicated Three.js 3D Photo Carousel Viewport */}
      {!webglFailed ? (
        <div
          ref={mountRef}
          dir="ltr"
          className="absolute inset-0 w-full h-full"
          aria-label="3D Architectural Veterinary Photo Slider"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full">
          <img
            src={CLINIC_IMAGES[current.imageKey]}
            alt={current.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-[#0E1613]/60" />
        </div>
      )}

      {/* Measured contrast scrims so editorial typography reads crisply on any slide */}
      <div
        className={`pointer-events-none absolute inset-0 ${
          t.dir === 'rtl'
            ? 'bg-gradient-to-l from-[#0B120F]/92 via-[#0B120F]/55 to-transparent'
            : 'bg-gradient-to-r from-[#0B120F]/92 via-[#0B120F]/55 to-transparent'
        }`}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#0B120F] via-[#0B120F]/65 to-transparent" />

      {/* Main Hero Overlay Grid */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 h-full min-h-[700px] flex flex-col justify-between py-7 md:py-9 pointer-events-none">
        {/* Top Row: Editorial Content + Trilingual Switcher */}
        <div className="flex flex-col-reverse lg:flex-row lg:items-start justify-between gap-6">
          <div className="max-w-xl pointer-events-auto animate-calm-enter">
            <p className="text-xs font-medium text-[#D4AF63] tracking-wide mb-2">
              {t.hero.kicker}
            </p>

            <h1
              className={`font-medium text-[#F6F5F0] text-balance ${
                lang === 'fa'
                  ? 'font-nastaliq leading-[2.05] py-1'
                  : 'font-display leading-[1.12] tracking-tight'
              }`}
              style={{
                fontSize:
                  lang === 'fa'
                    ? 'clamp(1.75rem, 3.1vw, 2.75rem)'
                    : 'clamp(2.1rem, 3.8vw, 3.4rem)',
              }}
            >
              {t.hero.title}
            </h1>

            {/* Persian Nastaliq Calligraphic Motto */}
            <p
              dir="rtl"
              lang="fa"
              className="mt-2 font-nastaliq text-base md:text-lg text-[#E8C988] leading-[2.1] py-0.5"
            >
              {t.hero.nastaliqVerse}
            </p>

            <p className="mt-3 text-sm md:text-[15px] leading-relaxed text-[#D8DFDB] max-w-lg">
              {t.hero.subtitle}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="#booking"
                className="px-5 py-2.5 text-sm font-medium rounded-lg bg-[#2D5A4C] hover:bg-[#386E5D] text-[#F6F5F0] shadow-[0_6px_18px_rgba(45,90,76,0.4)] hover:-translate-y-[1px] transition-all duration-200 whitespace-nowrap shrink-0"
              >
                {t.hero.primaryCta}
              </a>
              <a
                href="#explorer-3d"
                className="px-5 py-2.5 text-sm font-medium rounded-lg bg-[#16201C]/95 hover:bg-[#1F2D27] border border-[#D4AF63]/35 text-[#F6F5F0] hover:-translate-y-[1px] transition-all duration-200 whitespace-nowrap shrink-0"
              >
                {t.hero.secondaryCta}
              </a>
            </div>
          </div>

          {/* Trilingual Segmented Switcher */}
          <div className="pointer-events-auto self-start lg:self-auto flex flex-col items-start lg:items-end gap-2">
            <div
              role="group"
              aria-label="Language Switcher"
              className="inline-flex items-center gap-1 p-1 rounded-lg bg-[#101815]/95 border border-[#D4AF63]/25 shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
            >
              {(
                [
                  { code: 'fa', label: 'FA · فارسی' },
                  { code: 'en', label: 'EN · English' },
                  { code: 'de', label: 'DE · Deutsch' },
                ] as const
              ).map((item) => {
                const active = lang === item.code;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => onChangeLang(item.code)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-[#2D5A4C] text-[#F6F5F0]'
                        : 'text-[#C2CCC7] hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-[#B7C3BD] hidden sm:block">
              {t.hero.slideHint}
            </p>
          </div>
        </div>

        {/* Bottom 3D Slider Caption & Controls Bar */}
        <div className="pointer-events-auto mt-8 rounded-xl bg-[#101815]/95 border border-white/15 px-5 py-4 shadow-[0_14px_38px_rgba(0,0,0,0.45)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 text-xs text-[#D4AF63] font-medium mb-1">
              <span className="tabular-nums">
                {String(activeSlide + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
              </span>
              <span aria-hidden="true">·</span>
              <span>{current.tag}</span>
            </div>
            <h2
              className={`text-base md:text-lg font-medium text-[#F6F5F0] truncate ${
                lang === 'fa' ? 'font-sans' : 'font-display'
              }`}
            >
              {current.title}
            </h2>
            <p className="text-xs md:text-sm text-[#B7C3BD] mt-0.5 line-clamp-1">
              {current.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Slide Selector Dots */}
            <div className="hidden sm:flex items-center gap-1.5 me-2">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  aria-label={s.title}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeSlide
                      ? 'w-7 bg-[#D4AF63]'
                      : 'w-2 bg-white/25 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setAutoPlay((p) => !p)}
              aria-label={autoPlay ? t.hero.autoPlayOff : t.hero.autoPlayOn}
              title={autoPlay ? t.hero.autoPlayOff : t.hero.autoPlayOn}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/12 border border-white/10 text-[#E5E2D7] transition-colors cursor-pointer"
            >
              {autoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={t.dir === 'rtl' ? goNext : goPrev}
              aria-label={t.hero.prevSlide}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/12 border border-white/10 text-[#E5E2D7] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={t.dir === 'rtl' ? goPrev : goNext}
              aria-label={t.hero.nextSlide}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/12 border border-white/10 text-[#E5E2D7] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
