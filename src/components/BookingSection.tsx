import React, { useState } from 'react';
import { CheckCircle2, Calendar, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import type { Language, TranslationBundle } from '../i18n/translations';

interface BookingSectionProps {
  t: TranslationBundle;
  lang: Language;
}

type SpeciesKey = 'dog' | 'cat' | 'exotic';

export const BookingSection: React.FC<BookingSectionProps> = ({ t, lang }) => {
  const [species, setSpecies] = useState<SpeciesKey>('dog');
  const [petName, setPetName] = useState('');
  const [serviceIndex, setServiceIndex] = useState(0);
  const [date, setDate] = useState('');
  const [timeSlotIndex, setTimeSlotIndex] = useState(0);
  const [ownerName, setOwnerName] = useState('');
  const [contact, setContact] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const selectedTimeSlot = t.booking.form.timeSlots[timeSlotIndex] ?? t.booking.form.timeSlots[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!petName.trim() || !ownerName.trim() || !date) {
      setError(t.booking.form.errorRequired);
      return;
    }

    const cleanContact = contact.trim();
    const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanContact);
    const looksLikePhone = /^[+\d\s()-]{7,20}$/.test(cleanContact);
    if (!looksLikeEmail && !looksLikePhone) {
      setError(t.booking.form.errorContact);
      return;
    }

    const code = `ELR-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmittedRef(code);
  };

  const resetForm = () => {
    setSubmittedRef(null);
    setPetName('');
    setNotes('');
    setError(null);
  };

  return (
    <section id="booking" className="relative py-20 md:py-24 bg-[#FFFBF5] overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 end-0 w-[420px] h-[420px] rounded-full bg-[#5EEAD4]/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 start-0 w-[380px] h-[380px] rounded-full bg-[#FDBA74]/22 blur-3xl"
      />

      <div className="relative max-w-[1260px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <p className="text-xs font-semibold text-[#EA580C] tracking-wide mb-2">
              {t.booking.kicker}
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
              {t.booking.title}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[#455B58]">
              {t.booking.subtitle}
            </p>

            <div className="mt-8 space-y-4 pt-6 border-t border-[#0D9488]/15">
              {t.booking.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-[#EED9BF] border-b-[3px] border-b-[#DFC2A0] shadow-xs"
                >
                  <h3 className="text-sm font-bold text-[#0F766E]">{item.title}</h3>
                  <p className="mt-1 text-sm text-[#455B58] leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 rounded-3xl bg-white border border-[#CCE6E1] border-b-[5px] border-b-[#A5D8CE] shadow-[0_22px_54px_rgba(13,148,136,0.12)] p-6 md:p-8"
          >
            {submittedRef ? (
              <div className="py-8 text-center max-w-md mx-auto">
                <CheckCircle2 className="w-12 h-12 text-[#0D9488] mx-auto mb-4" />
                <h3 className="font-display text-2xl font-medium text-[#162A28]">
                  {t.booking.form.successTitle}
                </h3>
                <p className="mt-2.5 text-sm text-[#455B58] leading-relaxed">
                  {t.booking.form.successBody}
                </p>

                <div className="mt-6 rounded-2xl bg-[#EFF9F6] border border-[#0D9488]/20 p-4 text-start space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#455B58]">{t.booking.form.refLabel}</span>
                    <span className="font-mono font-bold text-[#EA580C] tabular-nums">
                      {submittedRef}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#455B58]">{t.booking.form.petNameLabel}</span>
                    <span className="font-semibold text-[#162A28]">
                      {petName} · {t.booking.form.species[species]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#455B58]">{t.booking.form.dateLabel}</span>
                    <span className="font-semibold text-[#162A28] tabular-nums">
                      {date} · {selectedTimeSlot}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-teal-3d mt-6 px-6 py-2.5 text-sm font-bold rounded-xl text-white transition-all cursor-pointer"
                >
                  {t.booking.form.newRequestBtn}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-[#455B58] mb-2">
                    {t.booking.form.speciesLabel}
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {(['dog', 'cat', 'exotic'] as const).map((sp) => {
                      const active = species === sp;
                      return (
                        <button
                          key={sp}
                          type="button"
                          onClick={() => setSpecies(sp)}
                          className={`py-2.5 px-3 text-xs sm:text-sm font-semibold rounded-xl border transition-all cursor-pointer truncate ${
                            active
                              ? 'btn-teal-3d text-white border-transparent'
                              : 'bg-[#F3FAF8] border-[#BCE3DA] text-[#284744] hover:bg-[#E4F5F1]'
                          }`}
                        >
                          {t.booking.form.species[sp]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="pet-name"
                      className="block text-xs font-semibold text-[#455B58] mb-1.5"
                    >
                      {t.booking.form.petNameLabel}
                    </label>
                    <input
                      id="pet-name"
                      type="text"
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                      placeholder={t.booking.form.petNamePlaceholder}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#FFFDF9] border border-[#CBE4DF] text-[#162A28] placeholder:text-[#8CA39F] focus:outline-none focus:border-[#0D9488]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="service-select"
                      className="block text-xs font-semibold text-[#455B58] mb-1.5"
                    >
                      {t.booking.form.serviceLabel}
                    </label>
                    <select
                      id="service-select"
                      value={serviceIndex}
                      onChange={(e) => setServiceIndex(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#FFFDF9] border border-[#CBE4DF] text-[#162A28] focus:outline-none focus:border-[#0D9488]"
                    >
                      {t.booking.form.services.map((srv, idx) => (
                        <option key={idx} value={idx}>
                          {srv}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="visit-date"
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#455B58] mb-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#EA580C]" />
                      {t.booking.form.dateLabel}
                    </label>
                    <input
                      id="visit-date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#FFFDF9] border border-[#CBE4DF] text-[#162A28] focus:outline-none focus:border-[#0D9488]"
                    />
                  </div>
                  <div>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-[#455B58] mb-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#EA580C]" />
                      {t.booking.form.timeLabel}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {t.booking.form.timeSlots.map((slot, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setTimeSlotIndex(idx)}
                          className={`px-2.5 py-2 text-xs font-semibold rounded-xl border tabular-nums transition-colors cursor-pointer ${
                            timeSlotIndex === idx
                              ? 'bg-[#0D9488] border-[#0F766E] text-white shadow-xs'
                              : 'bg-[#FFFDF9] border-[#CBE4DF] text-[#455B58] hover:border-[#F97316]'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="owner-name"
                      className="block text-xs font-semibold text-[#455B58] mb-1.5"
                    >
                      {t.booking.form.ownerNameLabel}
                    </label>
                    <input
                      id="owner-name"
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder={t.booking.form.ownerNamePlaceholder}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#FFFDF9] border border-[#CBE4DF] text-[#162A28] placeholder:text-[#8CA39F] focus:outline-none focus:border-[#0D9488]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="owner-contact"
                      className="block text-xs font-semibold text-[#455B58] mb-1.5"
                    >
                      {t.booking.form.contactLabel}
                    </label>
                    <input
                      id="owner-contact"
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder={t.booking.form.contactPlaceholder}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#FFFDF9] border border-[#CBE4DF] text-[#162A28] placeholder:text-[#8CA39F] focus:outline-none focus:border-[#0D9488]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="clinical-notes"
                    className="block text-xs font-semibold text-[#455B58] mb-1.5"
                  >
                    {t.booking.form.notesLabel}
                  </label>
                  <textarea
                    id="clinical-notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t.booking.form.notesPlaceholder}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#FFFDF9] border border-[#CBE4DF] text-[#162A28] placeholder:text-[#8CA39F] focus:outline-none focus:border-[#0D9488]"
                  />
                </div>

                {error && (
                  <p role="alert" className="text-xs font-semibold text-[#B91C1C] bg-[#FEE2E2] px-3.5 py-2.5 rounded-xl">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="btn-joy-3d w-full py-3.5 px-5 text-sm font-bold rounded-xl text-white transition-all duration-200 cursor-pointer"
                >
                  {t.booking.form.submitBtn}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
