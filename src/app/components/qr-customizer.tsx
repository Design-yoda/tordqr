import { useRef } from "react";
import { Upload, X, Palette, Image, Square, Frame } from "lucide-react";

export type DotStyle = "square" | "rounded" | "dots" | "classy" | "classy-rounded";
export type CornerStyle = "square" | "rounded" | "dot";
export type FrameStyle = "none" | "simple" | "rounded" | "badge" | "banner";

export interface QRStyleOptions {
  fgColor: string;
  bgColor: string;
  size: number;
  dotStyle: DotStyle;
  cornerStyle: CornerStyle;
  frameStyle: FrameStyle;
  frameText: string;
  frameColor: string;
  logoUrl: string | null;
  gradientEnabled: boolean;
  gradientColor2: string;
}

interface QRCustomizerProps {
  options: QRStyleOptions;
  onChange: (opts: Partial<QRStyleOptions>) => void;
}

type TabId = "colors" | "logo" | "style" | "frame";

const presetFgColors = [
  "#000000", "#1a1a2e", "#7c3aed", "#2563eb", "#059669",
  "#dc2626", "#ea580c", "#ca8a04", "#db2777",
];

const presetBgColors = ["#ffffff", "#f8fafc", "#f0fdf4", "#fdf4ff", "#fef3c7", "#fef2f2"];

const DOT_STYLES: { id: DotStyle; label: string; preview: React.ReactNode }[] = [
  { id: "square", label: "Square", preview: <div className="w-full h-full bg-current" /> },
  { id: "rounded", label: "Rounded", preview: <div className="w-full h-full bg-current rounded-[3px]" /> },
  { id: "dots", label: "Dots", preview: <div className="w-full h-full bg-current rounded-full" /> },
  { id: "classy", label: "Classy", preview: <div className="w-full h-full bg-current rounded-tl-[5px] rounded-br-[5px]" /> },
  { id: "classy-rounded", label: "Elegant", preview: <div className="w-full h-full bg-current rounded-tl-full rounded-br-full" /> },
];

const CORNER_STYLES: { id: CornerStyle; label: string }[] = [
  { id: "square", label: "Square" },
  { id: "rounded", label: "Rounded" },
  { id: "dot", label: "Dot" },
];

const FRAME_STYLES: { id: FrameStyle; label: string }[] = [
  { id: "none", label: "None" },
  { id: "simple", label: "Simple" },
  { id: "rounded", label: "Rounded" },
  { id: "badge", label: "Badge" },
  { id: "banner", label: "Banner" },
];

import { useState } from "react";

export function QRCustomizer({ options, onChange }: QRCustomizerProps) {
  const [activeTab, setActiveTab] = useState<TabId>("colors");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: "colors", label: "Colors", icon: Palette },
    { id: "logo", label: "Logo", icon: Image },
    { id: "style", label: "Style", icon: Square },
    { id: "frame", label: "Frame", icon: Frame },
  ];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onChange({ logoUrl: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100/80 rounded-xl p-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[12px] transition-all cursor-pointer ${
              activeTab === id
                ? "bg-white text-[#4C80F1] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Colors Tab */}
      {activeTab === "colors" && (
        <div className="space-y-5">
          <div>
            <label className="block text-[12px] text-gray-500 mb-2 ml-0.5">Foreground Color</label>
            <div className="flex items-center gap-2 flex-wrap">
              {presetFgColors.map((c) => (
                <button
                  key={c}
                  onClick={() => onChange({ fgColor: c })}
                  className={`w-7 h-7 rounded-lg border-2 transition-all cursor-pointer ${
                    options.fgColor === c ? "border-[#4C80F1] scale-110 shadow-md" : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <input
                type="color"
                value={options.fgColor}
                onChange={(e) => onChange({ fgColor: e.target.value })}
                className="w-7 h-7 rounded-lg cursor-pointer border-0 p-0"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] text-gray-500 mb-2 ml-0.5">Background Color</label>
            <div className="flex items-center gap-2 flex-wrap">
              {presetBgColors.map((c) => (
                <button
                  key={c}
                  onClick={() => onChange({ bgColor: c })}
                  className={`w-7 h-7 rounded-lg border-2 transition-all cursor-pointer ${
                    options.bgColor === c ? "border-[#4C80F1] scale-110 shadow-md" : "border-gray-200 hover:scale-105"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <input
                type="color"
                value={options.bgColor}
                onChange={(e) => onChange({ bgColor: e.target.value })}
                className="w-7 h-7 rounded-lg cursor-pointer border-0 p-0"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.gradientEnabled}
                onChange={(e) => onChange({ gradientEnabled: e.target.checked })}
                className="w-4 h-4 rounded accent-[#4C80F1]"
              />
              <span className="text-[12px] text-gray-600">Enable Gradient</span>
            </label>
            {options.gradientEnabled && (
              <input
                type="color"
                value={options.gradientColor2}
                onChange={(e) => onChange({ gradientColor2: e.target.value })}
                className="w-7 h-7 rounded-lg cursor-pointer border-0 p-0"
              />
            )}
          </div>

          <div>
            <label className="block text-[12px] text-gray-500 mb-2 ml-0.5">
              Size: {options.size}px
            </label>
            <input
              type="range"
              min={128}
              max={512}
              step={8}
              value={options.size}
              onChange={(e) => onChange({ size: Number(e.target.value) })}
              className="w-full accent-[#4C80F1]"
            />
          </div>
        </div>
      )}

      {/* Logo Tab */}
      {activeTab === "logo" && (
        <div className="space-y-4">
          <p className="text-[12px] text-gray-500">
            Upload a logo to display in the center of your QR code.
          </p>

          {options.logoUrl ? (
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center bg-white">
                <img src={options.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
              </div>
              <div className="flex-1">
                <p className="text-[13px] text-gray-700">Logo uploaded</p>
                <button
                  onClick={() => onChange({ logoUrl: null })}
                  className="text-[12px] text-red-500 hover:text-red-600 flex items-center gap-1 mt-1 cursor-pointer"
                >
                  <X className="w-3 h-3" /> Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed border-gray-200 rounded-xl hover:border-[#4C80F1]/50 hover:bg-[#4C80F1]/5/30 transition-all cursor-pointer"
            >
              <Upload className="w-6 h-6 text-gray-400" />
              <span className="text-[13px] text-gray-500">Click to upload logo</span>
              <span className="text-[11px] text-gray-400">PNG, JPG, SVG</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
        </div>
      )}

      {/* Style Tab */}
      {activeTab === "style" && (
        <div className="space-y-5">
          <div>
            <label className="block text-[12px] text-gray-500 mb-2.5 ml-0.5">Dot Style</label>
            <div className="grid grid-cols-5 gap-2">
              {DOT_STYLES.map(({ id, label, preview }) => (
                <button
                  key={id}
                  onClick={() => onChange({ dotStyle: id })}
                  className={`flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl transition-all cursor-pointer border ${
                    options.dotStyle === id
                      ? "border-[#4C80F1] bg-[#4C80F1]/5 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="w-5 h-5 text-gray-800">{preview}</div>
                  <span className="text-[10px] text-gray-600">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[12px] text-gray-500 mb-2.5 ml-0.5">Corner Style</label>
            <div className="grid grid-cols-3 gap-2">
              {CORNER_STYLES.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => onChange({ cornerStyle: id })}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all cursor-pointer border ${
                    options.cornerStyle === id
                      ? "border-[#4C80F1] bg-[#4C80F1]/5 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`w-6 h-6 border-[3px] border-gray-800 ${
                      id === "square" ? "rounded-none" : id === "rounded" ? "rounded-lg" : "rounded-full"
                    }`}
                  />
                  <span className="text-[10px] text-gray-600">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Frame Tab */}
      {activeTab === "frame" && (
        <div className="space-y-4">
          <div>
            <label className="block text-[12px] text-gray-500 mb-2.5 ml-0.5">Frame Style</label>
            <div className="grid grid-cols-5 gap-2">
              {FRAME_STYLES.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => onChange({ frameStyle: id })}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded-xl transition-all cursor-pointer border text-[10px] ${
                    options.frameStyle === id
                      ? "border-[#4C80F1] bg-[#4C80F1]/5 shadow-sm text-[#4C80F1]"
                      : "border-gray-200 hover:border-gray-300 text-gray-600"
                  }`}
                >
                  <FramePreviewIcon style={id} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {options.frameStyle !== "none" && (
            <>
              <div>
                <label className="block text-[12px] text-gray-500 mb-1.5 ml-0.5">Frame Text</label>
                <input
                  className="w-full px-4 py-2.5 rounded-xl bg-white/80 border border-gray-200/80 focus:border-[#4C80F1] focus:ring-2 focus:ring-[#4C80F1]/10 outline-none text-[14px] transition-all"
                  placeholder="Scan Me!"
                  value={options.frameText}
                  onChange={(e) => onChange({ frameText: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[12px] text-gray-500 mb-2 ml-0.5">Frame Color</label>
                <div className="flex items-center gap-2">
                  {["#000000", "#7c3aed", "#2563eb", "#059669", "#dc2626", "#ea580c"].map((c) => (
                    <button
                      key={c}
                      onClick={() => onChange({ frameColor: c })}
                      className={`w-7 h-7 rounded-lg border-2 transition-all cursor-pointer ${
                        options.frameColor === c ? "border-[#4C80F1] scale-110 shadow-md" : "border-transparent"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <input
                    type="color"
                    value={options.frameColor}
                    onChange={(e) => onChange({ frameColor: e.target.value })}
                    className="w-7 h-7 rounded-lg cursor-pointer border-0 p-0"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function FramePreviewIcon({ style }: { style: FrameStyle }) {
  const box = "w-5 h-5 bg-gray-400/40";
  switch (style) {
    case "none":
      return <div className={`${box} rounded-sm`} />;
    case "simple":
      return <div className={`${box} rounded-sm border-2 border-gray-500`} />;
    case "rounded":
      return <div className={`${box} rounded-lg border-2 border-gray-500`} />;
    case "badge":
      return (
        <div className="relative">
          <div className={`${box} rounded-sm border-2 border-gray-500`} />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-gray-500 rounded-full" />
        </div>
      );
    case "banner":
      return (
        <div className="flex flex-col items-center gap-0.5">
          <div className={`w-5 h-4 bg-gray-400/40 rounded-sm border-2 border-gray-500`} />
          <div className="w-5 h-1.5 bg-gray-500 rounded-sm" />
        </div>
      );
    default:
      return <div className={box} />;
  }
}
