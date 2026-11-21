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
    <section id="philosophy" className="py-20 md:py-24 bg-[#F6F5F0] border-b border-[#17201C]/10">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col justify-center"
          >
            <p className="text-xs font-medium text-[#2D5A4C] tracking-wide mb-2">
              {t.philosophy.kicker}
            </p>
            <h2
              className={`font-medium text-[#17201C] text-balance ${
                lang === 'fa'
                  ? 'font-nastaliq leading-[2.05] py-1'
                  : 'font-display leading-[1.15] tracking-tight'
              }`}
              style={{
                fontSize:
                  lang === 'fa'
                    ? 'clamp(1.55rem, 2.5vw, 2.25rem)'
                    : 'clamp(1.75rem, 2.8vw, 2.5rem)',
              }}
            >
              {t.philosophy.title}
            </h2>
            <p className="mt-4 text-[15px] md:text-base leading-relaxed text-[#47544D]">
              {t.philosophy.body}
            </p>
            <p
              dir="rtl"
              lang="fa"
              className="mt-5 pt-4 border-t border-[#17201C]/10 font-nastaliq text-lg text-[#2D5A4C] leading-[2.1]"
            >
              {t.philosophy.calligraphyQuote}
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
              className="flex-1 min-h-[280px] lg:min-h-[390px] rounded-xl overflow-hidden bg-[#E5E2D7] border border-[#17201C]/12 shadow-[0_20px_50px_rgba(23,32,28,0.14)]"
            >
              <img
                src={CLINIC_IMAGES.hero}
                alt={t.philosophy.imageCaption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-[1.02]"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#101815]/85 via-[#101815]/35 to-transparent" />
              <p className="absolute inset-x-0 bottom-0 px-5 py-3.5 text-xs text-[#F6F5F0]/95">
                {t.philosophy.imageCaption}
              </p>
            </TiltCard3D>
          </motion.div>
        </div>

        {/* Full-Width 4-Column Quantitative Proof Strip */}
        <div className="mt-12 pt-10 border-t border-[#17201C]/10 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {t.philosophy.metrics.map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col"
            >
              <span className="font-display text-3xl md:text-4xl font-medium text-[#17201C] tabular-nums">
                {metric.value}
              </span>
              <span className="mt-1.5 text-sm text-[#47544D]">{metric.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
