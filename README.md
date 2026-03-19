# QR Studio — Free QR Code Generator

A fully-featured, client-side QR code generator built with React, TypeScript, and Vite. Generate beautiful, customizable QR codes for 15 different content types — no backend required.

## Features

### 15 QR Code Types
- **URL** — any web link
- **Text** — plain text message
- **Email** — pre-filled email with subject and body
- **Phone** — tap-to-call
- **SMS** — tap-to-text with pre-filled message
- **WiFi** — instant network join (WPA/WEP/open)
- **vCard** — contact card with optional photo
- **Social** — link-in-bio page with multiple platform links
- **Menu** — restaurant menu with categories, items, prices, and brand color
- **App Store** — smart link to Apple App Store and/or Google Play
- **Coupon** — wallet-style coupon card with discount code and expiry
- **PDF** — single or multiple PDF links/uploads
- **Video** — single or playlist of video links/uploads
- **Audio** — single or playlist of audio tracks with artist info
- **Links** — custom link list page

### QR Code Customization
- Dot styles: square, rounded, dots, classy, classy-rounded
- Corner styles: square, rounded, dot
- Foreground and background color pickers
- Linear gradient mode with custom second color
- Logo/image overlay (auto-sets high error correction)
- Download as PNG or SVG
- Copy to clipboard

### Self-Hosted Landing Pages
For rich content types (social, menu, coupon, links), the QR code encodes a hash URL pointing back to the same app. Scanning the QR opens a full-screen mobile landing page — no external service needed. Works on any domain (localhost, staging, or production) automatically.

### Phone Preview
Live mockup in an iOS-style phone frame showing exactly what the scanned QR will display, including per-type previews for all 15 content types.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** for bundling
- **Tailwind CSS** for styling
- **qr-code-styling** for QR rendering with dot/corner style support
- **lucide-react** for icons

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```
