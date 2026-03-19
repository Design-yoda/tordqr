import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import type { QRStyleOptions, DotStyle, CornerStyle } from "./qr-customizer";

export interface QRCanvasHandle {
  downloadPNG: () => void;
  downloadSVG: () => void;
  copyToClipboard: () => Promise<boolean>;
}

interface QRCanvasRendererProps {
  value: string;
  options: QRStyleOptions;
  displaySize: number;
}

type QRDotType = "rounded" | "dots" | "classy" | "classy-rounded" | "square" | "extra-rounded";
type QRCornerSquareType = "dot" | "square" | "extra-rounded";
type QRCornerDotType = "dot" | "square";

function mapDotStyle(style: DotStyle): QRDotType {
  switch (style) {
    case "rounded": return "rounded";
    case "dots": return "dots";
    case "classy": return "classy";
    case "classy-rounded": return "classy-rounded";
    default: return "square";
  }
}

function mapCornerSquareStyle(style: CornerStyle): QRCornerSquareType {
  switch (style) {
    case "rounded": return "extra-rounded";
    case "dot": return "dot";
    default: return "square";
  }
}

function mapCornerDotStyle(style: CornerStyle): QRCornerDotType {
  switch (style) {
    case "dot": return "dot";
    default: return "square";
  }
}

/** Clamp value to QR-safe length (binary mode max ~2900 bytes). */
function safeValue(raw: string): string {
  // Encode to measure byte length
  const bytes = new TextEncoder().encode(raw);
  if (bytes.length <= 2800) return raw;
  // Truncate to fit — strip from the end
  const decoder = new TextDecoder();
  return decoder.decode(bytes.slice(0, 2800));
}

function buildQROptions(value: string, options: QRStyleOptions, size: number) {
  const gradient = options.gradientEnabled
    ? {
        type: "linear" as const,
        rotation: 45,
        colorStops: [
          { offset: 0, color: options.fgColor },
          { offset: 1, color: options.gradientColor2 },
        ],
      }
    : undefined;

  return {
    width: size,
    height: size,
    data: safeValue(value) || " ",
    dotsOptions: {
      type: mapDotStyle(options.dotStyle),
      ...(gradient ? { gradient } : { color: options.fgColor }),
    },
    cornersSquareOptions: {
      type: mapCornerSquareStyle(options.cornerStyle),
      ...(gradient ? { gradient } : { color: options.fgColor }),
    },
    cornersDotOptions: {
      type: mapCornerDotStyle(options.cornerStyle),
      ...(gradient ? { gradient } : { color: options.fgColor }),
    },
    backgroundOptions: {
      color: options.bgColor,
    },
    ...(options.logoUrl
      ? {
          image: options.logoUrl,
          imageOptions: {
            crossOrigin: "anonymous",
            imageSize: 0.3,
            margin: 4,
            hideBackgroundDots: true,
          },
          qrOptions: { errorCorrectionLevel: "H" as const },
        }
      : {
          qrOptions: { errorCorrectionLevel: "M" as const },
        }),
  };
}

export const QRCanvasRenderer = forwardRef<QRCanvasHandle, QRCanvasRendererProps>(
  ({ value, options, displaySize }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const qrRef = useRef<QRCodeStyling | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Initialize once
    useEffect(() => {
      setError(null);
      try {
        const qr = new QRCodeStyling(buildQROptions(value, options, displaySize));
        qrRef.current = qr;
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
          qr.append(containerRef.current);
        }
      } catch (e) {
        console.error("QR init error:", e);
        setError("Could not generate QR code.");
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update on value / options change
    useEffect(() => {
      if (!qrRef.current) return;
      setError(null);
      try {
        qrRef.current.update(buildQROptions(value, options, displaySize));
      } catch (e) {
        console.error("QR update error:", e);
        setError("Could not generate QR code.");
      }
    }, [value, options, displaySize]);

    const downloadPNG = useCallback(() => {
      qrRef.current?.download({ name: "qrcode", extension: "png" });
    }, []);

    const downloadSVG = useCallback(() => {
      qrRef.current?.download({ name: "qrcode", extension: "svg" });
    }, []);

    const copyToClipboard = useCallback(async (): Promise<boolean> => {
      if (!qrRef.current) return false;
      try {
        const blob = await qrRef.current.getRawData("png");
        if (!blob) return false;
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob as Blob })]);
        return true;
      } catch {
        return false;
      }
    }, []);

    useImperativeHandle(ref, () => ({ downloadPNG, downloadSVG, copyToClipboard }));

    if (error) {
      return (
        <div
          className="flex flex-col items-center justify-center rounded-2xl bg-red-50 border border-red-100 text-center p-4"
          style={{ width: displaySize, height: displaySize }}
        >
          <p className="text-[12px] text-red-400 font-medium">{error}</p>
          <p className="text-[11px] text-red-300 mt-1">Content may be too large for a QR code.</p>
        </div>
      );
    }

    return <div ref={containerRef} className="relative inline-block" />;
  }
);
