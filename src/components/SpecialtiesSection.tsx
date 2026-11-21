import React from 'react';
import { motion } from 'motion/react';
import { CLINIC_IMAGES } from '../data/clinicMedia';
import { TiltCard3D } from './TiltCard3D';
import type { Language, TranslationBundle } from '../i18n/translations';

interface SpecialtiesSectionProps {
  t: TranslationBundle;
  lang: Language;
}

export const SpecialtiesSection: React.FC<SpecialtiesSectionProps> = ({ t, lang }) => {
  const [first, second, third, fourth] = t.specialties.items;

  return (
    <section id="specialties" className="py-20 md:py-24 bg-[#ECEAE2] border-b border-[#17201C]/10">
      <div className="max-w-[1280px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mb-12"
        >
          <p className="text-xs font-medium text-[#2D5A4C] tracking-wide mb-2">
            {t.specialties.kicker}
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
                  ? 'clamp(1.5rem, 2.5vw, 2.2rem)'
                  : 'clamp(1.75rem, 2.8vw, 2.5rem)',
            }}
          >
            {t.specialties.title}
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[#47544D]">
            {t.specialties.subtitle}
          </p>
        </motion.div>

        {/* Asymmetric 3D Perspective Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 perspective-stage">
          {/* 01. Marquee Diagnostics Card (7 cols) */}
          <TiltCard3D
            intensity={4.5}
            className="lg:col-span-7 rounded-xl bg-[#F6F5F0] border border-[#17201C]/12 shadow-[0_16px_40px_rgba(23,32,28,0.08)] overflow-hidden flex flex-col"
          >
            <div className="aspect-[16/10] w-full overflow-hidden bg-[#DDD8CB]">
              <img
                src={CLINIC_IMAGES.diagnostics}
                alt={first.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
              />
            </div>
            <div className="p-6 md:p-7 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs font-medium text-[#47544D] tabular-nums mb-1.5">
                  {first.num}
                </p>
                <h3 className="font-display text-xl md:text-2xl font-medium text-[#17201C]">
                  {first.title}
                </h3>
                <p className="mt-2.5 text-sm md:text-[15px] leading-relaxed text-[#47544D]">
                  {first.description}
                </p>
              </div>
              <p className="mt-5 pt-4 border-t border-[#17201C]/10 text-xs text-[#2D5A4C] font-medium">
                {first.detail}
              </p>
            </div>
          </TiltCard3D>

          {/* 02. Micro-Surgery Card (5 cols) */}
          <TiltCard3D
            intensity={4.5}
            className="lg:col-span-5 rounded-xl bg-[#F6F5F0] border border-[#17201C]/12 shadow-[0_16px_40px_rgba(23,32,28,0.08)] overflow-hidden flex flex-col"
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-[#DDD8CB]">
              <img
                src={CLINIC_IMAGES.surgery}
                alt={second.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
              />
            </div>
            <div className="p-6 md:p-7 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs font-medium text-[#47544D] tabular-nums mb-1.5">
                  {second.num}
                </p>
                <h3 className="font-display text-xl font-medium text-[#17201C]">
                  {second.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[#47544D]">
                  {second.description}
                </p>
              </div>
              <p className="mt-5 pt-4 border-t border-[#17201C]/10 text-xs text-[#2D5A4C] font-medium">
                {second.detail}
              </p>
            </div>
          </TiltCard3D>

          {/* 03. Feline Internal & Renal Medicine (6 cols) */}
          <TiltCard3D
            intensity={5}
            className="lg:col-span-6 rounded-xl bg-[#F6F5F0] border border-[#17201C]/12 shadow-[0_14px_34px_rgba(23,32,28,0.07)] p-6 md:p-7 flex flex-col justify-between"
          >
            <div>
              <p className="text-xs font-medium text-[#47544D] tabular-nums mb-1.5">
                {third.num}
              </p>
              <h3 className="font-display text-xl font-medium text-[#17201C]">
                {third.title}
              </h3>
              <p className="mt-2.5 text-sm md:text-[15px] leading-relaxed text-[#47544D]">
                {third.description}
              </p>
            </div>
            <p className="mt-5 pt-4 border-t border-[#17201C]/10 text-xs text-[#2D5A4C] font-medium">
              {third.detail}
            </p>
          </TiltCard3D>

          {/* 04. Cardiology, Orthopedics & Longevity (6 cols) */}
          <TiltCard3D
            intensity={5}
            className="lg:col-span-6 rounded-xl bg-[#F6F5F0] border border-[#17201C]/12 shadow-[0_14px_34px_rgba(23,32,28,0.07)] p-6 md:p-7 flex flex-col justify-between"
          >
            <div>
              <p className="text-xs font-medium text-[#47544D] tabular-nums mb-1.5">
                {fourth.num}
              </p>
              <h3 className="font-display text-xl font-medium text-[#17201C]">
                {fourth.title}
              </h3>
              <p className="mt-2.5 text-sm md:text-[15px] leading-relaxed text-[#47544D]">
                {fourth.description}
              </p>
            </div>
            <p className="mt-5 pt-4 border-t border-[#17201C]/10 text-xs text-[#2D5A4C] font-medium">
              {fourth.detail}
            </p>
          </TiltCard3D>
        </div>
      </div>
    </section>
  );
};
