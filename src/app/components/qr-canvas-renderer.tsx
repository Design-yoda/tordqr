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

const MAX_QR_BYTES = 2800;

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
    data: value || " ",
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

    useEffect(() => {
      setError(null);
      const bytes = new TextEncoder().encode(value);
      if (bytes.length > MAX_QR_BYTES) {
        setError("too-large");
        return;
      }
      try {
        if (!qrRef.current) {
          const qr = new QRCodeStyling(buildQROptions(value, options, displaySize));
          qrRef.current = qr;
          if (containerRef.current) {
            containerRef.current.innerHTML = "";
            qr.append(containerRef.current);
          }
        } else {
          qrRef.current.update(buildQROptions(value, options, displaySize));
        }
      } catch (e) {
        console.error("QR error:", e);
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
      try {
        // Prefer grabbing the rendered canvas directly — most reliable
        const canvas = containerRef.current?.querySelector("canvas");
        if (canvas) {
          const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
          if (blob) {
            await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
            return true;
          }
        }
        // Fallback: qr-code-styling's built-in getRawData
        if (qrRef.current) {
          const blob = await qrRef.current.getRawData("png");
          if (blob) {
            await navigator.clipboard.write([new ClipboardItem({ "image/png": blob as Blob })]);
            return true;
          }
        }
        return false;
      } catch {
        return false;
      }
    }, []);

    useImperativeHandle(ref, () => ({ downloadPNG, downloadSVG, copyToClipboard }));

    if (error) {
      const isTooLarge = error === "too-large";
      return (
        <div
          className="flex flex-col items-center justify-center rounded-2xl bg-red-50 border border-red-100 text-center p-4 gap-1"
          style={{ width: displaySize, height: displaySize }}
        >
          <p className="text-[12px] text-red-400 font-medium">
            {isTooLarge ? "File too large for QR code" : error}
          </p>
          <p className="text-[11px] text-red-300 leading-snug">
            {isTooLarge
              ? "Upload your file to Google Drive or Dropbox and paste the shareable link in URL mode."
              : "Content may be too large for a QR code."}
          </p>
        </div>
      );
    }

    return <div ref={containerRef} className="relative inline-block" />;
  }
);
