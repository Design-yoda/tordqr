import { useRef, useCallback, useState } from "react";
import { Download, Copy, Check, ChevronDown } from "lucide-react";
import type { QRStyleOptions } from "./qr-customizer";
import { QRCanvasRenderer, type QRCanvasHandle } from "./qr-canvas-renderer";
import { QRFrameWrapper } from "./qr-frame-wrapper";

interface QRPreviewProps {
  value: string;
  options: QRStyleOptions;
}

export function QRPreview({ value, options }: QRPreviewProps) {
  const rendererRef = useRef<QRCanvasHandle>(null);
  const [copied, setCopied] = useState(false);
  const [showFormats, setShowFormats] = useState(false);

  const hasValue =
    value.length > 0 &&
    value !== "mailto:" &&
    value !== "tel:" &&
    value !== "sms:" &&
    value !== "WIFI:T:WPA;S:;P:;;";

  const handleDownloadPNG = useCallback(() => {
    rendererRef.current?.downloadPNG();
  }, []);

  const handleDownloadSVG = useCallback(() => {
    rendererRef.current?.downloadSVG();
  }, []);

  const handleCopy = useCallback(async () => {
    const ok = await rendererRef.current?.copyToClipboard();
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  const displaySize = Math.min(options.size, 260);

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center justify-center">
        {hasValue ? (
          <QRFrameWrapper
            frameStyle={options.frameStyle}
            frameText={options.frameText}
            frameColor={options.frameColor}
          >
            <QRCanvasRenderer
              ref={rendererRef}
              value={value}
              options={options}
              displaySize={displaySize}
            />
          </QRFrameWrapper>
        ) : (
          <div
            className="flex items-center justify-center text-gray-300 bg-gray-50/50 rounded-2xl"
            style={{ width: displaySize, height: displaySize }}
          >
            <div className="text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-xl bg-gray-100/80 flex items-center justify-center">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="3" height="3" />
                  <rect x="18" y="18" width="3" height="3" />
                </svg>
              </div>
              <p className="text-[12px] px-4">
                Fill in the content to generate your QR code
              </p>
            </div>
          </div>
        )}
      </div>

      {hasValue && (
        <div className="flex gap-2 w-full">
          <div className="flex-1 relative">
            <div className="flex rounded-xl overflow-hidden shadow-lg shadow-[#4C80F1]/15">
              <button
                onClick={handleDownloadPNG}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#4C80F1] text-white hover:bg-[#3B6FE0] transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span className="text-[13px]">Download</span>
              </button>
              <button
                onClick={() => setShowFormats(!showFormats)}
                className="px-2 bg-[#3B6FE0] text-white hover:bg-[#2A5FCE] transition-colors cursor-pointer border-l border-[#4C80F1]/30"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${showFormats ? "rotate-180" : ""}`}
                />
              </button>
            </div>
            {showFormats && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-10">
                <button
                  onClick={() => {
                    handleDownloadPNG();
                    setShowFormats(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-[13px] hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span>PNG</span>
                  <span className="text-[11px] text-gray-400">High Quality</span>
                </button>
                <button
                  onClick={() => {
                    handleDownloadSVG();
                    setShowFormats(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-[13px] hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between border-t border-gray-50"
                >
                  <span>SVG</span>
                  <span className="text-[11px] text-gray-400">Scalable</span>
                </button>
              </div>
            )}
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer shadow-sm"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
