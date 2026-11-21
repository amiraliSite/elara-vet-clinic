import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CLINIC_IMAGES } from '../data/clinicMedia';
import { TiltCard3D } from './TiltCard3D';
import type { GalleryFilter, Language, TranslationBundle } from '../i18n/translations';

interface GallerySectionProps {
  t: TranslationBundle;
  lang: Language;
}

const FILTER_KEYS: GalleryFilter[] = ['all', 'canine', 'feline', 'team'];

export const GallerySection: React.FC<GallerySectionProps> = ({ t, lang }) => {
  const [filter, setFilter] = useState<GalleryFilter>('all');

  const visibleCards =
    filter === 'all'
      ? t.gallery.cards
      : t.gallery.cards.filter((card) => card.category === filter);

  return (
    <section id="gallery" className="py-20 md:py-24 bg-[#F5EFE8] border-b border-[#8C5630]/15">
      <div className="max-w-[1280px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
        >
          <div className="max-w-xl">
            <p className="text-xs font-medium text-[#9A6035] tracking-wide mb-2">
              {t.gallery.kicker}
            </p>
            <h2
              className={`font-medium text-[#221914] text-balance ${
                lang === 'fa'
                  ? 'font-persian-display leading-[1.35]'
                  : 'font-display leading-[1.15] tracking-tight'
              }`}
              style={{
                fontSize:
                  lang === 'fa'
                    ? 'clamp(1.85rem, 2.9vw, 2.65rem)'
                    : 'clamp(1.75rem, 2.8vw, 2.5rem)',
              }}
            >
              {t.gallery.title}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[#5C4B40]">
              {t.gallery.subtitle}
            </p>
          </div>

          <div
            role="tablist"
            aria-label={t.gallery.kicker}
            className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[#EBE2D7] border border-[#8C5630]/18 self-start"
          >
            {FILTER_KEYS.map((key) => {
              const active = filter === key;
              return (
                <button
                  key={key}
                  role="tab"
                  aria-selected={active}
                  type="button"
                  onClick={() => setFilter(key)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#B87B4B] text-[#18110C] font-semibold shadow-xs'
                      : 'text-[#5C4B40] hover:text-[#221914]'
                  }`}
                >
                  {t.gallery.filters[key]}
                </button>
              );
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 perspective-stage">
          {visibleCards.map((card) => (
            <TiltCard3D
              key={card.id}
              intensity={4}
              className={`group relative rounded-2xl overflow-hidden bg-[#DFD2C3] border border-[#8C5630]/20 shadow-[0_18px_44px_rgba(34,25,20,0.14)] ${
                card.wide && filter === 'all' ? 'md:col-span-2 aspect-[16/9] md:aspect-[21/10]' : 'aspect-[4/3]'
              }`}
            >
              <img
                src={CLINIC_IMAGES[card.imageKey]}
                alt={card.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#140E0A]/90 via-[#140E0A]/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-7 text-[#F5EFE8]">
                <p className="text-xs text-[#E0AA7A] font-medium mb-1">
                  {card.meta}
                </p>
                <h3 className="font-display text-xl md:text-2xl font-medium leading-snug">
                  {card.title}
                </h3>
                <p className="mt-1.5 text-sm text-[#E5D8CB] max-w-2xl leading-relaxed">
                  {card.description}
                </p>
              </div>
            </TiltCard3D>
          ))}
        </div>
      </div>
    </section>
  );
};
