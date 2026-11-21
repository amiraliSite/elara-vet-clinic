import React from 'react';
import { motion } from 'motion/react';
import { CLINIC_IMAGES } from '../data/clinicMedia';
import { TiltCard3D } from './TiltCard3D';
import type { Language, TranslationBundle } from '../i18n/translations';

interface PhilosophySectionProps {
  t: TranslationBundle;
  lang: Language;
}

export const PhilosophySection: React.FC<PhilosophySectionProps> = ({ t, lang }) => {
  return (
    <section
      id="philosophy"
      className="relative py-20 md:py-24 bg-[#FFFBF5] border-b border-[#0D9488]/12 overflow-hidden"
    >
      {/* Joyful sunlit ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -end-24 w-[480px] h-[480px] rounded-full bg-[#FDBA74]/22 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -start-24 w-[420px] h-[420px] rounded-full bg-[#5EEAD4]/18 blur-3xl"
      />

      <div className="relative max-w-[1260px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col justify-center"
          >
            <p className="text-xs font-semibold text-[#EA580C] tracking-wide mb-2">
              {t.philosophy.kicker}
            </p>
            <h2
              className={`font-medium text-[#162A28] text-balance ${
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
              {t.philosophy.title}
            </h2>
            <p className="mt-4 text-[15px] md:text-base leading-relaxed text-[#455B58]">
              {t.philosophy.body}
            </p>
            <p
              className={`mt-5 pt-4 border-t border-[#0D9488]/15 text-lg text-[#0F766E] ${
                lang === 'fa' ? 'font-persian-display' : 'font-display italic'
              }`}
            >
              {t.philosophy.quote}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col perspective-stage"
          >
            <TiltCard3D
              intensity={4.5}
              className="flex-1 min-h-[280px] lg:min-h-[390px] rounded-2xl overflow-hidden bg-white border border-[#0D9488]/20 border-b-[4px] border-b-[#CCE6E1] shadow-[0_22px_54px_rgba(13,148,136,0.14)]"
            >
              <img
                src={CLINIC_IMAGES.hero}
                alt={t.philosophy.imageCaption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-[1.02]"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#132A27]/85 via-[#132A27]/30 to-transparent" />
              <p className="absolute inset-x-0 bottom-0 px-5 py-3.5 text-xs font-medium text-[#FFFBF5]">
                {t.philosophy.imageCaption}
              </p>
            </TiltCard3D>
          </motion.div>
        </div>

        {/* Full-Width 4-Column Quantitative Proof Strip */}
        <div className="mt-12 pt-10 border-t border-[#0D9488]/15 grid grid-cols-2 lg:grid-cols-4 gap-5">
          {t.philosophy.metrics.map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col p-5 rounded-2xl bg-white border border-[#EED9BF] border-b-[3px] border-b-[#E3C8A8] shadow-[0_10px_24px_rgba(249,115,22,0.06)]"
            >
              <span
                className={`font-display text-3xl md:text-4xl font-medium tabular-nums ${
                  idx % 2 === 0 ? 'text-[#EA580C]' : 'text-[#0F766E]'
                }`}
              >
                {metric.value}
              </span>
              <span className="mt-1.5 text-sm font-medium text-[#455B58]">{metric.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
