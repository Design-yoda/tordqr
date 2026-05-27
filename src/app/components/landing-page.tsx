import { useState } from "react";
import {
  UtensilsCrossed, Tag, Globe, List,
  Instagram, Twitter, Facebook, Youtube, Linkedin, Github,
  Music, ChevronRight, Video, Headphones,
} from "lucide-react";
import { WhatsAppIcon } from "./whatsapp-icon";

const PLATFORM_META: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  instagram: { icon: Instagram,     color: "#E4405F", label: "Instagram" },
  twitter:   { icon: Twitter,       color: "#000000", label: "X / Twitter" },
  facebook:  { icon: Facebook,      color: "#1877F2", label: "Facebook" },
  youtube:   { icon: Youtube,       color: "#FF0000", label: "YouTube" },
  linkedin:  { icon: Linkedin,      color: "#0A66C2", label: "LinkedIn" },
  github:    { icon: Github,        color: "#181717", label: "GitHub" },
  tiktok:    { icon: Music,         color: "#000000", label: "TikTok" },
  whatsapp:  { icon: WhatsAppIcon,  color: "#25D366", label: "WhatsApp" },
  website:   { icon: Globe,         color: "#4C80F1", label: "Website" },
};

interface LandingPageProps {
  type: string;
  data: Record<string, any>;
}

export function LandingPage({ type, data }: LandingPageProps) {
  switch (type) {
    case "menu":   return <MenuLanding   data={data} />;
    case "social": return <SocialLanding data={data} />;
    case "coupon": return <CouponLanding data={data} />;
    case "links":  return <LinksLanding  data={data} />;
    case "video":  return <VideoLanding  data={data} />;
    case "audio":  return <AudioLanding  data={data} />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <p className="text-gray-400 text-sm">Unknown content type.</p>
        </div>
      );
  }
}

/* ─── Menu landing ──────────────────────────────────────────────────────── */
function MenuLanding({ data }: { data: Record<string, any> }) {
  const name       = data.name       || "Restaurant";
  const desc       = data.desc       || "";
  const brandColor = data.brandColor || "#F97316";
  const currency   = data.currency   || "$";
  const logoUrl    = data.logoUrl    || "";
  const categories: any[] = data.categories || [];
  const visibleCats = categories.filter((c: any) => c.items?.some((i: any) => i.name?.trim()));
  const hasItems = visibleCats.length > 0;

  const [activeCategory, setActiveCategory] = useState<string | null>(null); // null = All

  const displayCats = activeCategory === null
    ? visibleCats
    : visibleCats.filter((c: any) => c.name === activeCategory);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero header */}
      <div className="text-white px-5 pt-10 pb-6" style={{ background: `linear-gradient(135deg, ${brandColor} 0%, ${brandColor}CC 100%)` }}>
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-4">
            {logoUrl && (
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/20 border-2 border-white/30 shrink-0">
                <img src={logoUrl} alt={name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 opacity-80">
                <UtensilsCrossed className="w-4 h-4" />
                <span className="text-[11px] uppercase tracking-widest font-semibold">Menu</span>
              </div>
              <h1 className="text-[28px] font-black leading-tight">{name}</h1>
              {desc && <p className="text-[14px] mt-1 opacity-80">{desc}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Category tabs — All + individual */}
      {hasItems && (
        <div className="sticky top-0 bg-white border-b border-gray-100 shadow-sm z-10">
          <div className="max-w-lg mx-auto flex gap-2 px-4 py-3 overflow-x-auto">
            <button
              onClick={() => setActiveCategory(null)}
              className="text-[12px] px-3 py-1.5 rounded-full whitespace-nowrap font-medium shrink-0 transition-colors cursor-pointer"
              style={activeCategory === null ? { backgroundColor: brandColor, color: "white" } : { backgroundColor: "#F3F4F6", color: "#6B7280" }}>
              All
            </button>
            {visibleCats.map((cat: any, i: number) => (
              <button
                key={i}
                onClick={() => setActiveCategory(cat.name)}
                className="text-[12px] px-3 py-1.5 rounded-full whitespace-nowrap font-medium shrink-0 transition-colors cursor-pointer"
                style={activeCategory === cat.name ? { backgroundColor: brandColor, color: "white" } : { backgroundColor: "#F3F4F6", color: "#6B7280" }}>
                {cat.name || "Category"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="max-w-lg mx-auto px-4 py-5 space-y-6">
        {hasItems ? displayCats.map((cat: any, ci: number) => {
          const items = (cat.items || []).filter((i: any) => i.name?.trim());
          if (!items.length) return null;
          return (
            <div key={ci}>
              {cat.name && (
                <h2 className="text-[13px] font-black uppercase tracking-wider mb-3" style={{ color: brandColor }}>
                  {cat.name}
                </h2>
              )}
              <div className="space-y-3">
                {items.map((item: any, ii: number) => (
                  <div key={ii} className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-[15px]">{item.name}</div>
                      {item.description && (
                        <div className="text-[13px] text-gray-500 mt-0.5 leading-snug">{item.description}</div>
                      )}
                    </div>
                    {item.price && (
                      <span className="font-black text-[16px] shrink-0" style={{ color: brandColor }}>
                        {currency}{item.price.replace(/^\$/, "")}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        }) : (
          <div className="py-16 text-center text-gray-300 text-sm">No menu items yet.</div>
        )}
      </div>
    </div>
  );
}

/* ─── Social landing ────────────────────────────────────────────────────── */
function SocialLanding({ data }: { data: Record<string, any> }) {
  const title          = data.title          || "My Links";
  const desc           = data.desc           || "";
  const profileImageUrl = data.profileImageUrl || "";
  const links: { platform: string; url: string }[] = (data.links || []).filter((l: any) => l.url?.trim());

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4"
      style={{ background: "linear-gradient(160deg, #0f0f1a 0%, #1a1a2e 60%, #16213e 100%)" }}>
      <div className="w-full max-w-sm">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt={title}
              className="w-20 h-20 rounded-full object-cover mb-3 shadow-lg border-2 border-white/20"
            />
          ) : (
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-[30px] font-black mb-3 shadow-lg"
              style={{ background: "linear-gradient(135deg, #4C80F1, #A855F7)" }}>
              {(title || "M")[0].toUpperCase()}
            </div>
          )}
          <h1 className="text-[22px] font-bold text-white">{title}</h1>
          {desc && <p className="text-[14px] text-gray-400 mt-1 text-center">{desc}</p>}
        </div>

        {/* Links */}
        <div className="space-y-3">
          {links.length > 0 ? links.map((link, i) => {
            const pm = PLATFORM_META[link.platform] || PLATFORM_META.website;
            const Icon = pm.icon;
            return (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white/10 backdrop-blur border border-white/10 rounded-2xl px-4 py-3.5 transition-all hover:bg-white/20 active:scale-[0.98]">
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: pm.color }}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="flex-1 text-white font-semibold text-[15px]">{pm.label}</span>
                <ChevronRight className="w-4 h-4 text-white/40" />
              </a>
            );
          }) : (
            <p className="text-center text-gray-500 text-sm py-8">No links yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Coupon landing ────────────────────────────────────────────────────── */
function CouponLanding({ data }: { data: Record<string, any> }) {
  const title    = data.title    || "Special Offer";
  const discount = data.discount || "OFF";
  const code     = data.code     || "";
  const expires  = data.expires  || "";
  const desc     = data.desc     || "";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: "linear-gradient(160deg, #EFF6FF 0%, #DBEAFE 100%)" }}>
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ background: "linear-gradient(135deg, #4C80F1 0%, #6B4FE8 100%)" }}>
          <div className="p-6 text-white">
            <div className="flex items-center gap-2 mb-4 opacity-80">
              <Tag className="w-4 h-4" />
              <span className="text-[11px] uppercase tracking-widest font-semibold">Limited Offer</span>
            </div>
            <div className="text-[52px] font-black leading-none mb-1">{discount}</div>
            <div className="text-[18px] font-bold opacity-90">{title}</div>
            {desc && <p className="text-[13px] mt-2 opacity-70 leading-relaxed">{desc}</p>}
          </div>

          {/* Dashed divider with cutouts */}
          <div className="relative border-t-2 border-dashed border-white/30 mx-5">
            <div className="absolute -left-8 -top-3.5 w-7 h-7 rounded-full bg-[#DBEAFE]" />
            <div className="absolute -right-8 -top-3.5 w-7 h-7 rounded-full bg-[#DBEAFE]" />
          </div>

          <div className="p-5 pt-4">
            {code ? (
              <div className="bg-white/15 rounded-2xl p-4 text-center">
                <p className="text-[11px] text-white/60 uppercase tracking-wider mb-1">Your code</p>
                <p className="text-[28px] font-black text-white tracking-[0.15em]">{code}</p>
                <p className="text-[11px] text-white/50 mt-2">Tap to copy</p>
              </div>
            ) : null}
            {expires && (
              <p className="text-center text-[12px] text-white/50 mt-3">Expires: {expires}</p>
            )}
          </div>
        </div>

        {/* Tap to copy */}
        {code && (
          <button
            className="w-full mt-4 py-3.5 rounded-2xl text-white font-bold text-[15px] shadow-lg transition-all active:scale-[0.98]"
            style={{ backgroundColor: "#4C80F1" }}
            onClick={() => { navigator.clipboard?.writeText(code).catch(() => {}); }}
          >
            Copy Code
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Links landing ─────────────────────────────────────────────────────── */
function LinksLanding({ data }: { data: Record<string, any> }) {
  const title = data.title || "My Links";
  const links: { label: string; url: string }[] = (data.links || []).filter((l: any) => l.url?.trim());

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4"
      style={{ background: "linear-gradient(160deg, #EFF6FF 0%, #DBEAFE 60%, #EDE9FE 100%)" }}>
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-3" style={{ backgroundColor: "#4C80F1" }}>
            <List className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-[24px] font-bold text-gray-900">{title}</h1>
        </div>

        <div className="space-y-3">
          {links.length > 0 ? links.map((link, i) => (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-gray-100 transition-all hover:shadow-md active:scale-[0.98]">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#4C80F1" }}>
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="flex-1 font-semibold text-gray-800 text-[15px] truncate">{link.label || link.url}</span>
              <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
            </a>
          )) : (
            <p className="text-center text-gray-400 text-sm py-8">No links yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── PDF landing ───────────────────────────────────────────────────────── */
/* ─── Video landing ─────────────────────────────────────────────────────── */
function VideoLanding({ data }: { data: Record<string, any> }) {
  const items: { title: string; src: string }[] = (data.items || []).filter((i: any) => i.src);

  return (
    <div className="min-h-screen bg-gray-950 font-sans">
      <div className="px-5 pt-8 pb-4">
        <div className="max-w-lg mx-auto flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#4C80F1" }}>
            <Video className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-[18px] font-bold text-white">{items[0]?.title || "Video"}</h1>
        </div>
        <div className="max-w-lg mx-auto space-y-5">
          {items.map((item, i) => (
            <div key={i} className="rounded-2xl overflow-hidden bg-black shadow-2xl">
              {item.title && i > 0 && (
                <p className="px-4 py-3 text-[14px] font-semibold text-white border-b border-white/10">{item.title}</p>
              )}
              <video
                src={item.src}
                controls
                playsInline
                className="w-full"
                style={{ maxHeight: "70vh" }}
              />
            </div>
          ))}
          {!items.length && <p className="text-center text-gray-500 text-sm py-16">No video available.</p>}
        </div>
      </div>
    </div>
  );
}

/* ─── Audio landing ─────────────────────────────────────────────────────── */
function AudioLanding({ data }: { data: Record<string, any> }) {
  const items: { title: string; src: string; artist?: string }[] = (data.items || []).filter((i: any) => i.src);

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4"
      style={{ background: "linear-gradient(160deg, #0f0f1a 0%, #1a1a2e 60%, #0f172a 100%)" }}>
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl mb-4"
            style={{ background: "linear-gradient(135deg, #4C80F1, #A855F7)" }}>
            <Headphones className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-[22px] font-bold text-white text-center">Audio</h1>
        </div>
        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={i} className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-4">
              {(item.title || item.artist) && (
                <div className="mb-2">
                  {item.title && <p className="text-[14px] font-semibold text-white">{item.title}</p>}
                  {item.artist && <p className="text-[12px] text-gray-400">{item.artist}</p>}
                </div>
              )}
              <audio src={item.src} controls className="w-full" style={{ accentColor: "#4C80F1" }} />
            </div>
          ))}
          {!items.length && <p className="text-center text-gray-500 text-sm py-8">No audio available.</p>}
        </div>
      </div>
    </div>
  );
}
