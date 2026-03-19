import { useState, useEffect, useRef } from "react";
import type { QRType } from "./qr-type-selector";
import {
  Plus,
  Trash2,
  GripVertical,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Linkedin,
  Github,
  Globe,
  Music,
  MessageCircle,
  ImagePlus,
  X,
  Link,
  Upload,
} from "lucide-react";

interface QRFormProps {
  type: QRType;
  onValueChange: (value: string) => void;
  onMetaChange?: (meta: Record<string, any>) => void;
}

const SOCIAL_PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: Instagram, placeholder: "https://instagram.com/username" },
  { id: "twitter",   label: "X / Twitter", icon: Twitter,  placeholder: "https://x.com/username" },
  { id: "facebook",  label: "Facebook",   icon: Facebook,  placeholder: "https://facebook.com/username" },
  { id: "youtube",   label: "YouTube",    icon: Youtube,   placeholder: "https://youtube.com/@channel" },
  { id: "linkedin",  label: "LinkedIn",   icon: Linkedin,  placeholder: "https://linkedin.com/in/username" },
  { id: "github",    label: "GitHub",     icon: Github,    placeholder: "https://github.com/username" },
  { id: "tiktok",    label: "TikTok",     icon: Music,     placeholder: "https://tiktok.com/@username" },
  { id: "whatsapp",  label: "WhatsApp",   icon: MessageCircle, placeholder: "https://wa.me/1234567890" },
  { id: "website",   label: "Website",    icon: Globe,     placeholder: "https://yourwebsite.com" },
];

interface MenuItem {
  id: string;
  name: string;
  price: string;
  description: string;
  imageUrl?: string;
}
interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}
interface LinkItem {
  id: string;
  label: string;
  url: string;
}
interface MediaItem {
  id: string;
  title: string;
  mode: "url" | "upload";
  url: string;
  fileUrl: string;
  fileName: string;
  artist?: string; // audio only
}

const PRIMARY = "#4C80F1";
const inp = "w-full px-4 py-2.5 rounded-xl bg-white/80 border border-gray-200/80 focus:border-[#4C80F1] focus:ring-2 focus:ring-[#4C80F1]/10 outline-none transition-all placeholder:text-gray-400 text-[14px]";
const labelClass = "block text-[12px] text-gray-500 mb-1.5 ml-0.5";

const newMenu  = (): MenuCategory[] => [{ id: "1", name: "Main Course", items: [{ id: "1-1", name: "", price: "", description: "" }] }];
const newMedia = (): MediaItem[]    => [{ id: "1", title: "", mode: "url", url: "", fileUrl: "", fileName: "" }];

/* ── File → base64 helper ─────────────────────────────────────────────── */
function readFile(file: File): Promise<string> {
  return new Promise((res) => {
    const r = new FileReader();
    r.onload = (e) => res(e.target?.result as string);
    r.readAsDataURL(file);
  });
}

/* ── Upload-or-URL widget ─────────────────────────────────────────────── */
function MediaItemRow({
  item,
  index,
  accept,
  urlPlaceholder,
  showArtist,
  onUpdate,
  onRemove,
  canRemove,
}: {
  item: MediaItem;
  index: number;
  accept: string;
  urlPlaceholder: string;
  showArtist?: boolean;
  onUpdate: (patch: Partial<MediaItem>) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const fileUrl = await readFile(file);
    onUpdate({ fileUrl, fileName: file.name, url: "" });
  };

  return (
    <div className="bg-gray-50/80 rounded-xl p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-gray-500 font-medium">Item {index + 1}</span>
        {canRemove && (
          <button onClick={onRemove} className="p-1 text-gray-400 hover:text-red-500 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Title */}
      <input
        className={inp}
        placeholder="Title (optional)"
        value={item.title}
        onChange={(e) => onUpdate({ title: e.target.value })}
      />

      {/* Mode toggle */}
      <div className="flex rounded-lg overflow-hidden border border-gray-200 w-fit">
        {(["url", "upload"] as const).map((m) => (
          <button
            key={m}
            onClick={() => onUpdate({ mode: m })}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] transition-colors cursor-pointer"
            style={item.mode === m
              ? { backgroundColor: PRIMARY, color: "white" }
              : { backgroundColor: "white", color: "#6B7280" }}
          >
            {m === "url" ? <Link className="w-3 h-3" /> : <Upload className="w-3 h-3" />}
            {m === "url" ? "URL" : "Upload"}
          </button>
        ))}
      </div>

      {item.mode === "url" ? (
        <input
          className={inp}
          placeholder={urlPlaceholder}
          value={item.url}
          onChange={(e) => onUpdate({ url: e.target.value })}
        />
      ) : (
        <>
          {item.fileUrl ? (
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-200">
              <span className="text-[11px] text-gray-700 truncate flex-1">{item.fileName}</span>
              <button onClick={() => onUpdate({ fileUrl: "", fileName: "" })} className="shrink-0 cursor-pointer">
                <X className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#4C80F1] hover:bg-[#4C80F1]/5 transition-colors cursor-pointer text-[12px] text-gray-400"
            >
              <Upload className="w-4 h-4" /> Click to upload file
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
        </>
      )}

      {showArtist && (
        <input
          className={inp}
          placeholder="Artist (optional)"
          value={item.artist || ""}
          onChange={(e) => onUpdate({ artist: e.target.value })}
        />
      )}
    </div>
  );
}

/* ── Image upload button ──────────────────────────────────────────────── */
function ImageUpload({
  imageUrl,
  label,
  shape = "square",
  onUpload,
  onRemove,
}: {
  imageUrl: string;
  label: string;
  shape?: "circle" | "square";
  onUpload: (dataUrl: string) => void;
  onRemove: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const radius = shape === "circle" ? "rounded-full" : "rounded-xl";

  return (
    <div className="flex items-center gap-3">
      {imageUrl ? (
        <div className="relative w-14 h-14 shrink-0">
          <div className={`w-full h-full ${radius} overflow-hidden border-2 border-gray-200`}>
            <img src={imageUrl} alt={label} className="w-full h-full object-cover" />
          </div>
          <button
            onClick={onRemove}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center cursor-pointer shadow-sm z-10"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => ref.current?.click()}
          className={`w-14 h-14 ${radius} border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-[#4C80F1] transition-colors cursor-pointer bg-gray-50`}
        >
          <ImagePlus className="w-5 h-5 text-gray-400" />
        </button>
      )}
      <div className="text-[12px] text-gray-500">
        <p className="font-medium">{label}</p>
        <p className="text-gray-400">PNG, JPG · preview only</p>
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => { const f = e.target.files?.[0]; if (f) onUpload(await readFile(f)); }}
      />
    </div>
  );
}

/* ═══ Main form component ══════════════════════════════════════════════════ */
export function QRForm({ type, onValueChange, onMetaChange }: QRFormProps) {
  const [fields,         setFields]         = useState<Record<string, string>>({});
  const [socialLinks,    setSocialLinks]    = useState<{ platform: string; url: string }[]>([{ platform: "instagram", url: "" }]);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>(newMenu());
  const [linkItems,      setLinkItems]      = useState<LinkItem[]>([{ id: "1", label: "", url: "" }]);
  const [pdfItems,       setPdfItems]       = useState<MediaItem[]>(newMedia());
  const [videoItems,     setVideoItems]     = useState<MediaItem[]>(newMedia());
  const [audioItems,     setAudioItems]     = useState<MediaItem[]>(newMedia());

  const menuImageRefs = useRef<Record<string, HTMLInputElement | null>>({});

  /* Reset all state on type change */
  useEffect(() => {
    setFields({});
    setSocialLinks([{ platform: "instagram", url: "" }]);
    setMenuCategories(newMenu());
    setLinkItems([{ id: "1", label: "", url: "" }]);
    setPdfItems(newMedia());
    setVideoItems(newMedia());
    setAudioItems(newMedia());
  }, [type]);

  /* Emit value + meta */
  useEffect(() => {
    onValueChange(buildValue(type, fields, socialLinks, menuCategories, linkItems, pdfItems, videoItems, audioItems));

    if (!onMetaChange) return;
    if (type === "social") {
      onMetaChange({ title: fields.socialTitle || "", description: fields.socialDesc || "", profileImageUrl: fields.profileImageUrl || "", links: socialLinks });
    } else if (type === "menu") {
      onMetaChange({ restaurantName: fields.restaurantName || "", brandColor: fields.brandColor || "#F97316", logoUrl: fields.logoUrl || "", categories: menuCategories });
    } else if (type === "appstore") {
      onMetaChange({ appName: fields.appName || "", appIconUrl: fields.appIconUrl || "", appleUrl: fields.appleUrl || "", googleUrl: fields.googleUrl || "" });
    } else if (type === "links") {
      onMetaChange({ title: fields.linksTitle || "", links: linkItems });
    } else if (type === "pdf") {
      onMetaChange({ pdfItems });
    } else if (type === "video") {
      onMetaChange({ videoItems });
    } else if (type === "audio") {
      onMetaChange({ audioItems });
    } else {
      onMetaChange({ ...fields });
    }
  }, [fields, type, socialLinks, menuCategories, linkItems, pdfItems, videoItems, audioItems]);

  const update = (key: string, val: string) => setFields((p) => ({ ...p, [key]: val }));

  /* ── Social helpers ─────────────────────────────────────────────────── */
  const addSocialLink = () => {
    const used = socialLinks.map((l) => l.platform);
    const next = SOCIAL_PLATFORMS.find((p) => !used.includes(p.id));
    if (next) setSocialLinks([...socialLinks, { platform: next.id, url: "" }]);
  };
  const removeSocialLink = (i: number) => setSocialLinks(socialLinks.filter((_, idx) => idx !== i));
  const updateSocialLink = (i: number, key: "platform" | "url", val: string) => {
    const u = [...socialLinks]; u[i] = { ...u[i], [key]: val }; setSocialLinks(u);
  };

  /* ── Menu helpers ───────────────────────────────────────────────────── */
  const addMenuCategory = () =>
    setMenuCategories([...menuCategories, { id: Date.now().toString(), name: "", items: [{ id: `${Date.now()}-1`, name: "", price: "", description: "" }] }]);
  const removeMenuCategory = (ci: number) => setMenuCategories(menuCategories.filter((_, i) => i !== ci));
  const updateCategoryName = (ci: number, val: string) => {
    const u = [...menuCategories]; u[ci].name = val; setMenuCategories(u);
  };
  const addMenuItem = (ci: number) => {
    const u = [...menuCategories]; u[ci].items.push({ id: `${Date.now()}`, name: "", price: "", description: "" }); setMenuCategories(u);
  };
  const removeMenuItem = (ci: number, ii: number) => {
    const u = [...menuCategories]; u[ci].items = u[ci].items.filter((_, i) => i !== ii); setMenuCategories(u);
  };
  const updateMenuItem = (ci: number, ii: number, key: string, val: string) => {
    const u = [...menuCategories]; (u[ci].items[ii] as any)[key] = val; setMenuCategories(u);
  };
  const handleMenuItemImage = async (ci: number, ii: number, file: File) => {
    const fileUrl = await readFile(file);
    updateMenuItem(ci, ii, "imageUrl", fileUrl);
  };

  /* ── Link helpers ───────────────────────────────────────────────────── */
  const addLinkItem = () => setLinkItems([...linkItems, { id: Date.now().toString(), label: "", url: "" }]);
  const removeLinkItem = (i: number) => setLinkItems(linkItems.filter((_, idx) => idx !== i));
  const updateLinkItem = (i: number, key: "label" | "url", val: string) => {
    const u = [...linkItems]; u[i] = { ...u[i], [key]: val }; setLinkItems(u);
  };

  /* ── Media helpers ──────────────────────────────────────────────────── */
  const mkMediaHelpers = (items: MediaItem[], set: React.Dispatch<React.SetStateAction<MediaItem[]>>) => ({
    add: () => set([...items, { id: Date.now().toString(), title: "", mode: "url", url: "", fileUrl: "", fileName: "" }]),
    remove: (i: number) => set(items.filter((_, idx) => idx !== i)),
    update: (i: number, patch: Partial<MediaItem>) => {
      const u = [...items]; u[i] = { ...u[i], ...patch }; set(u);
    },
  });
  const pdf   = mkMediaHelpers(pdfItems,   setPdfItems);
  const video = mkMediaHelpers(videoItems, setVideoItems);
  const audio = mkMediaHelpers(audioItems, setAudioItems);

  /* ═══════════════════════════════════════════════════════════════════ */
  switch (type) {

    case "url":
      return (
        <div>
          <label className={labelClass}>Website URL</label>
          <input className={inp} placeholder="https://example.com" value={fields.url || ""} onChange={(e) => update("url", e.target.value)} />
        </div>
      );

    case "text":
      return (
        <div>
          <label className={labelClass}>Your Text</label>
          <textarea className={`${inp} min-h-[100px] resize-none`} placeholder="Enter any text…" value={fields.text || ""} onChange={(e) => update("text", e.target.value)} />
        </div>
      );

    case "email":
      return (
        <div className="space-y-3">
          <div><label className={labelClass}>Email Address</label><input className={inp} placeholder="hello@example.com" value={fields.email || ""} onChange={(e) => update("email", e.target.value)} /></div>
          <div><label className={labelClass}>Subject (optional)</label><input className={inp} placeholder="Subject" value={fields.subject || ""} onChange={(e) => update("subject", e.target.value)} /></div>
          <div><label className={labelClass}>Body (optional)</label><textarea className={`${inp} min-h-[60px] resize-none`} placeholder="Message body…" value={fields.body || ""} onChange={(e) => update("body", e.target.value)} /></div>
        </div>
      );

    case "phone":
      return (
        <div>
          <label className={labelClass}>Phone Number</label>
          <input className={inp} placeholder="+1 234 567 8900" value={fields.phone || ""} onChange={(e) => update("phone", e.target.value)} />
        </div>
      );

    case "sms":
      return (
        <div className="space-y-3">
          <div><label className={labelClass}>Phone Number</label><input className={inp} placeholder="+1 234 567 8900" value={fields.phone || ""} onChange={(e) => update("phone", e.target.value)} /></div>
          <div><label className={labelClass}>Message (optional)</label><textarea className={`${inp} min-h-[60px] resize-none`} placeholder="Your message…" value={fields.message || ""} onChange={(e) => update("message", e.target.value)} /></div>
        </div>
      );

    case "wifi":
      return (
        <div className="space-y-3">
          <div><label className={labelClass}>Network Name (SSID)</label><input className={inp} placeholder="MyWiFi" value={fields.ssid || ""} onChange={(e) => update("ssid", e.target.value)} /></div>
          <div><label className={labelClass}>Password</label><input className={inp} type="password" placeholder="Password" value={fields.password || ""} onChange={(e) => update("password", e.target.value)} /></div>
          <div>
            <label className={labelClass}>Encryption</label>
            <select className={inp} value={fields.encryption || "WPA"} onChange={(e) => update("encryption", e.target.value)}>
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">None</option>
            </select>
          </div>
        </div>
      );

    case "vcard":
      return (
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Contact Photo (optional)</label>
            <ImageUpload
              imageUrl={fields.photoUrl || ""}
              label="Contact photo"
              shape="circle"
              onUpload={(url) => update("photoUrl", url)}
              onRemove={() => update("photoUrl", "")}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelClass}>First Name</label><input className={inp} placeholder="John" value={fields.firstName || ""} onChange={(e) => update("firstName", e.target.value)} /></div>
            <div><label className={labelClass}>Last Name</label><input className={inp} placeholder="Doe" value={fields.lastName || ""} onChange={(e) => update("lastName", e.target.value)} /></div>
          </div>
          <div><label className={labelClass}>Phone</label><input className={inp} placeholder="+1 234 567 8900" value={fields.phone || ""} onChange={(e) => update("phone", e.target.value)} /></div>
          <div><label className={labelClass}>Email</label><input className={inp} placeholder="john@example.com" value={fields.email || ""} onChange={(e) => update("email", e.target.value)} /></div>
          <div><label className={labelClass}>Organization</label><input className={inp} placeholder="Company Inc." value={fields.org || ""} onChange={(e) => update("org", e.target.value)} /></div>
          <div><label className={labelClass}>Website</label><input className={inp} placeholder="https://example.com" value={fields.url || ""} onChange={(e) => update("url", e.target.value)} /></div>
        </div>
      );

    case "social":
      return (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Profile Image (optional)</label>
            <ImageUpload
              imageUrl={fields.profileImageUrl || ""}
              label="Profile image"
              shape="circle"
              onUpload={(url) => update("profileImageUrl", url)}
              onRemove={() => update("profileImageUrl", "")}
            />
          </div>
          <div><label className={labelClass}>Page Title</label><input className={inp} placeholder="John's Links" value={fields.socialTitle || ""} onChange={(e) => update("socialTitle", e.target.value)} /></div>
          <div><label className={labelClass}>Description</label><input className={inp} placeholder="Check out all my social profiles" value={fields.socialDesc || ""} onChange={(e) => update("socialDesc", e.target.value)} /></div>
          <div>
            <label className={labelClass}>Social Media Links</label>
            <div className="space-y-2">
              {socialLinks.map((link, idx) => {
                const platform = SOCIAL_PLATFORMS.find((p) => p.id === link.platform);
                const PlatformIcon = platform?.icon || Globe;
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="flex items-center gap-2 shrink-0 w-[120px]">
                      <PlatformIcon className="w-4 h-4 text-gray-400 shrink-0" />
                      <select className="bg-white/80 border border-gray-200/80 rounded-lg px-2 py-2 text-[12px] outline-none w-full" value={link.platform} onChange={(e) => updateSocialLink(idx, "platform", e.target.value)}>
                        {SOCIAL_PLATFORMS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                      </select>
                    </div>
                    <input className={`${inp} flex-1`} placeholder={platform?.placeholder || "URL"} value={link.url} onChange={(e) => updateSocialLink(idx, "url", e.target.value)} />
                    {socialLinks.length > 1 && (
                      <button onClick={() => removeSocialLink(idx)} className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            {socialLinks.length < SOCIAL_PLATFORMS.length && (
              <button onClick={addSocialLink} className="mt-2 flex items-center gap-1.5 text-[13px] cursor-pointer" style={{ color: PRIMARY }}>
                <Plus className="w-4 h-4" /> Add Platform
              </button>
            )}
          </div>
        </div>
      );

    case "menu":
      return (
        <div className="space-y-4">
          {/* Restaurant branding row */}
          <div className="flex items-start gap-3">
            <div className="shrink-0">
              <label className={labelClass}>Logo</label>
              {fields.logoUrl ? (
                <div className="relative w-14 h-14 shrink-0">
                  <div className="w-full h-full rounded-xl overflow-hidden border-2 border-gray-200">
                    <img src={fields.logoUrl} alt="" className="w-full h-full object-contain p-1" />
                  </div>
                  <button onClick={() => update("logoUrl", "")} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center cursor-pointer shadow-sm z-10">
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ) : (
                <label className="w-14 h-14 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-[#4C80F1] transition-colors cursor-pointer bg-gray-50">
                  <ImagePlus className="w-5 h-5 text-gray-400" />
                  <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) update("logoUrl", await readFile(f)); }} />
                </label>
              )}
            </div>
            <div className="flex-1">
              <label className={labelClass}>Restaurant Name</label>
              <input className={inp} placeholder="The Great Kitchen" value={fields.restaurantName || ""} onChange={(e) => update("restaurantName", e.target.value)} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Brand Color</label>
            <div className="flex items-center gap-2">
              {["#F97316", "#EF4444", "#8B5CF6", "#4C80F1", "#059669", "#000000"].map((c) => (
                <button key={c} onClick={() => update("brandColor", c)}
                  className="w-7 h-7 rounded-lg border-2 transition-all cursor-pointer hover:scale-105"
                  style={{ backgroundColor: c, borderColor: fields.brandColor === c ? PRIMARY : "transparent" }} />
              ))}
              <input type="color" value={fields.brandColor || "#F97316"} onChange={(e) => update("brandColor", e.target.value)} className="w-7 h-7 rounded-lg cursor-pointer border-0 p-0" />
            </div>
          </div>

          <div><label className={labelClass}>Description (optional)</label><input className={inp} placeholder="Fresh ingredients, made with love" value={fields.menuDesc || ""} onChange={(e) => update("menuDesc", e.target.value)} /></div>

          {menuCategories.map((cat, ci) => (
            <div key={cat.id} className="bg-gray-50/80 rounded-xl p-3 space-y-2">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-gray-300" />
                <input className="flex-1 px-3 py-2 rounded-lg bg-white border border-gray-200 text-[13px] outline-none focus:border-[#4C80F1]" placeholder="Category Name" value={cat.name} onChange={(e) => updateCategoryName(ci, e.target.value)} />
                {menuCategories.length > 1 && <button onClick={() => removeMenuCategory(ci)} className="p-1.5 text-gray-400 hover:text-red-500 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>}
              </div>
              {cat.items.map((item, ii) => (
                <div key={item.id} className="ml-6 flex items-start gap-2">
                  <div className="shrink-0 mt-1">
                    {item.imageUrl ? (
                      <div className="relative w-9 h-9 shrink-0">
                        <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200">
                          <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        <button onClick={() => updateMenuItem(ci, ii, "imageUrl", "")} className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center cursor-pointer shadow-sm z-10"><X className="w-2.5 h-2.5 text-white" /></button>
                      </div>
                    ) : (
                      <button onClick={() => menuImageRefs.current[`${cat.id}-${item.id}`]?.click()} className="w-9 h-9 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-[#4C80F1] transition-colors cursor-pointer bg-white">
                        <ImagePlus className="w-4 h-4 text-gray-400" />
                      </button>
                    )}
                    <input type="file" accept="image/*" className="hidden" ref={(el) => { menuImageRefs.current[`${cat.id}-${item.id}`] = el; }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleMenuItemImage(ci, ii, f); }} />
                  </div>
                  <div className="flex-1 grid grid-cols-[1fr_80px] gap-2">
                    <input className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-[13px] outline-none focus:border-[#4C80F1]" placeholder="Item name" value={item.name} onChange={(e) => updateMenuItem(ci, ii, "name", e.target.value)} />
                    <input className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-[13px] outline-none focus:border-[#4C80F1]" placeholder="$0.00" value={item.price} onChange={(e) => updateMenuItem(ci, ii, "price", e.target.value)} />
                    <input className="col-span-2 px-3 py-2 rounded-lg bg-white border border-gray-200 text-[12px] outline-none focus:border-[#4C80F1]" placeholder="Description (optional)" value={item.description} onChange={(e) => updateMenuItem(ci, ii, "description", e.target.value)} />
                  </div>
                  {cat.items.length > 1 && <button onClick={() => removeMenuItem(ci, ii)} className="p-1.5 text-gray-400 hover:text-red-500 mt-1 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>}
                </div>
              ))}
              <button onClick={() => addMenuItem(ci)} className="ml-6 flex items-center gap-1 text-[12px] cursor-pointer" style={{ color: PRIMARY }}><Plus className="w-3.5 h-3.5" /> Add Item</button>
            </div>
          ))}
          <button onClick={addMenuCategory} className="flex items-center gap-1.5 text-[13px] cursor-pointer" style={{ color: PRIMARY }}><Plus className="w-4 h-4" /> Add Category</button>
        </div>
      );

    case "appstore":
      return (
        <div className="space-y-3">
          <div>
            <label className={labelClass}>App Icon (optional)</label>
            <ImageUpload
              imageUrl={fields.appIconUrl || ""}
              label="App icon"
              shape="square"
              onUpload={(url) => update("appIconUrl", url)}
              onRemove={() => update("appIconUrl", "")}
            />
          </div>
          <div><label className={labelClass}>App Name</label><input className={inp} placeholder="My Amazing App" value={fields.appName || ""} onChange={(e) => update("appName", e.target.value)} /></div>
          <div><label className={labelClass}>Apple App Store URL</label><input className={inp} placeholder="https://apps.apple.com/app/…" value={fields.appleUrl || ""} onChange={(e) => update("appleUrl", e.target.value)} /></div>
          <div><label className={labelClass}>Google Play Store URL</label><input className={inp} placeholder="https://play.google.com/store/apps/…" value={fields.googleUrl || ""} onChange={(e) => update("googleUrl", e.target.value)} /></div>
        </div>
      );

    case "coupon":
      return (
        <div className="space-y-3">
          <div><label className={labelClass}>Coupon Title</label><input className={inp} placeholder="20% Off Your Order" value={fields.couponTitle || ""} onChange={(e) => update("couponTitle", e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelClass}>Discount</label><input className={inp} placeholder="20%" value={fields.discount || ""} onChange={(e) => update("discount", e.target.value)} /></div>
            <div><label className={labelClass}>Coupon Code</label><input className={inp} placeholder="SAVE20" value={fields.couponCode || ""} onChange={(e) => update("couponCode", e.target.value)} /></div>
          </div>
          <div><label className={labelClass}>Valid Until (optional)</label><input className={inp} type="date" value={fields.expiryDate || ""} onChange={(e) => update("expiryDate", e.target.value)} /></div>
          <div><label className={labelClass}>Description (optional)</label><textarea className={`${inp} min-h-[60px] resize-none`} placeholder="Terms and conditions…" value={fields.couponDesc || ""} onChange={(e) => update("couponDesc", e.target.value)} /></div>
        </div>
      );

    case "pdf":
      return (
        <div className="space-y-3">
          {pdfItems.map((item, i) => (
            <MediaItemRow
              key={item.id}
              item={item}
              index={i}
              accept=".pdf,application/pdf"
              urlPlaceholder="https://example.com/document.pdf"
              onUpdate={(p) => pdf.update(i, p)}
              onRemove={() => pdf.remove(i)}
              canRemove={pdfItems.length > 1}
            />
          ))}
          <button onClick={pdf.add} className="flex items-center gap-1.5 text-[13px] cursor-pointer" style={{ color: PRIMARY }}>
            <Plus className="w-4 h-4" /> Add Another PDF
          </button>
        </div>
      );

    case "video":
      return (
        <div className="space-y-3">
          {videoItems.map((item, i) => (
            <MediaItemRow
              key={item.id}
              item={item}
              index={i}
              accept="video/*"
              urlPlaceholder="https://youtube.com/watch?v=…"
              onUpdate={(p) => video.update(i, p)}
              onRemove={() => video.remove(i)}
              canRemove={videoItems.length > 1}
            />
          ))}
          <button onClick={video.add} className="flex items-center gap-1.5 text-[13px] cursor-pointer" style={{ color: PRIMARY }}>
            <Plus className="w-4 h-4" /> Add Another Video
          </button>
        </div>
      );

    case "audio":
      return (
        <div className="space-y-3">
          {audioItems.map((item, i) => (
            <MediaItemRow
              key={item.id}
              item={item}
              index={i}
              accept="audio/*,.mp3,.wav,.m4a"
              urlPlaceholder="https://example.com/track.mp3"
              showArtist
              onUpdate={(p) => audio.update(i, p)}
              onRemove={() => audio.remove(i)}
              canRemove={audioItems.length > 1}
            />
          ))}
          <button onClick={audio.add} className="flex items-center gap-1.5 text-[13px] cursor-pointer" style={{ color: PRIMARY }}>
            <Plus className="w-4 h-4" /> Add Another Track
          </button>
        </div>
      );

    case "links":
      return (
        <div className="space-y-4">
          <div><label className={labelClass}>Page Title</label><input className={inp} placeholder="My Links" value={fields.linksTitle || ""} onChange={(e) => update("linksTitle", e.target.value)} /></div>
          <div>
            <label className={labelClass}>Links</label>
            <div className="space-y-2">
              {linkItems.map((item, i) => (
                <div key={item.id} className="flex items-center gap-2">
                  <div className="flex-1 grid grid-cols-[100px_1fr] gap-2">
                    <input className="px-3 py-2 rounded-lg bg-white/80 border border-gray-200/80 text-[13px] outline-none focus:border-[#4C80F1]" placeholder="Label" value={item.label} onChange={(e) => updateLinkItem(i, "label", e.target.value)} />
                    <input className="px-3 py-2 rounded-lg bg-white/80 border border-gray-200/80 text-[13px] outline-none focus:border-[#4C80F1]" placeholder="https://…" value={item.url} onChange={(e) => updateLinkItem(i, "url", e.target.value)} />
                  </div>
                  {linkItems.length > 1 && <button onClick={() => removeLinkItem(i)} className="p-2 text-gray-400 hover:text-red-500 cursor-pointer"><Trash2 className="w-4 h-4" /></button>}
                </div>
              ))}
            </div>
            <button onClick={addLinkItem} className="mt-2 flex items-center gap-1.5 text-[13px] cursor-pointer" style={{ color: PRIMARY }}><Plus className="w-4 h-4" /> Add Link</button>
          </div>
        </div>
      );

    default:
      return null;
  }
}

/* ── Build QR string value ─────────────────────────────────────────────── */
function buildValue(
  type: QRType,
  fields: Record<string, string>,
  socialLinks: { platform: string; url: string }[],
  menuCategories: MenuCategory[],
  linkItems: LinkItem[],
  pdfItems: MediaItem[],
  videoItems: MediaItem[],
  audioItems: MediaItem[],
): string {
  switch (type) {
    case "url":    return fields.url    || "";
    case "text":   return fields.text   || "";
    case "email": {
      const p: string[] = [];
      if (fields.subject) p.push(`subject=${encodeURIComponent(fields.subject)}`);
      if (fields.body)    p.push(`body=${encodeURIComponent(fields.body)}`);
      return `mailto:${fields.email || ""}${p.length ? "?" + p.join("&") : ""}`;
    }
    case "phone": return `tel:${fields.phone || ""}`;
    case "sms": {
      const base = `sms:${fields.phone || ""}`;
      return fields.message ? `${base}?body=${encodeURIComponent(fields.message)}` : base;
    }
    case "wifi":
      return `WIFI:T:${fields.encryption || "WPA"};S:${fields.ssid || ""};P:${fields.password || ""};;`;
    case "vcard":
      return ["BEGIN:VCARD","VERSION:3.0",
        `N:${fields.lastName || ""};${fields.firstName || ""}`,
        `FN:${fields.firstName || ""} ${fields.lastName || ""}`,
        fields.phone ? `TEL:${fields.phone}` : "",
        fields.email ? `EMAIL:${fields.email}` : "",
        fields.org   ? `ORG:${fields.org}` : "",
        fields.url   ? `URL:${fields.url}` : "",
        "END:VCARD",
      ].filter(Boolean).join("\n");
    case "social": {
      const valid = socialLinks.filter((l) => l.url.trim());
      if (!valid.length && !fields.socialTitle) return "";
      const payload = { title: fields.socialTitle || "My Links", desc: fields.socialDesc || "", links: valid };
      const base = window.location.href.split("#")[0];
      return `${base}#view?type=social&d=${btoa(unescape(encodeURIComponent(JSON.stringify(payload))))}`;
    }
    case "menu": {
      const hasItems = menuCategories.some((c) => c.items.some((i) => i.name.trim()));
      if (!hasItems && !fields.restaurantName) return "";
      // Strip imageUrl from items — base64 images are preview-only and too large for QR codes
      const cleanCategories = menuCategories.map((c) => ({
        id: c.id,
        name: c.name,
        items: c.items.map(({ id, name, price, description }) => ({ id, name, price, description })),
      }));
      const payload = { name: fields.restaurantName || "Restaurant", desc: fields.menuDesc || "", brandColor: fields.brandColor || "#F97316", categories: cleanCategories };
      const base = window.location.href.split("#")[0];
      return `${base}#view?type=menu&d=${btoa(unescape(encodeURIComponent(JSON.stringify(payload))))}`;
    }
    case "appstore": return fields.appleUrl || fields.googleUrl || "";
    case "coupon": {
      if (!fields.couponCode && !fields.couponTitle) return "";
      const payload = { title: fields.couponTitle || "", code: fields.couponCode || "", discount: fields.discount || "", expires: fields.expiryDate || "", desc: fields.couponDesc || "" };
      const base = window.location.href.split("#")[0];
      return `${base}#view?type=coupon&d=${btoa(unescape(encodeURIComponent(JSON.stringify(payload))))}`;
    }
    case "pdf": {
      const first = pdfItems.find((p) => p.url.trim() || p.fileUrl);
      return first?.url || (first?.fileUrl ? "data:uploaded" : "") || "";
    }
    case "video": {
      const first = videoItems.find((v) => v.url.trim() || v.fileUrl);
      return first?.url || (first?.fileUrl ? "data:uploaded" : "") || "";
    }
    case "audio": {
      const first = audioItems.find((a) => a.url.trim() || a.fileUrl);
      return first?.url || (first?.fileUrl ? "data:uploaded" : "") || "";
    }
    case "links": {
      const valid = linkItems.filter((l) => l.url.trim());
      if (!valid.length && !fields.linksTitle) return "";
      const payload = { title: fields.linksTitle || "My Links", links: valid };
      const base = window.location.href.split("#")[0];
      return `${base}#view?type=links&d=${btoa(unescape(encodeURIComponent(JSON.stringify(payload))))}`;
    }
    default: return "";
  }
}
