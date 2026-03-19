import type { FrameStyle } from "./qr-customizer";

interface QRFrameWrapperProps {
  frameStyle: FrameStyle;
  frameText: string;
  frameColor: string;
  children: React.ReactNode;
}

export function QRFrameWrapper({ frameStyle, frameText, frameColor, children }: QRFrameWrapperProps) {
  if (frameStyle === "none") {
    return <>{children}</>;
  }

  const text = frameText || "Scan Me";

  switch (frameStyle) {
    case "simple":
      return (
        <div className="flex flex-col items-center" style={{ color: frameColor }}>
          <div
            className="p-3 border-[3px] rounded-sm"
            style={{ borderColor: frameColor }}
          >
            {children}
          </div>
          <div
            className="mt-0 px-4 py-1.5 text-[13px] text-white tracking-wide"
            style={{ backgroundColor: frameColor, fontWeight: 600 }}
          >
            {text}
          </div>
        </div>
      );

    case "rounded":
      return (
        <div className="flex flex-col items-center" style={{ color: frameColor }}>
          <div
            className="p-3 border-[3px] rounded-2xl"
            style={{ borderColor: frameColor }}
          >
            {children}
          </div>
          <div
            className="-mt-3 px-5 py-1.5 rounded-full text-[13px] text-white tracking-wide z-10"
            style={{ backgroundColor: frameColor, fontWeight: 600 }}
          >
            {text}
          </div>
        </div>
      );

    case "badge":
      return (
        <div className="flex flex-col items-center" style={{ color: frameColor }}>
          <div
            className="px-5 py-1.5 rounded-t-xl text-[11px] text-white tracking-widest uppercase"
            style={{ backgroundColor: frameColor, fontWeight: 700 }}
          >
            {text}
          </div>
          <div
            className="p-3 border-[3px] border-t-0 rounded-b-xl"
            style={{ borderColor: frameColor }}
          >
            {children}
          </div>
        </div>
      );

    case "banner":
      return (
        <div className="flex flex-col items-center" style={{ color: frameColor }}>
          <div
            className="p-4 rounded-2xl relative"
            style={{ backgroundColor: frameColor }}
          >
            <div className="bg-white rounded-lg p-1">
              {children}
            </div>
            <div className="mt-2 text-center">
              <span
                className="text-[13px] text-white tracking-wide"
                style={{ fontWeight: 600 }}
              >
                {text}
              </span>
            </div>
          </div>
        </div>
      );

    default:
      return <>{children}</>;
  }
}
