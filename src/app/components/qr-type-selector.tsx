import {
  Link,
  Type,
  Mail,
  Phone,
  Wifi,
  MessageSquare,
  User,
  Share2,
  UtensilsCrossed,
  Smartphone,
  Tag,
  Video,
  Music2,
  List,
} from "lucide-react";
import { WhatsAppIcon } from "./whatsapp-icon";

export type QRType =
  | "url"
  | "text"
  | "email"
  | "phone"
  | "wifi"
  | "sms"
  | "vcard"
  | "social"
  | "menu"
  | "appstore"
  | "coupon"
  | "whatsapp"
  | "video"
  | "audio"
  | "links";

interface QRTypeSelectorProps {
  selected: QRType;
  onChange: (type: QRType) => void;
}

const types: { id: QRType; label: string; icon: React.ElementType }[] = [
  { id: "url",      label: "URL",      icon: Link },
  { id: "text",     label: "Text",     icon: Type },
  { id: "email",    label: "Email",    icon: Mail },
  { id: "phone",    label: "Phone",    icon: Phone },
  { id: "sms",      label: "SMS",      icon: MessageSquare },
  { id: "wifi",     label: "WiFi",     icon: Wifi },
  { id: "vcard",    label: "vCard",    icon: User },
  { id: "social",   label: "Social",   icon: Share2 },
  { id: "menu",     label: "Menu",     icon: UtensilsCrossed },
  { id: "appstore", label: "App Store",icon: Smartphone },
  { id: "coupon",   label: "Coupon",   icon: Tag },
  { id: "whatsapp", label: "WhatsApp",  icon: WhatsAppIcon },
  { id: "video",    label: "Video",    icon: Video },
  { id: "audio",    label: "Audio",    icon: Music2 },
  { id: "links",    label: "Links",    icon: List },
];

export function QRTypeSelector({ selected, onChange }: QRTypeSelectorProps) {
  return (
    <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
      {types.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex flex-col items-center gap-1 px-1 py-2.5 sm:py-3 rounded-xl transition-all cursor-pointer ${
            selected === id
              ? "text-white shadow-md scale-[1.02]"
              : "bg-white/100 text-gray-500 hover:bg-white hover:shadow-sm hover:text-gray-700 border border-gray-100/80"
          }`}
          style={selected === id ? { backgroundColor: "#4C80F1", boxShadow: "0 0px 12px #4c80f176" } : {}}
        >
          <Icon className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
          <span className="text-[9px] sm:text-[10px] tracking-wide whitespace-nowrap">{label}</span>
        </button>
      ))}
    </div>
  );
}
