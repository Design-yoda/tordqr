import type { QRType } from "./qr-type-selector";
import {
  Globe,
  Wifi,
  WifiOff,
  Phone,
  Mail,
  MessageSquare,
  User,
  Share2,
  UtensilsCrossed,
  Smartphone,
  ExternalLink,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Linkedin,
  Github,
  Music,
  MessageCircle,
  ChevronLeft,
  Lock,
  Check,
  MapPin,
  Star,
  Download,
  Tag,
  FileText,
  Music2,
  List,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Mic,
  Video as VideoIcon,
} from "lucide-react";

interface PhoneMockupPreviewProps {
  type: QRType;
  value: string;
  meta?: Record<string, any>;
}

const PLATFORM_META: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  instagram: { icon: Instagram, color: "#E4405F", label: "Instagram" },
  twitter:   { icon: Twitter,   color: "#000000", label: "X / Twitter" },
  facebook:  { icon: Facebook,  color: "#1877F2", label: "Facebook" },
  youtube:   { icon: Youtube,   color: "#FF0000", label: "YouTube" },
  linkedin:  { icon: Linkedin,  color: "#0A66C2", label: "LinkedIn" },
  github:    { icon: Github,    color: "#181717", label: "GitHub" },
  tiktok:    { icon: Music,     color: "#000000", label: "TikTok" },
  whatsapp:  { icon: MessageCircle, color: "#25D366", label: "WhatsApp" },
  website:   { icon: Globe,     color: "#4C80F1", label: "Website" },
};

/* ─── iOS Phone Shell ──────────────────────────────────────────────────── */
export function PhoneMockupPreview({ type, value, meta }: PhoneMockupPreviewProps) {
  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative" style={{ width: 252, height: 508 }}>

        {/* Left buttons: mute + vol− + vol+ */}
        <div className="absolute left-0 top-[76px]  w-[3px] h-[26px] rounded-l-[3px]" style={{ backgroundColor: "#3A3A3C", left: -3 }} />
        <div className="absolute left-0 top-[116px] w-[3px] h-[34px] rounded-l-[3px]" style={{ backgroundColor: "#3A3A3C", left: -3 }} />
        <div className="absolute left-0 top-[158px] w-[3px] h-[34px] rounded-l-[3px]" style={{ backgroundColor: "#3A3A3C", left: -3 }} />
        {/* Right button: power */}
        <div className="absolute top-[130px] w-[3px] h-[52px] rounded-r-[3px]" style={{ backgroundColor: "#3A3A3C", right: -3 }} />

        {/* Phone body */}
        <div
          className="relative w-full h-full overflow-hidden shadow-2xl"
          style={{
            borderRadius: 46,
            background: "linear-gradient(160deg, #48484A 0%, #1C1C1E 40%, #2C2C2E 100%)",
            padding: 10,
            boxShadow: "0 0 0 1px #48484A, 0 32px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          {/* Screen */}
          <div className="relative w-full h-full bg-white overflow-hidden" style={{ borderRadius: 36 }}>

            {/* Status bar + Dynamic Island integrated */}
            <StatusBar />

            {/* Content – starts below status bar */}
            <div className="absolute left-0 right-0 overflow-hidden" style={{ top: 52, bottom: 22 }}>
              <PhoneContent type={type} value={value} meta={meta} />
            </div>

            {/* Home indicator */}
            <div
              className="absolute bottom-[5px] left-1/2 -translate-x-1/2 rounded-full"
              style={{ width: 104, height: 4, backgroundColor: "rgba(0,0,0,0.22)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Status bar with Dynamic Island centered ──────────────────────────── */
function StatusBar() {
  return (
    <div className="absolute top-0 left-0 right-0 z-30" style={{ height: 52 }}>
      {/* Dynamic Island pill – black, vertically centered in status bar */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: 10,
          width: 96,
          height: 28,
          backgroundColor: "#000",
          borderRadius: 50,
          zIndex: 10,
        }}
      />
      {/* Time left / icons right – sit beside the pill */}
      <div
        className="absolute inset-0 flex items-center justify-between"
        style={{ paddingLeft: 20, paddingRight: 14, paddingTop: 4 }}
      >
        <span className="text-[12px] font-bold text-gray-900 z-20" style={{ letterSpacing: -0.2 }}>
          9:41
        </span>
        <div className="flex items-center gap-[5px] z-20">
          {/* Signal */}
          <div className="flex items-end gap-[2px]">
            {[3, 5, 7, 9].map((h, i) => (
              <div key={i} className="w-[3px] rounded-[1px] bg-gray-900" style={{ height: h }} />
            ))}
          </div>
          {/* WiFi */}
          <Wifi className="text-gray-900" style={{ width: 13, height: 13 }} />
          {/* Battery */}
          <div className="flex items-center gap-[2px]">
            <div
              className="relative flex items-center"
              style={{ width: 22, height: 11, border: "1.5px solid #1C1C1E", borderRadius: 3 }}
            >
              <div
                className="absolute bg-gray-900 rounded-[1px]"
                style={{ inset: "1.5px", right: "22%" }}
              />
            </div>
            <div className="bg-gray-900 rounded-r-[1px]" style={{ width: 2, height: 5 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Router ────────────────────────────────────────────────────────────── */
function PhoneContent({ type, value, meta }: { type: QRType; value: string; meta?: Record<string, any> }) {
  switch (type) {
    case "url":      return <URLPreview value={value} />;
    case "text":     return <TextPreview value={value} />;
    case "email":    return <EmailPreview value={value} />;
    case "phone":    return <PhoneCallPreview value={value} meta={meta} />;
    case "sms":      return <SMSPreview value={value} />;
    case "wifi":     return <WiFiPreview value={value} />;
    case "vcard":    return <VCardPreview value={value} meta={meta} />;
    case "social":   return <SocialPhonePreview meta={meta} />;
    case "menu":     return <MenuPhonePreview meta={meta} />;
    case "appstore": return <AppStorePreview meta={meta} />;
    case "coupon":   return <CouponPreview meta={meta} />;
    case "pdf":      return <PDFPreview meta={meta} />;
    case "video":    return <VideoPreview meta={meta} />;
    case "audio":    return <AudioPreview meta={meta} />;
    case "links":    return <LinksPreview meta={meta} />;
    default:         return <EmptyPreview />;
  }
}

/* ─── URL / Safari ──────────────────────────────────────────────────────── */
function URLPreview({ value }: { value: string }) {
  let displayUrl = value || "example.com";
  try {
    const u = new URL(value);
    displayUrl = u.hostname + (u.pathname !== "/" ? u.pathname : "");
  } catch { /* keep raw */ }

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="bg-[#F2F2F7] px-3 pt-2 pb-2 border-b border-gray-200">
        <div className="flex items-center gap-2 bg-white rounded-[10px] px-3 py-[7px] border border-gray-200/80 shadow-sm">
          <Lock className="w-[9px] h-[9px] text-gray-500 shrink-0" />
          <span className="text-[10px] text-gray-600 truncate flex-1 text-center">{displayUrl}</span>
          <div className="w-[9px]" />
        </div>
        <div className="flex items-center justify-between mt-2 px-1">
          <ChevronLeft className="w-4 h-4 text-[#4C80F1]" />
          <div className="flex items-center gap-4">
            <div className="w-4 h-4 rounded-sm border-[1.5px] border-gray-400 flex items-center justify-center">
              <span className="text-[7px] text-gray-400 font-bold">1</span>
            </div>
            <Globe className="w-3.5 h-3.5 text-[#4C80F1]" />
          </div>
        </div>
      </div>
      <div className="flex-1 p-4 space-y-3">
        <div className="h-24 bg-gradient-to-br from-[#4C80F1]/10 to-[#4C80F1]/20 rounded-xl flex items-center justify-center">
          <Globe className="w-8 h-8 text-[#4C80F1]/40" />
        </div>
        <div className="space-y-2">
          <div className="h-2.5 bg-gray-100 rounded-full w-4/5" />
          <div className="h-2.5 bg-gray-100 rounded-full w-3/5" />
          <div className="h-2.5 bg-gray-100 rounded-full w-full" />
          <div className="h-2.5 bg-gray-100 rounded-full w-2/3" />
        </div>
        <div className="h-14 bg-gray-50 rounded-xl" />
        <div className="space-y-2">
          <div className="h-2.5 bg-gray-100 rounded-full w-full" />
          <div className="h-2.5 bg-gray-100 rounded-full w-4/5" />
        </div>
      </div>
    </div>
  );
}

/* ─── Text / Notes ──────────────────────────────────────────────────────── */
function TextPreview({ value }: { value: string }) {
  return (
    <div className="h-full bg-[#FFFDE7] flex flex-col">
      <div className="px-4 pt-3 pb-2 border-b border-yellow-200/80 flex items-center justify-between">
        <ChevronLeft className="w-4 h-4 text-[#4C80F1]" />
        <span className="text-[12px] font-semibold text-gray-800">Notes</span>
        <button className="text-[11px] text-[#4C80F1] font-medium">Done</button>
      </div>
      <div
        className="flex-1 p-4"
        style={{ backgroundImage: "repeating-linear-gradient(transparent,transparent 27px,#fde68a 27px,#fde68a 28px)", backgroundSize: "100% 28px" }}
      >
        <p className="text-[11px] text-gray-800 break-words whitespace-pre-wrap leading-7">
          {value || "Your text content will appear here…"}
        </p>
      </div>
    </div>
  );
}

/* ─── Email / Mail ──────────────────────────────────────────────────────── */
function EmailPreview({ value }: { value: string }) {
  let to = "", subject = "", body = "";
  try {
    const url = new URL(value);
    to = url.pathname || "";
    subject = url.searchParams.get("subject") || "";
    body = url.searchParams.get("body") || "";
  } catch { to = value.replace("mailto:", ""); }

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="bg-[#F2F2F7] px-4 pt-2 pb-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <ChevronLeft className="w-4 h-4 text-[#4C80F1]" />
          <span className="text-[12px] font-semibold text-gray-800">New Message</span>
          <button className="text-[11px] text-[#4C80F1] font-semibold">Send</button>
        </div>
      </div>
      <div className="flex-1 p-3 space-y-0">
        {[
          { l: "To:",      v: to || "recipient@email.com" },
          { l: "Cc/Bcc:", v: "" },
          { l: "From:",    v: "me@icloud.com" },
          { l: "Subject:", v: subject || "" },
        ].map((r) => (
          <div key={r.l} className="flex items-center gap-2 py-2 border-b border-gray-100">
            <span className="text-[9px] text-gray-400 w-14 shrink-0">{r.l}</span>
            <span className="text-[10px] text-gray-800">{r.v}</span>
          </div>
        ))}
        <div className="pt-3">
          <p className="text-[10px] text-gray-600 leading-relaxed">{body}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Phone call ────────────────────────────────────────────────────────── */
function PhoneCallPreview({ value, meta }: { value: string; meta?: Record<string, any> }) {
  const number = value.replace("tel:", "") || "+1 234 567 8900";
  const photoUrl = meta?.photoUrl;

  return (
    <div className="h-full flex flex-col items-center justify-between py-5"
      style={{ background: "linear-gradient(180deg, #1C1C1E 0%, #2C2C2E 100%)" }}>
      <div className="text-center">
        {photoUrl ? (
          <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-2 border-2 border-white/20">
            <img src={photoUrl} alt="" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center mx-auto mb-2">
            <User className="w-10 h-10 text-gray-400" />
          </div>
        )}
        <div className="text-[16px] font-semibold text-white">{number}</div>
        <div className="text-[11px] text-gray-400 mt-0.5">mobile · calling…</div>
      </div>
      <div className="grid grid-cols-3 gap-4 px-4 w-full">
        {[{ icon: Mic, label: "mute" }, { icon: Phone, label: "keypad" }, { icon: Volume2, label: "speaker" }].map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-[8px] text-gray-400">{label}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/40">
          <Phone className="w-6 h-6 text-white rotate-[135deg]" />
        </div>
        <span className="text-[8px] text-gray-500">end</span>
      </div>
    </div>
  );
}

/* ─── SMS / Messages ────────────────────────────────────────────────────── */
function SMSPreview({ value }: { value: string }) {
  let phone = "", message = "";
  try {
    const [base, params] = value.split("?");
    phone = base.replace("sms:", "") || "+1 234 567 8900";
    if (params) message = new URLSearchParams(params).get("body") || "";
  } catch { phone = value.replace("sms:", ""); }

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="bg-[#F2F2F7] px-3 pt-2 pb-2.5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <ChevronLeft className="w-4 h-4 text-[#4C80F1]" />
          <div className="flex-1 flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center mb-0.5">
              <User className="w-5 h-5 text-gray-500" />
            </div>
            <span className="text-[10px] font-semibold text-gray-800">{phone}</span>
          </div>
          <VideoIcon className="w-4 h-4 text-[#4C80F1]" />
        </div>
      </div>
      <div className="flex-1 p-3 flex flex-col justify-end">
        {message ? (
          <div className="flex justify-end mb-2">
            <div className="rounded-[18px] rounded-br-[4px] px-3 py-2 max-w-[80%]" style={{ backgroundColor: "#4C80F1" }}>
              <p className="text-[10px] text-white leading-relaxed">{message}</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[10px] text-gray-300">No messages yet</p>
          </div>
        )}
      </div>
      <div className="px-3 pb-3 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-white border border-gray-300 rounded-full px-3 py-1.5">
            <span className="text-[9px] text-gray-400">iMessage</span>
          </div>
          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: "#4C80F1" }}>
            <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3 -rotate-90">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── WiFi / Settings ───────────────────────────────────────────────────── */
function WiFiPreview({ value }: { value: string }) {
  let ssid = "", encryption = "";
  const ssidMatch = value.match(/S:([^;]*)/);
  const encMatch  = value.match(/T:([^;]*)/);
  if (ssidMatch) ssid = ssidMatch[1];
  if (encMatch)  encryption = encMatch[1];

  return (
    <div className="h-full bg-[#F2F2F7] flex flex-col">
      <div className="bg-[#F2F2F7] px-4 pt-2 pb-3 border-b border-gray-300/40">
        <div className="flex items-center gap-2">
          <ChevronLeft className="w-4 h-4 text-[#4C80F1]" />
          <span className="text-[14px] font-semibold text-gray-900">Wi-Fi</span>
        </div>
      </div>
      <div className="p-3 space-y-2">
        <div className="bg-white rounded-xl px-3 py-2.5 flex items-center justify-between">
          <span className="text-[12px] text-gray-900">Wi-Fi</span>
          <div className="w-8 h-5 rounded-full flex items-center px-0.5" style={{ backgroundColor: "#34C759" }}>
            <div className="w-4 h-4 rounded-full bg-white shadow ml-auto" />
          </div>
        </div>
        <div className="text-[9px] text-gray-500 px-3 pt-1 uppercase tracking-wider font-medium">My Networks</div>
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="px-3 py-2.5 flex items-center gap-3 border-b border-gray-100">
            <Wifi className="w-4 h-4 shrink-0" style={{ color: "#4C80F1" }} />
            <div className="flex-1">
              <div className="text-[11px] font-semibold text-gray-900">{ssid || "Network Name"}</div>
              <div className="text-[9px] text-gray-400">{encryption !== "nopass" ? "Secured" : "Open"} · {encryption || "WPA2"}</div>
            </div>
            <Check className="w-4 h-4" style={{ color: "#4C80F1" }} />
          </div>
        </div>
        <div className="text-[9px] text-gray-500 px-3 pt-1 uppercase tracking-wider font-medium">Other Networks</div>
        <div className="bg-white rounded-xl overflow-hidden opacity-50">
          {["HomeWifi", "GuestNetwork"].map((n) => (
            <div key={n} className="px-3 py-2.5 flex items-center gap-3 border-b border-gray-100 last:border-0">
              <WifiOff className="w-4 h-4 text-gray-300 shrink-0" />
              <span className="text-[11px] text-gray-400">{n}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── vCard / Contacts ──────────────────────────────────────────────────── */
function VCardPreview({ value, meta }: { value: string; meta?: Record<string, any> }) {
  let name = "", phone = "", email = "", org = "", url = "";
  value.split("\n").forEach((line) => {
    if (line.startsWith("FN:"))    name  = line.slice(3);
    if (line.startsWith("TEL:"))   phone = line.slice(4);
    if (line.startsWith("EMAIL:")) email = line.slice(6);
    if (line.startsWith("ORG:"))   org   = line.slice(4);
    if (line.startsWith("URL:"))   url   = line.slice(4);
  });
  const initial  = name ? name[0].toUpperCase() : "?";
  const photoUrl = meta?.photoUrl;

  return (
    <div className="h-full bg-[#F2F2F7] flex flex-col">
      <div className="bg-[#F2F2F7] px-4 pt-2 pb-1 flex items-center justify-between">
        <ChevronLeft className="w-4 h-4 text-[#4C80F1]" />
        <span className="text-[11px] text-[#4C80F1]">Edit</span>
      </div>
      <div className="flex flex-col items-center pt-2 pb-4 px-4">
        {photoUrl ? (
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-lg mb-2">
            <img src={photoUrl} alt="" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-[26px] font-bold mb-2 shadow-lg"
            style={{ background: "linear-gradient(135deg, #4C80F1, #6B9CF4)" }}>
            {initial}
          </div>
        )}
        <div className="text-[16px] font-semibold text-gray-900">{name || "Contact Name"}</div>
        {org && <div className="text-[11px] text-gray-500 mt-0.5">{org}</div>}
        <div className="flex gap-4 mt-3">
          {[
            { icon: MessageSquare, label: "message" },
            { icon: Phone, label: "call" },
            { icon: VideoIcon, label: "video" },
            { icon: Mail, label: "mail" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#4C80F1" }}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-[8px] text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="px-3 space-y-1">
        {([
          phone && { icon: Phone,  label: "mobile",  val: phone },
          email && { icon: Mail,   label: "email",   val: email },
          org   && { icon: MapPin, label: "company", val: org },
          url   && { icon: Globe,  label: "website", val: url },
        ] as any[]).filter(Boolean).map((row: any) => (
          <div key={row.label} className="bg-white rounded-xl px-3 py-2.5 flex items-center gap-2.5">
            <row.icon className="w-3.5 h-3.5 shrink-0" style={{ color: "#4C80F1" }} />
            <div className="flex-1 min-w-0">
              <div className="text-[8px] text-gray-400">{row.label}</div>
              <div className="text-[10px] text-gray-800 truncate font-medium">{row.val}</div>
            </div>
          </div>
        ))}
        {!phone && !email && !org && !url && (
          <div className="py-6 text-center text-[10px] text-gray-300">Fill in contact details</div>
        )}
      </div>
    </div>
  );
}

/* ─── Social links ──────────────────────────────────────────────────────── */
function SocialPhonePreview({ meta }: { meta?: Record<string, any> }) {
  const title    = meta?.title || "My Links";
  const desc     = meta?.description || meta?.desc || "";
  const imageUrl = meta?.profileImageUrl;
  const links: { platform: string; url: string }[] = meta?.links || [];
  const validLinks = links.filter((l) => l.url.trim());

  return (
    <div className="h-full flex flex-col" style={{ background: "linear-gradient(180deg, #0F0F0F 0%, #1A1A2E 100%)" }}>
      <div className="pt-5 pb-4 px-4 flex flex-col items-center">
        {imageUrl ? (
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 mb-2">
            <img src={imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-[20px] font-bold mb-2"
            style={{ background: "linear-gradient(135deg, #4C80F1, #A855F7)" }}>
            {(title || "M")[0].toUpperCase()}
          </div>
        )}
        <span className="text-[13px] font-semibold text-white">{title}</span>
        {desc && <p className="text-[9px] text-gray-400 mt-1 text-center line-clamp-2 px-2">{desc}</p>}
      </div>
      <div className="flex-1 px-3 space-y-2 overflow-auto pb-4">
        {validLinks.length > 0 ? validLinks.map((link, i) => {
          const pm = PLATFORM_META[link.platform] || PLATFORM_META.website;
          const Icon = pm.icon;
          return (
            <div key={i} className="flex items-center gap-2.5 bg-white/10 backdrop-blur rounded-xl px-3 py-2.5 border border-white/5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: pm.color }}>
                <Icon className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="flex-1 text-[11px] text-white font-medium truncate">{pm.label}</span>
              <ExternalLink className="w-3 h-3 text-gray-500 shrink-0" />
            </div>
          );
        }) : (
          <div className="py-8 text-center text-[10px] text-gray-500">Add social links to preview</div>
        )}
      </div>
    </div>
  );
}

/* ─── Menu ──────────────────────────────────────────────────────────────── */
function MenuPhonePreview({ meta }: { meta?: Record<string, any> }) {
  const name       = meta?.restaurantName || "Restaurant";
  const brandColor = meta?.brandColor || "#F97316";
  const logoUrl    = meta?.logoUrl;
  const categories = meta?.categories || [];
  const hasItems   = categories.some((c: any) => c.items?.some((i: any) => i.name?.trim()));

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="pt-3 pb-4 px-4 text-white" style={{ background: `linear-gradient(135deg, ${brandColor} 0%, ${brandColor}CC 100%)` }}>
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/20 border border-white/30 shrink-0">
              <img src={logoUrl} alt="" className="w-full h-full object-contain p-1" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <UtensilsCrossed className="w-5 h-5 text-white/80" />
            </div>
          )}
          <div>
            <span className="text-[15px] font-bold block leading-tight">{name}</span>
            <div className="flex items-center gap-1 mt-0.5">
              {[1,2,3,4,5].map((s) => <Star key={s} className="w-2 h-2 fill-white/80 text-white/80" />)}
              <span className="text-[8px] text-white/70 ml-1">4.8</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category tabs */}
      {hasItems && (
        <div className="flex gap-2 px-3 py-2 overflow-x-auto border-b border-gray-100">
          {categories.filter((c: any) => c.items?.some((i: any) => i.name?.trim())).map((cat: any, i: number) => (
            <span key={i} className="text-[9px] px-2.5 py-1 rounded-full whitespace-nowrap font-medium shrink-0"
              style={i === 0 ? { backgroundColor: brandColor, color: "white" } : { backgroundColor: "#F3F4F6", color: "#6B7280" }}>
              {cat.name || "Category"}
            </span>
          ))}
        </div>
      )}

      <div className="flex-1 p-3 space-y-3 overflow-auto">
        {hasItems ? categories.map((cat: any) => {
          const items = (cat.items || []).filter((i: any) => i.name?.trim());
          if (!items.length) return null;
          return (
            <div key={cat.id}>
              {cat.name && (
                <div className="text-[9px] uppercase tracking-wider mb-2 font-bold" style={{ color: brandColor }}>
                  {cat.name}
                </div>
              )}
              <div className="space-y-2">
                {items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-2 bg-gray-50 rounded-xl p-2">
                    {item.imageUrl ? (
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 shrink-0 flex items-center justify-center">
                        <UtensilsCrossed className="w-5 h-5 text-gray-300" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-semibold text-gray-800">{item.name}</div>
                      {item.description && <div className="text-[8px] text-gray-400 mt-0.5 line-clamp-1">{item.description}</div>}
                    </div>
                    {item.price && (
                      <span className="text-[10px] font-bold shrink-0" style={{ color: brandColor }}>
                        {item.price.startsWith("$") ? item.price : `$${item.price}`}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        }) : (
          <div className="py-8 text-center text-[10px] text-gray-300">Add menu items to preview</div>
        )}
      </div>
    </div>
  );
}

/* ─── App Store ─────────────────────────────────────────────────────────── */
function AppStorePreview({ meta }: { meta?: Record<string, any> }) {
  const appName  = meta?.appName  || "My App";
  const iconUrl  = meta?.appIconUrl;

  return (
    <div className="h-full bg-[#F2F2F7] flex flex-col">
      <div className="bg-[#F2F2F7] px-4 pt-2 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <ChevronLeft className="w-4 h-4 text-[#4C80F1]" />
          <span className="text-[11px] text-[#4C80F1]">Search</span>
        </div>
      </div>
      <div className="bg-white mx-3 mt-3 rounded-2xl p-4 shadow-sm">
        <div className="flex items-start gap-3">
          {iconUrl ? (
            <div className="w-14 h-14 rounded-[14px] overflow-hidden shrink-0 shadow-lg border border-gray-100">
              <img src={iconUrl} alt="" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-[14px] flex items-center justify-center shrink-0 shadow-lg"
              style={{ background: "linear-gradient(135deg, #4C80F1, #6B9CF4)" }}>
              <Smartphone className="w-7 h-7 text-white" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-gray-900">{appName}</div>
            <div className="text-[9px] text-gray-400 mt-0.5">Developer Name</div>
            <div className="flex items-center gap-0.5 mt-1">
              {[1,2,3,4,5].map((s) => <Star key={s} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />)}
              <span className="text-[8px] text-gray-400 ml-1">4.9</span>
            </div>
          </div>
          <div className="rounded-full px-3 py-1 flex items-center gap-1" style={{ backgroundColor: "#4C80F1" }}>
            <span className="text-[10px] text-white font-bold">GET</span>
          </div>
        </div>
        <div className="flex gap-3 mt-3 overflow-hidden">
          {[1,2,3].map((i) => (
            <div key={i} className="w-24 h-40 rounded-xl bg-gradient-to-b from-gray-100 to-gray-200 shrink-0" />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Coupon / Wallet ───────────────────────────────────────────────────── */
function CouponPreview({ meta }: { meta?: Record<string, any> }) {
  const title    = meta?.couponTitle || "Special Offer";
  const discount = meta?.discount    || "20%";
  const code     = meta?.couponCode  || "SAVE20";
  const expires  = meta?.expiryDate  || "";
  const desc     = meta?.couponDesc  || "";

  return (
    <div className="h-full bg-[#F2F2F7] flex flex-col p-3">
      <div className="flex items-center gap-2 mb-3">
        <ChevronLeft className="w-4 h-4 text-[#4C80F1]" />
        <span className="text-[13px] font-semibold text-gray-900">Wallet</span>
      </div>
      <div className="rounded-2xl overflow-hidden shadow-lg" style={{ background: "linear-gradient(135deg, #4C80F1 0%, #6B4FE8 100%)" }}>
        <div className="p-4 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-white/80" />
            <span className="text-[10px] uppercase tracking-widest text-white/80">Coupon</span>
          </div>
          <div className="text-[28px] font-black leading-none mb-1">{discount} OFF</div>
          <div className="text-[12px] font-semibold text-white/90">{title}</div>
          {desc && <p className="text-[9px] text-white/70 mt-1 leading-relaxed">{desc}</p>}
        </div>
        <div className="relative border-t-2 border-dashed border-white/30 mx-4">
          <div className="absolute -left-7 -top-3 w-6 h-6 rounded-full bg-[#F2F2F7]" />
          <div className="absolute -right-7 -top-3 w-6 h-6 rounded-full bg-[#F2F2F7]" />
        </div>
        <div className="p-4 pt-3">
          <div className="bg-white/15 rounded-xl px-4 py-2.5 text-center">
            <div className="text-[8px] text-white/70 mb-1 uppercase tracking-wider">Coupon Code</div>
            <div className="text-[18px] font-black text-white tracking-widest">{code}</div>
          </div>
          {expires && <div className="text-[8px] text-white/60 text-center mt-2">Valid until {expires}</div>}
        </div>
      </div>
    </div>
  );
}

/* ─── PDF ───────────────────────────────────────────────────────────────── */
function PDFPreview({ meta }: { meta?: Record<string, any> }) {
  const items: { title: string; url: string; fileUrl?: string; fileName?: string }[] =
    meta?.pdfItems?.filter((p: any) => p.title || p.url || p.fileUrl) || [];
  const first = items[0];
  const displayTitle = first?.title || first?.fileName || "Document.pdf";

  return (
    <div className="h-full bg-[#F2F2F7] flex flex-col">
      <div className="bg-[#F2F2F7] px-4 pt-2 pb-3 border-b border-gray-200 flex items-center justify-between">
        <ChevronLeft className="w-4 h-4 text-[#4C80F1]" />
        <span className="text-[12px] font-semibold text-gray-900">Files</span>
        <div className="w-4" />
      </div>
      {items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[10px] text-gray-300">Add a PDF to preview</p>
        </div>
      ) : items.length === 1 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-28 h-36 rounded-xl bg-white shadow-md flex flex-col overflow-hidden border border-gray-200 mb-4">
            <div className="h-2 w-full bg-red-500" />
            <div className="flex-1 flex flex-col items-center justify-center p-3">
              <FileText className="w-8 h-8 text-red-500 mb-2" />
              <div className="space-y-1 w-full">
                {[1,2,3,4].map((i) => <div key={i} className="h-1.5 bg-gray-100 rounded" style={{ width: i === 3 ? "60%" : "100%" }} />)}
              </div>
            </div>
            <div className="text-center pb-2">
              <span className="text-[8px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">PDF</span>
            </div>
          </div>
          <div className="text-[12px] font-semibold text-gray-800 mb-1 text-center max-w-full truncate px-2">{displayTitle}</div>
          <button className="flex items-center gap-2 px-5 py-2 rounded-full text-white text-[12px] font-semibold" style={{ backgroundColor: "#4C80F1" }}>
            <Download className="w-4 h-4" /> Open PDF
          </button>
        </div>
      ) : (
        <div className="flex-1 p-3 space-y-2 overflow-auto">
          {items.map((item, i) => (
            <div key={i} className="bg-white rounded-xl px-3 py-2.5 flex items-center gap-3 shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-gray-800 truncate">{item.title || item.fileName || `Document ${i + 1}`}</div>
                <div className="text-[9px] text-gray-400">PDF · tap to open</div>
              </div>
              <Download className="w-4 h-4 shrink-0" style={{ color: "#4C80F1" }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Video ─────────────────────────────────────────────────────────────── */
function VideoPreview({ meta }: { meta?: Record<string, any> }) {
  const items: { title: string; url: string; fileUrl?: string; fileName?: string }[] =
    meta?.videoItems?.filter((v: any) => v.title || v.url || v.fileUrl) || [];
  const first = items[0];
  const title = first?.title || first?.fileName || "Video";

  return (
    <div className="h-full bg-[#0F0F0F] flex flex-col">
      {/* Player */}
      <div className="relative bg-black" style={{ aspectRatio: "16/9" }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
            <Play className="w-6 h-6 text-white ml-1" />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#4C80F1]/30 to-[#6B4FE8]/30" />
        <div className="absolute bottom-0 left-0 right-0 px-2 pb-1">
          <div className="h-1 bg-white/20 rounded-full">
            <div className="h-full w-1/3 rounded-full bg-red-500" />
          </div>
          <div className="flex items-center justify-between text-[7px] text-white/70 mt-0.5">
            <span>1:24</span><span>4:12</span>
          </div>
        </div>
      </div>

      {items.length <= 1 ? (
        <div className="p-3">
          <div className="text-[12px] font-semibold text-white leading-snug">{title}</div>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-6 h-6 rounded-full bg-gray-700" />
            <span className="text-[9px] text-gray-400">Channel · 12K views</span>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2 border-b border-white/5">
              <div className="w-14 h-10 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
                <Play className="w-4 h-4 text-white/50" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-medium text-white truncate">{item.title || item.fileName || `Video ${i + 1}`}</div>
                <div className="text-[8px] text-gray-500 mt-0.5">{i === 0 ? "Now playing" : "Up next"}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="px-3 flex items-center justify-around py-2 border-t border-white/10">
        {[SkipBack, Pause, SkipForward].map((Icon, i) => (
          <Icon key={i} className="w-5 h-5 text-white/80" />
        ))}
      </div>
    </div>
  );
}

/* ─── Audio / Music ─────────────────────────────────────────────────────── */
function AudioPreview({ meta }: { meta?: Record<string, any> }) {
  const items: { title: string; url: string; fileUrl?: string; fileName?: string; artist?: string }[] =
    meta?.audioItems?.filter((a: any) => a.title || a.url || a.fileUrl) || [];
  const first  = items[0];
  const title  = first?.title  || first?.fileName || "Track Title";
  const artist = first?.artist || "Artist Name";

  return (
    <div className="h-full flex flex-col" style={{ background: "linear-gradient(180deg, #1a1a2e 0%, #16213E 100%)" }}>
      {/* Album art + now playing */}
      <div className="flex flex-col items-center px-4 py-4">
        <div className="w-28 h-28 rounded-2xl flex items-center justify-center shadow-2xl mb-3"
          style={{ background: "linear-gradient(135deg, #4C80F1, #A855F7)" }}>
          <Music2 className="w-12 h-12 text-white/60" />
        </div>
        <div className="text-[13px] font-bold text-white">{title}</div>
        <div className="text-[10px] text-gray-400 mt-0.5">{artist}</div>
      </div>

      {/* Progress */}
      <div className="px-4 space-y-1 mb-3">
        <div className="h-1 bg-white/20 rounded-full">
          <div className="h-full w-2/5 rounded-full" style={{ backgroundColor: "#4C80F1" }} />
        </div>
        <div className="flex justify-between text-[8px] text-gray-500">
          <span>1:32</span><span>3:48</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-around px-6 mb-3">
        <SkipBack className="w-6 h-6 text-white/60" />
        <div className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: "#4C80F1" }}>
          <Pause className="w-5 h-5 text-white" />
        </div>
        <SkipForward className="w-6 h-6 text-white/60" />
      </div>

      {/* Playlist if multiple */}
      {items.length > 1 && (
        <div className="flex-1 overflow-auto border-t border-white/10">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2 border-b border-white/5"
              style={i === 0 ? { backgroundColor: "rgba(76,128,241,0.15)" } : {}}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, #4C80F1, #A855F7)" }}>
                <Music2 className="w-4 h-4 text-white/60" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-medium text-white truncate">{item.title || item.fileName || `Track ${i + 1}`}</div>
                {item.artist && <div className="text-[8px] text-gray-500 truncate">{item.artist}</div>}
              </div>
              {i === 0 && <div className="w-1.5 h-1.5 rounded-full bg-[#4C80F1] shrink-0" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Links list ────────────────────────────────────────────────────────── */
function LinksPreview({ meta }: { meta?: Record<string, any> }) {
  const title = meta?.title || "My Links";
  const links: { label: string; url: string }[] = meta?.links || [];
  const validLinks = links.filter((l) => l.url.trim());

  return (
    <div className="h-full flex flex-col" style={{ background: "linear-gradient(180deg, #EFF6FF 0%, #DBEAFE 100%)" }}>
      <div className="pt-5 pb-4 px-4 flex flex-col items-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-[20px] font-bold mb-2 shadow-lg" style={{ backgroundColor: "#4C80F1" }}>
          <List className="w-7 h-7" />
        </div>
        <span className="text-[14px] font-bold text-gray-900">{title}</span>
      </div>
      <div className="flex-1 px-3 space-y-2 overflow-auto pb-4">
        {validLinks.length > 0 ? validLinks.map((link, i) => (
          <div key={i} className="flex items-center gap-2.5 bg-white rounded-xl px-3 py-2.5 shadow-sm border border-gray-100">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#4C80F1" }}>
              <Globe className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="flex-1 text-[11px] text-gray-800 font-medium truncate">{link.label || link.url}</span>
            <ExternalLink className="w-3 h-3 text-gray-400 shrink-0" />
          </div>
        )) : (
          <div className="py-8 text-center text-[10px] text-gray-400">Add links to preview</div>
        )}
      </div>
    </div>
  );
}

/* ─── Empty ─────────────────────────────────────────────────────────────── */
function EmptyPreview() {
  return (
    <div className="h-full bg-[#F2F2F7] flex items-center justify-center">
      <div className="text-center space-y-2">
        <Share2 className="w-8 h-8 text-gray-200 mx-auto" />
        <p className="text-[10px] text-gray-300">Enter content to preview</p>
      </div>
    </div>
  );
}
