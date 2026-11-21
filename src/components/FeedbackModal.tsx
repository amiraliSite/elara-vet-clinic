import React, { useEffect, useState } from 'react';
import { Star, X, CheckCircle2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { Language, TranslationBundle } from '../i18n/translations';

interface FeedbackModalProps {
  t: TranslationBundle;
  lang: Language;
}

const SESSION_KEY = 'elara_feedback_handled_v1';

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ t, lang }) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(SESSION_KEY) === '1') return;
    } catch {
      // Ignore storage failures
    }

    const timer = window.setTimeout(() => {
      setOpen(true);
    }, 20000);

    return () => window.clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setOpen(false);
    try {
      window.sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // Ignore storage failures
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError(true);
      return;
    }
    setError(false);
    setSubmitted(true);
    try {
      window.sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // Ignore storage failures
    }
    window.setTimeout(() => {
      setOpen(false);
    }, 2400);
  };

  const activeScore = hovered || rating;
  const ratingText =
    activeScore > 0 ? t.feedback.ratingLabels[activeScore - 1] : '';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102623]/55"
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md rounded-3xl bg-[#FFFDF9] text-[#162A28] border border-[#CBE4DF] border-b-[5px] border-b-[#9FD6CB] shadow-[0_28px_70px_rgba(13,148,136,0.28)] p-6 md:p-7"
          >
            <button
              type="button"
              onClick={dismiss}
              aria-label={t.feedback.closeAria}
              className="absolute top-4 end-4 p-2 rounded-xl text-[#455B58] hover:text-[#162A28] hover:bg-[#EFF9F6] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {submitted ? (
              <div className="py-6 text-center">
                <CheckCircle2 className="w-12 h-12 text-[#0D9488] mx-auto mb-3" />
                <h3
                  className={`font-medium text-[#162A28] ${
                    lang === 'fa' ? 'font-persian-display text-2xl' : 'font-display text-2xl'
                  }`}
                >
                  {t.feedback.thanksTitle}
                </h3>
                <p className="mt-2 text-sm text-[#455B58] leading-relaxed">
                  {t.feedback.thanksBody}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <p className="text-xs font-semibold text-[#0F766E] mb-1.5">
                  {t.feedback.kicker}
                </p>
                <h3
                  id="feedback-modal-title"
                  className={`font-medium text-[#162A28] pe-7 ${
                    lang === 'fa'
                      ? 'font-persian-display text-2xl leading-[1.4]'
                      : 'font-display text-2xl leading-snug'
                  }`}
                >
                  {t.feedback.title}
                </h3>
                <p className="mt-2 text-sm text-[#455B58] leading-relaxed">
                  {t.feedback.subtitle}
                </p>

                {/* Interactive 5-Star Selector */}
                <div className="mt-5 py-4 px-3 rounded-2xl bg-[#FFF5EA] border border-[#FDBA74]/50 flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2" dir="ltr">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const filled = star <= activeScore;
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHovered(star)}
                          onMouseLeave={() => setHovered(0)}
                          onClick={() => {
                            setRating(star);
                            setError(false);
                          }}
                          aria-label={t.feedback.ratingLabels[star - 1]}
                          className="p-1.5 rounded-lg transition-transform duration-150 hover:scale-115 active:scale-95 cursor-pointer"
                        >
                          <Star
                            className={`w-8 h-8 transition-colors duration-150 ${
                              filled
                                ? 'fill-[#F59E0B] text-[#EA580C]'
                                : 'text-[#D6C2AE] fill-transparent'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs font-semibold text-[#EA580C] min-h-[18px]">
                    {ratingText}
                  </p>
                </div>

                {/* Optional Comment */}
                <div className="mt-4">
                  <label
                    htmlFor="feedback-comment"
                    className="block text-xs font-semibold text-[#455B58] mb-1.5"
                  >
                    {t.feedback.commentLabel}
                  </label>
                  <textarea
                    id="feedback-comment"
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={t.feedback.commentPlaceholder}
                    className="w-full px-3.5 py-2 text-sm rounded-xl bg-white border border-[#CBE4DF] text-[#162A28] placeholder:text-[#8CA39F] focus:outline-none focus:border-[#0D9488]"
                  />
                </div>

                {error && (
                  <p role="alert" className="mt-2.5 text-xs font-semibold text-[#B91C1C]">
                    {t.feedback.selectStarError}
                  </p>
                )}

                <div className="mt-5 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={dismiss}
                    className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl text-[#455B58] hover:bg-[#EFF9F6] transition-colors cursor-pointer"
                  >
                    {t.feedback.laterBtn}
                  </button>
                  <button
                    type="submit"
                    className="btn-joy-3d px-5 py-2 text-xs sm:text-sm font-bold text-white rounded-xl transition-all cursor-pointer"
                  >
                    {t.feedback.submitBtn}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
