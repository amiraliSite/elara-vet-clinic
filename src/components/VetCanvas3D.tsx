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
      className="py-16 md:py-20 bg-[#121A17] text-[#F6F5F0] border-b border-white/10"
    >
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-[#D4AF63] tracking-wide mb-2">
              {t.explorer.kicker}
            </p>
            <h2
              className={`font-medium text-[#F6F5F0] text-balance ${
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
              {t.explorer.title}
            </h2>
            <p className="mt-2 text-sm md:text-[15px] leading-relaxed text-[#C2CCC7]">
              {t.explorer.subtitle}
            </p>
          </div>
          <p className="text-xs text-[#9FB0A7] shrink-0">{t.explorer.dragHint}</p>
        </div>

        {/* Interactive 3D Suite Viewport */}
        <div className="relative w-full h-[560px] md:h-[640px] rounded-2xl overflow-hidden bg-[#16201C] border border-[#D4AF63]/20 shadow-[0_24px_60px_rgba(0,0,0,0.48)] select-none">
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

          {/* Collapsible Bottom Control Dock (Zero Center Viewport Occlusion) */}
          <div className="absolute inset-x-0 bottom-4 z-20 flex flex-col items-center px-3 pointer-events-none">
            <button
              type="button"
              onClick={() => setDockOpen((prev) => !prev)}
              className="pointer-events-auto mb-1.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-t-lg bg-[#111916]/95 border border-b-0 border-white/15 text-xs font-medium text-[#E3E8E5] hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              {dockOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              <span>{dockOpen ? t.dock.hideControls : t.dock.showControls}</span>
            </button>

            {dockOpen && (
              <div className="pointer-events-auto w-full max-w-[920px] rounded-xl bg-[#111916]/95 border border-white/15 px-4 py-3 text-[#F6F5F0] shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-white/10">
                  {hotspotContent ? (
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                      <span className="text-xs font-semibold text-[#D4AF63] whitespace-nowrap">
                        {hotspotContent.title}
                      </span>
                      <span className="text-xs text-[#C7D1CC] leading-snug">
                        {hotspotContent.detail}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-[#A9B5AF]">{t.dock.inspectHint}</span>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#9BA8A1] me-1">
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
                          className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            active
                              ? 'bg-[#2D5A4C] text-[#F6F5F0]'
                              : 'bg-white/5 text-[#C5D0CA] hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {t.dock.views[preset]}
                        </button>
                      );
                    })}
                  </div>

                  <label className="flex items-center gap-2 text-xs text-[#C5D0CA] whitespace-nowrap">
                    <Layers className="w-3.5 h-3.5 text-[#D4AF63]" />
                    <span>{t.dock.explodeLabel}</span>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={explode}
                      onChange={(e) => handleExplode(parseFloat(e.target.value))}
                      className="w-24 accent-[#D4AF63] cursor-pointer"
                    />
                    <span className="tabular-nums text-[11px] text-[#9BA8A1] w-8 text-end">
                      {Math.round(explode * 100)}%
                    </span>
                  </label>

                  <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white/5 border border-white/10">
                    <button
                      type="button"
                      onClick={() => handleMood('daylight')}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                        mood === 'daylight'
                          ? 'bg-[#EAE5DA] text-[#17201C]'
                          : 'text-[#C5D0CA] hover:text-white'
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5" />
                      {t.dock.moods.daylight}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMood('evening')}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                        mood === 'evening'
                          ? 'bg-[#2D5A4C] text-[#F6F5F0]'
                          : 'text-[#C5D0CA] hover:text-white'
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
