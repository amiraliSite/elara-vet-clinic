import React, { useState } from 'react';
import { CheckCircle2, Calendar, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import type { Language, TranslationBundle } from '../i18n/translations';

interface BookingSectionProps {
  t: TranslationBundle;
  lang: Language;
}

type SpeciesKey = 'dog' | 'cat' | 'exotic';

const TIME_SLOTS = ['09:30', '11:15', '14:00', '16:30', '18:45'];

export const BookingSection: React.FC<BookingSectionProps> = ({ t, lang }) => {
  const [species, setSpecies] = useState<SpeciesKey>('dog');
  const [petName, setPetName] = useState('');
  const [serviceIndex, setServiceIndex] = useState(0);
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [ownerName, setOwnerName] = useState('');
  const [contact, setContact] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

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
    <section id="booking" className="relative py-20 md:py-24 bg-[#ECE2D6] overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 end-0 w-[420px] h-[420px] rounded-full bg-[#B87B4B]/12 blur-3xl"
      />

      <div className="relative max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <p className="text-xs font-medium text-[#9A6035] tracking-wide mb-2">
              {t.booking.kicker}
            </p>
            <h2
              className={`font-medium text-[#221914] text-balance ${
                lang === 'fa'
                  ? 'font-nastaliq leading-[2.08] py-1'
                  : 'font-display leading-[1.15] tracking-tight'
              }`}
              style={{
                fontSize:
                  lang === 'fa'
                    ? 'clamp(1.5rem, 2.5vw, 2.2rem)'
                    : 'clamp(1.75rem, 2.8vw, 2.5rem)',
              }}
            >
              {t.booking.title}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[#5C4B40]">
              {t.booking.subtitle}
            </p>

            <div className="mt-8 space-y-5 pt-6 border-t border-[#8C5630]/15">
              {t.booking.highlights.map((item, idx) => (
                <div key={idx}>
                  <h3 className="text-sm font-semibold text-[#221914]">{item.title}</h3>
                  <p className="mt-1 text-sm text-[#5C4B40] leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 rounded-2xl bg-[#F5EFE8] border border-[#8C5630]/20 shadow-[0_22px_54px_rgba(34,25,20,0.12)] p-6 md:p-8"
          >
            {submittedRef ? (
              <div className="py-8 text-center max-w-md mx-auto">
                <CheckCircle2 className="w-11 h-11 text-[#B87B4B] mx-auto mb-4" />
                <h3 className="font-display text-2xl font-medium text-[#221914]">
                  {t.booking.form.successTitle}
                </h3>
                <p className="mt-2.5 text-sm text-[#5C4B40] leading-relaxed">
                  {t.booking.form.successBody}
                </p>

                <div className="mt-6 rounded-xl bg-[#EBE2D7] border border-[#8C5630]/20 p-4 text-start space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#5C4B40]">{t.booking.form.refLabel}</span>
                    <span className="font-mono font-semibold text-[#221914] tabular-nums">
                      {submittedRef}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#5C4B40]">{t.booking.form.petNameLabel}</span>
                    <span className="font-medium text-[#221914]">
                      {petName} · {t.booking.form.species[species]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#5C4B40]">{t.booking.form.dateLabel}</span>
                    <span className="font-medium text-[#221914] tabular-nums">
                      {date} · {timeSlot}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={resetForm}
                  className="mt-6 px-5 py-2.5 text-sm font-medium rounded-xl border border-[#8C5630]/30 text-[#221914] hover:bg-[#EBE2D7] transition-colors cursor-pointer"
                >
                  {t.booking.form.newRequestBtn}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-[#5C4B40] mb-2">
                    {t.booking.form.speciesLabel}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['dog', 'cat', 'exotic'] as const).map((sp) => {
                      const active = species === sp;
                      return (
                        <button
                          key={sp}
                          type="button"
                          onClick={() => setSpecies(sp)}
                          className={`py-2.5 px-3 text-xs sm:text-sm font-medium rounded-xl border transition-all cursor-pointer truncate ${
                            active
                              ? 'bg-[#B87B4B] border-[#9A6035] text-[#18110C] font-semibold shadow-sm'
                              : 'bg-[#EBE2D7]/75 border-[#8C5630]/15 text-[#221914] hover:bg-[#EBE2D7]'
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
                      className="block text-xs font-medium text-[#5C4B40] mb-1.5"
                    >
                      {t.booking.form.petNameLabel}
                    </label>
                    <input
                      id="pet-name"
                      type="text"
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                      placeholder={t.booking.form.petNamePlaceholder}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white border border-[#221914]/15 text-[#221914] placeholder:text-[#9A8B7E] focus:outline-none focus:border-[#B87B4B]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="service-select"
                      className="block text-xs font-medium text-[#5C4B40] mb-1.5"
                    >
                      {t.booking.form.serviceLabel}
                    </label>
                    <select
                      id="service-select"
                      value={serviceIndex}
                      onChange={(e) => setServiceIndex(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white border border-[#221914]/15 text-[#221914] focus:outline-none focus:border-[#B87B4B]"
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
                      className="flex items-center gap-1.5 text-xs font-medium text-[#5C4B40] mb-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#9A6035]" />
                      {t.booking.form.dateLabel}
                    </label>
                    <input
                      id="visit-date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white border border-[#221914]/15 text-[#221914] focus:outline-none focus:border-[#B87B4B]"
                    />
                  </div>
                  <div>
                    <span className="flex items-center gap-1.5 text-xs font-medium text-[#5C4B40] mb-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#9A6035]" />
                      {t.booking.form.timeLabel}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setTimeSlot(slot)}
                          className={`px-2.5 py-2 text-xs font-medium rounded-xl border tabular-nums transition-colors cursor-pointer ${
                            timeSlot === slot
                              ? 'bg-[#221914] border-[#221914] text-[#F5EFE8]'
                              : 'bg-white border-[#221914]/15 text-[#5C4B40] hover:border-[#B87B4B]'
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
                      className="block text-xs font-medium text-[#5C4B40] mb-1.5"
                    >
                      {t.booking.form.ownerNameLabel}
                    </label>
                    <input
                      id="owner-name"
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder={t.booking.form.ownerNamePlaceholder}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white border border-[#221914]/15 text-[#221914] placeholder:text-[#9A8B7E] focus:outline-none focus:border-[#B87B4B]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="owner-contact"
                      className="block text-xs font-medium text-[#5C4B40] mb-1.5"
                    >
                      {t.booking.form.contactLabel}
                    </label>
                    <input
                      id="owner-contact"
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder={t.booking.form.contactPlaceholder}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white border border-[#221914]/15 text-[#221914] placeholder:text-[#9A8B7E] focus:outline-none focus:border-[#B87B4B]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="clinical-notes"
                    className="block text-xs font-medium text-[#5C4B40] mb-1.5"
                  >
                    {t.booking.form.notesLabel}
                  </label>
                  <textarea
                    id="clinical-notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t.booking.form.notesPlaceholder}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white border border-[#221914]/15 text-[#221914] placeholder:text-[#9A8B7E] focus:outline-none focus:border-[#B87B4B]"
                  />
                </div>

                {error && (
                  <p role="alert" className="text-xs font-medium text-[#9B2C2C] bg-[#FEE2E2] px-3.5 py-2.5 rounded-xl">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="btn-bronze-3d w-full py-3 px-5 text-sm font-semibold rounded-xl text-[#18110C] transition-all duration-200 cursor-pointer"
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
