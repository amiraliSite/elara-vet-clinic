import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { VetHeroSlider3D } from '../scene/VetHeroSlider3D';
import { CLINIC_IMAGES } from '../data/clinicMedia';
import type { Language, TranslationBundle } from '../i18n/translations';

interface Hero3DSliderProps {
  t: TranslationBundle;
  lang: Language;
}

export const Hero3DSlider: React.FC<Hero3DSliderProps> = ({ t, lang }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const slider3DRef = useRef<VetHeroSlider3D | null>(null);

  const [activeSlide, setActiveSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [webglFailed, setWebglFailed] = useState(false);

  const slides = t.hero.slides;
  const totalSlides = slides.length;
  const current = slides[activeSlide] ?? slides[0];

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

  useEffect(() => {
    slider3DRef.current?.setDirection(t.dir);
  }, [t.dir]);

  useEffect(() => {
    slider3DRef.current?.setActiveSlide(activeSlide);
  }, [activeSlide]);

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
      className="relative w-full min-h-[680px] lg:h-[calc(100vh-1rem)] lg:max-h-[900px] bg-[#FAF2E7] overflow-hidden select-none lg:-mt-[84px] lg:pt-[84px] border-b border-[#0D9488]/15"
    >
      {/* Dedicated Three.js Sunlit 3D Photo Carousel Viewport */}
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
          <div className="absolute inset-0 bg-[#FAF2E7]/65" />
        </div>
      )}

      {/* Bright Sunlit Cream Readability Scrims */}
      <div
        className={`pointer-events-none absolute inset-0 ${
          t.dir === 'rtl'
            ? 'bg-gradient-to-l from-[#FFFBF4]/95 via-[#FFFBF4]/72 to-transparent'
            : 'bg-gradient-to-r from-[#FFFBF4]/95 via-[#FFFBF4]/72 to-transparent'
        }`}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#FFFBF4] via-[#FFFBF4]/68 to-transparent" />

      {/* Main Hero Overlay Grid */}
      <div className="relative z-10 max-w-[1260px] mx-auto px-6 h-full min-h-[640px] flex flex-col justify-between py-7 md:py-10 pointer-events-none">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="max-w-xl pointer-events-auto animate-calm-enter">
            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-[#FFF0DD] border border-[#FDBA74]/70 text-xs font-semibold text-[#C2410C] mb-3 shadow-xs">
              {t.hero.kicker}
            </p>

            <h1
              className={`font-medium text-[#162A28] text-balance ${
                lang === 'fa'
                  ? 'font-persian-display leading-[1.32]'
                  : 'font-display leading-[1.12] tracking-tight'
              }`}
              style={{
                fontSize:
                  lang === 'fa'
                    ? 'clamp(2.05rem, 3.6vw, 3.25rem)'
                    : 'clamp(2.1rem, 3.8vw, 3.4rem)',
              }}
            >
              {t.hero.title}
            </h1>

            <p
              className={`mt-2.5 text-base md:text-lg text-[#0F766E] ${
                lang === 'fa' ? 'font-persian-display leading-relaxed' : 'font-display italic'
              }`}
            >
              {t.hero.motto}
            </p>

            <p className="mt-3 text-sm md:text-[15px] leading-relaxed text-[#455B58] max-w-lg">
              {t.hero.subtitle}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3.5">
              <a
                href="#booking"
                className="btn-joy-3d px-6 py-3 text-sm font-bold rounded-xl text-white transition-all duration-200 whitespace-nowrap shrink-0"
              >
                {t.hero.primaryCta}
              </a>
              <a
                href="#explorer-3d"
                className="btn-teal-3d px-6 py-3 text-sm font-bold rounded-xl text-white transition-all duration-200 whitespace-nowrap shrink-0"
              >
                {t.hero.secondaryCta}
              </a>
            </div>
          </div>

          <div className="pointer-events-auto self-start lg:self-auto hidden sm:block">
            <p className="px-3.5 py-2 rounded-xl bg-white/90 border border-[#0D9488]/20 border-b-[3px] border-b-[#CCE6E1] text-[11px] font-medium text-[#3F5956] shadow-sm">
              {t.hero.slideHint}
            </p>
          </div>
        </div>

        {/* Bottom 3D Slider Caption & Controls Bar */}
        <div className="pointer-events-auto mt-8 rounded-2xl bg-[#FFFDF9]/95 border border-[#0D9488]/20 border-b-[4px] border-b-[#CFE5E0] px-5 py-4 shadow-[0_18px_42px_rgba(13,148,136,0.13)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 text-xs text-[#EA580C] font-semibold mb-1">
              <span className="tabular-nums">
                {lang === 'fa'
                  ? `${(activeSlide + 1).toLocaleString('fa-IR', { minimumIntegerDigits: 2 })} / ${totalSlides.toLocaleString('fa-IR', { minimumIntegerDigits: 2 })}`
                  : `${String(activeSlide + 1).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-[#0D9488]">{current.tag}</span>
            </div>
            <h2
              className={`text-base md:text-lg font-medium text-[#162A28] truncate ${
                lang === 'fa' ? 'font-persian-display' : 'font-display'
              }`}
            >
              {current.title}
            </h2>
            <p className="text-xs md:text-sm text-[#4D6260] mt-0.5 line-clamp-1">
              {current.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 me-2">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  aria-label={s.title}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeSlide
                      ? 'w-7 bg-[#F97316]'
                      : 'w-2.5 bg-[#0D9488]/25 hover:bg-[#0D9488]/55'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setAutoPlay((p) => !p)}
              aria-label={autoPlay ? t.hero.autoPlayOff : t.hero.autoPlayOn}
              title={autoPlay ? t.hero.autoPlayOff : t.hero.autoPlayOn}
              className="p-2 rounded-xl bg-[#F3FAF8] hover:bg-[#E2F4F0] border border-[#0D9488]/25 border-b-[2px] border-b-[#99D6CD] text-[#0F766E] transition-colors cursor-pointer"
            >
              {autoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={t.dir === 'rtl' ? goNext : goPrev}
              aria-label={t.hero.prevSlide}
              className="p-2 rounded-xl bg-[#F3FAF8] hover:bg-[#E2F4F0] border border-[#0D9488]/25 border-b-[2px] border-b-[#99D6CD] text-[#0F766E] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={t.dir === 'rtl' ? goPrev : goNext}
              aria-label={t.hero.nextSlide}
              className="p-2 rounded-xl bg-[#F3FAF8] hover:bg-[#E2F4F0] border border-[#0D9488]/25 border-b-[2px] border-b-[#99D6CD] text-[#0F766E] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
