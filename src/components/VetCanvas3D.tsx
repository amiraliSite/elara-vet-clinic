import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Sun, Moon, Layers, Eye } from 'lucide-react';
import { VetSanctuaryScene } from '../scene/VetSanctuaryScene';
import { CLINIC_IMAGES } from '../data/clinicMedia';
import type {
  CameraPreset,
  HotspotId,
  Language,
  LightingMood,
  TranslationBundle,
} from '../i18n/translations';

interface VetCanvas3DProps {
  t: TranslationBundle;
  lang: Language;
}

const CAMERA_KEYS: CameraPreset[] = ['overview', 'companions', 'diagnostics', 'lamp'];

export const VetCanvas3D: React.FC<VetCanvas3DProps> = ({ t, lang }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<VetSanctuaryScene | null>(null);

  const [webglFailed, setWebglFailed] = useState(false);
  const [dockOpen, setDockOpen] = useState(true);
  const [activePreset, setActivePreset] = useState<CameraPreset>('overview');
  const [explode, setExplode] = useState(0);
  const [mood, setMood] = useState<LightingMood>('daylight');
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotId | null>('companions');

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new VetSanctuaryScene(container, {
      onSelectHotspot: (id) => {
        setSelectedHotspot(id);
        setDockOpen(true);
      },
      onWebGLUnavailable: () => {
        setWebglFailed(true);
      },
    });
    sceneRef.current = scene;

    return () => {
      scene.dispose();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.setLanguage(lang);
  }, [lang]);

  const handlePreset = (preset: CameraPreset) => {
    setActivePreset(preset);
    sceneRef.current?.setCameraPreset(preset);
    if (preset === 'companions') setSelectedHotspot('companions');
    else if (preset === 'diagnostics') setSelectedHotspot('monitor');
    else if (preset === 'lamp') setSelectedHotspot('lamp');
    else setSelectedHotspot('table');
  };

  const handleExplode = (val: number) => {
    setExplode(val);
    sceneRef.current?.setExplode(val);
  };

  const handleMood = (next: LightingMood) => {
    setMood(next);
    sceneRef.current?.setLightingMood(next);
  };

  const hotspotContent = selectedHotspot ? t.dock.hotspots[selectedHotspot] : null;

  return (
    <section
      id="explorer-3d"
      className="py-16 md:py-20 bg-[#1B1410] text-[#F5EFE8] border-b border-[#D19A6B]/15"
    >
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-[#E0AA7A] tracking-wide mb-2">
              {t.explorer.kicker}
            </p>
            <h2
              className={`font-medium text-[#F5EFE8] text-balance ${
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
              {t.explorer.title}
            </h2>
            <p className="mt-2 text-sm md:text-[15px] leading-relaxed text-[#D0C1B3]">
              {t.explorer.subtitle}
            </p>
          </div>
          <p className="text-xs text-[#C2AE9C] shrink-0">{t.explorer.dragHint}</p>
        </div>

        {/* Interactive 3D Suite Viewport */}
        <div className="relative w-full h-[560px] md:h-[640px] rounded-2xl overflow-hidden bg-[#1B1410] border border-[#D19A6B]/25 shadow-[0_24px_60px_rgba(0,0,0,0.5)] select-none">
          {!webglFailed ? (
            <div
              ref={mountRef}
              dir="ltr"
              className="absolute inset-0 w-full h-full"
              aria-label="Interactive 3D Veterinary Examination Suite"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full">
              <img
                src={CLINIC_IMAGES.hero}
                alt={t.explorer.fallbackTitle}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-80"
              />
            </div>
          )}

          {/* Collapsible Bottom Control Dock */}
          <div className="absolute inset-x-0 bottom-4 z-20 flex flex-col items-center px-3 pointer-events-none">
            <button
              type="button"
              onClick={() => setDockOpen((prev) => !prev)}
              className="pointer-events-auto mb-1.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-t-xl bg-[#18120E]/95 border border-b-0 border-[#D19A6B]/25 text-xs font-medium text-[#E5D6C7] hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              {dockOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              <span>{dockOpen ? t.dock.hideControls : t.dock.showControls}</span>
            </button>

            {dockOpen && (
              <div className="pointer-events-auto w-full max-w-[920px] rounded-2xl bg-[#18120E]/96 border border-[#D19A6B]/25 px-4 py-3 text-[#F5EFE8] shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-white/10">
                  {hotspotContent ? (
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                      <span className="text-xs font-semibold text-[#E0AA7A] whitespace-nowrap">
                        {hotspotContent.title}
                      </span>
                      <span className="text-xs text-[#D8C8B9] leading-snug">
                        {hotspotContent.detail}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-[#BFAE9E]">{t.dock.inspectHint}</span>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#B9A491] me-1">
                      <Eye className="w-3.5 h-3.5" />
                      {t.dock.viewsLabel}
                    </span>
                    {CAMERA_KEYS.map((preset) => {
                      const active = activePreset === preset;
                      return (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => handlePreset(preset)}
                          className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            active
                              ? 'bg-[#B87B4B] text-[#18110C] font-semibold'
                              : 'bg-white/5 text-[#D2C2B4] hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {t.dock.views[preset]}
                        </button>
                      );
                    })}
                  </div>

                  <label className="flex items-center gap-2 text-xs text-[#D2C2B4] whitespace-nowrap">
                    <Layers className="w-3.5 h-3.5 text-[#E0AA7A]" />
                    <span>{t.dock.explodeLabel}</span>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={explode}
                      onChange={(e) => handleExplode(parseFloat(e.target.value))}
                      className="w-24 accent-[#D19A6B] cursor-pointer"
                    />
                    <span className="tabular-nums text-[11px] text-[#B9A491] w-9 text-end">
                      {lang === 'fa'
                        ? `${Math.round(explode * 100).toLocaleString('fa-IR')}٪`
                        : `${Math.round(explode * 100)}%`}
                    </span>
                  </label>

                  <div className="flex items-center gap-1 p-0.5 rounded-xl bg-white/5 border border-white/10">
                    <button
                      type="button"
                      onClick={() => handleMood('daylight')}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                        mood === 'daylight'
                          ? 'bg-[#F5EFE8] text-[#18110C]'
                          : 'text-[#D2C2B4] hover:text-white'
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5" />
                      {t.dock.moods.daylight}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMood('evening')}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                        mood === 'evening'
                          ? 'bg-[#B87B4B] text-[#18110C] font-semibold'
                          : 'text-[#D2C2B4] hover:text-white'
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5" />
                      {t.dock.moods.evening}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
