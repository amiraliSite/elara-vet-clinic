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
    <section
      id="specialties"
      className="relative py-20 md:py-24 bg-[#FFF5EA] border-b border-[#F97316]/15 overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -start-24 w-[440px] h-[440px] rounded-full bg-[#FDBA74]/22 blur-3xl"
      />

      <div className="relative max-w-[1260px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mb-12"
        >
          <p className="text-xs font-semibold text-[#EA580C] tracking-wide mb-2">
            {t.specialties.kicker}
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
            {t.specialties.title}
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[#455B58]">
            {t.specialties.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 perspective-stage">
          <TiltCard3D
            intensity={4.5}
            className="lg:col-span-7 rounded-2xl bg-white border border-[#EED9BF] border-b-[4px] border-b-[#DFC2A0] shadow-[0_18px_42px_rgba(249,115,22,0.09)] overflow-hidden flex flex-col"
          >
            <div className="aspect-[16/10] w-full overflow-hidden bg-[#F3E7D7]">
              <img
                src={CLINIC_IMAGES.diagnostics}
                alt={first.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
              />
            </div>
            <div className="p-6 md:p-7 flex-1 flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-lg bg-[#FFF0DD] text-xs font-bold text-[#EA580C] tabular-nums mb-2">
                  {first.num}
                </span>
                <h3 className="font-display text-xl md:text-2xl font-medium text-[#162A28]">
                  {first.title}
                </h3>
                <p className="mt-2.5 text-sm md:text-[15px] leading-relaxed text-[#455B58]">
                  {first.description}
                </p>
              </div>
              <p className="mt-5 pt-4 border-t border-[#0D9488]/12 text-xs text-[#0F766E] font-semibold">
                {first.detail}
              </p>
            </div>
          </TiltCard3D>

          <TiltCard3D
            intensity={4.5}
            className="lg:col-span-5 rounded-2xl bg-white border border-[#CCE6E1] border-b-[4px] border-b-[#A7D8CF] shadow-[0_18px_42px_rgba(13,148,136,0.09)] overflow-hidden flex flex-col"
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-[#E1F3EF]">
              <img
                src={CLINIC_IMAGES.surgery}
                alt={second.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
              />
            </div>
            <div className="p-6 md:p-7 flex-1 flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-lg bg-[#E6F8F5] text-xs font-bold text-[#0F766E] tabular-nums mb-2">
                  {second.num}
                </span>
                <h3 className="font-display text-xl font-medium text-[#162A28]">
                  {second.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[#455B58]">
                  {second.description}
                </p>
              </div>
              <p className="mt-5 pt-4 border-t border-[#0D9488]/12 text-xs text-[#EA580C] font-semibold">
                {second.detail}
              </p>
            </div>
          </TiltCard3D>

          <TiltCard3D
            intensity={5}
            className="lg:col-span-6 rounded-2xl bg-white border border-[#CCE6E1] border-b-[4px] border-b-[#A7D8CF] shadow-[0_14px_34px_rgba(13,148,136,0.08)] p-6 md:p-7 flex flex-col justify-between"
          >
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-lg bg-[#E6F8F5] text-xs font-bold text-[#0F766E] tabular-nums mb-2">
                {third.num}
              </span>
              <h3 className="font-display text-xl font-medium text-[#162A28]">
                {third.title}
              </h3>
              <p className="mt-2.5 text-sm md:text-[15px] leading-relaxed text-[#455B58]">
                {third.description}
              </p>
            </div>
            <p className="mt-5 pt-4 border-t border-[#0D9488]/12 text-xs text-[#0F766E] font-semibold">
              {third.detail}
            </p>
          </TiltCard3D>

          <TiltCard3D
            intensity={5}
            className="lg:col-span-6 rounded-2xl bg-white border border-[#EED9BF] border-b-[4px] border-b-[#DFC2A0] shadow-[0_14px_34px_rgba(249,115,22,0.08)] p-6 md:p-7 flex flex-col justify-between"
          >
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-lg bg-[#FFF0DD] text-xs font-bold text-[#EA580C] tabular-nums mb-2">
                {fourth.num}
              </span>
              <h3 className="font-display text-xl font-medium text-[#162A28]">
                {fourth.title}
              </h3>
              <p className="mt-2.5 text-sm md:text-[15px] leading-relaxed text-[#455B58]">
                {fourth.description}
              </p>
            </div>
            <p className="mt-5 pt-4 border-t border-[#0D9488]/12 text-xs text-[#EA580C] font-semibold">
              {fourth.detail}
            </p>
          </TiltCard3D>
        </div>
      </div>
    </section>
  );
};
