import { useState, useCallback } from "react";
import { QRTypeSelector, type QRType } from "./components/qr-type-selector";
import { QRForm } from "./components/qr-form";
import { QRCustomizer, type QRStyleOptions } from "./components/qr-customizer";
import { QRPreview } from "./components/qr-preview";
import { PhoneMockupPreview } from "./components/phone-mockup-preview";
import { LandingPage } from "./components/landing-page";
import logoUrl from "@/assets/logo.svg";
import {
  ChevronDown,
  ChevronUp,
  Palette,
  Eye,
  QrCode,
  Smartphone,
} from "lucide-react";

const DEFAULT_OPTIONS: QRStyleOptions = {
  fgColor: "#000000",
  bgColor: "#ffffff",
  size: 256,
  dotStyle: "square",
  cornerStyle: "square",
  frameStyle: "none",
  frameText: "Scan Me",
  frameColor: "#000000",
  logoUrl: null,
  gradientEnabled: false,
  gradientColor2: "#4C80F1",
};

/* ── Hash-based landing page detection ─────────────────────────────────── */
function getLandingPageProps(): { type: string; data: Record<string, any> } | null {
  const hash = window.location.hash;
  if (!hash.startsWith("#view?")) return null;
  try {
    const params = new URLSearchParams(hash.slice("#view?".length));
    const type = params.get("type");
    const d    = params.get("d");
    if (!type || !d) return null;
    const data = JSON.parse(decodeURIComponent(escape(atob(d))));
    return { type, data };
  } catch {
    return null;
  }
}

export default function App() {
  // If the URL hash encodes a landing page, render it directly (no editor)
  const landing = getLandingPageProps();
  if (landing) return <LandingPage type={landing.type} data={landing.data} />;

  const [qrType, setQrType] = useState<QRType>("url");
  const [qrValue, setQrValue] = useState("");
  const [options, setOptions] = useState<QRStyleOptions>(DEFAULT_OPTIONS);
  const [showCustomize, setShowCustomize] = useState(true);
  const [meta, setMeta] = useState<Record<string, any>>({});
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const [previewTab, setPreviewTab] = useState<"preview" | "qrcode">("qrcode");

  const updateOptions = useCallback(
    (partial: Partial<QRStyleOptions>) => {
      setOptions((prev) => ({ ...prev, ...partial }));
    },
    []
  );

  const handleMetaChange = useCallback((m: Record<string, any>) => {
    setMeta(m);
  }, []);

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{
        fontFamily: "'Onest', system-ui, sans-serif",
        background:
          "linear-gradient(145deg, #f0f4ff 0%, #e8effe 25%, #e0e7ff 50%, #dbeafe 75%, #f0f9ff 100%)",
      }}
    >
      {/* Header */}
      <header className="w-full py-4 px-4 sm:px-6 border-b border-white/0 bg-white/30 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <img src={logoUrl} alt="Tord QR" className="h-7 sm:h-8" />
          </div>
          <span className="text-[12px] text-gray-400 hidden sm:block">
            Free QR Code Generator
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full px-3 sm:px-6 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-6 mt-5 sm:mt-6">
            <h1
              className="text-[24px] sm:text-[36px] tracking-tight text-gray-900"
              style={{ fontWeight: 800 }}
            >
              Generate QR Codes Instantly{" "}
              {/* <span style={{ color: "#4C80F1" }}>Instantly</span> */}
            </h1>
            <p className="text-gray-500 mt-1.5 text-[13px] sm:text-[15px] max-w-lg mx-auto">
              Create beautiful QR codes for URLs, social media, menus, app
              stores, and more. Fully customizable.
            </p>
          </div>

          {/* Type Selector */}
          <div className="max-w-3xl mx-auto mb-6">
            <QRTypeSelector selected={qrType} onChange={setQrType} />
          </div>

          {/* Mobile Tab Toggle */}
          <div className="flex gap-2 mb-4 lg:hidden">
            <button
              onClick={() => setMobileTab("edit")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] transition-all cursor-pointer ${
                mobileTab === "edit"
                  ? "text-white shadow-lg"
                  : "bg-white/50 text-gray-600 border border-gray-200/50"
              }`}
              style={mobileTab === "edit" ? { backgroundColor: "#4C80F1" } : {}}
            >
              <Palette className="w-4 h-4" /> Edit & Customize
            </button>
            <button
              onClick={() => setMobileTab("preview")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] transition-all cursor-pointer ${
                mobileTab === "preview"
                  ? "text-white shadow-lg"
                  : "bg-white/50 text-gray-600 border border-gray-200/50"
              }`}
              style={mobileTab === "preview" ? { backgroundColor: "#4C80F1" } : {}}
            >
              <Eye className="w-4 h-4" /> Preview
            </button>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 max-w-5xl mx-auto">
            {/* Left: Form + Customizer */}
            <div
              className={`lg:col-span-7 space-y-4 ${
                mobileTab !== "edit" ? "hidden lg:block" : ""
              }`}
            >
              {/* Content Card */}
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-white/80 shadow-xl shadow-gray-200/30">
                <h3
                  className="text-[14px] text-gray-800 mb-3"
                  style={{ fontWeight: 600 }}
                >
                  Content
                </h3>
                <QRForm
                  type={qrType}
                  onValueChange={setQrValue}
                  onMetaChange={handleMetaChange}
                />
              </div>

              {/* Customizer Card */}
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-white/80 shadow-xl shadow-gray-200/30 overflow-hidden">
                <button
                  onClick={() => setShowCustomize(!showCustomize)}
                  className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 cursor-pointer hover:bg-white/30 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4" style={{ color: "#4C80F1" }} />
                    <h3
                      className="text-[14px] text-gray-800"
                      style={{ fontWeight: 600 }}
                    >
                      Customize Design
                    </h3>
                  </div>
                  {showCustomize ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                {showCustomize && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                    <QRCustomizer options={options} onChange={updateOptions} />
                  </div>
                )}
              </div>
            </div>

            {/* Right: Preview */}
            <div
              className={`lg:col-span-5 ${
                mobileTab !== "preview" ? "hidden lg:block" : ""
              }`}
            >
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-white/80 shadow-xl shadow-gray-200/30 sticky top-[72px]">
                {/* Preview / QR Code Toggle */}
                <div className="flex items-center justify-center mb-4">
                  <div className="flex bg-gray-100/80 rounded-xl p-1 gap-0.5">
                    <button
                      onClick={() => setPreviewTab("preview")}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] transition-all cursor-pointer ${
                        previewTab === "preview"
                          ? "bg-white shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      style={{
                        fontWeight: previewTab === "preview" ? 600 : 400,
                        color: previewTab === "preview" ? "#4C80F1" : undefined,
                      }}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      Preview
                    </button>
                    <button
                      onClick={() => setPreviewTab("qrcode")}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] transition-all cursor-pointer ${
                        previewTab === "qrcode"
                          ? "bg-white shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      style={{
                        fontWeight: previewTab === "qrcode" ? 600 : 400,
                        color: previewTab === "qrcode" ? "#4C80F1" : undefined,
                      }}
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      QR Code
                    </button>
                  </div>
                </div>

                {previewTab === "qrcode" ? (
                  <QRPreview value={qrValue} options={options} />
                ) : (
                  <PhoneMockupPreview
                    type={qrType}
                    value={qrValue}
                    meta={meta}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-5 text-center text-[11px] text-gray-400 border-t border-white/30">
        QR Studio — Generate unlimited QR codes for free
      </footer>
    </div>
  );
}
