# Axon Aura — AR Menu Platform for Premium Hospitality

> Turn every restaurant table into an interactive 3D preview. Guests scan a QR code on the table and see each dish — rendered as a photoreal 3D model, viewable in AR on their own phone — before they order.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.183-blue?logo=three.js)](https://threejs.org/)
[![model-viewer](https://img.shields.io/badge/model--viewer-4.2-lightgrey)](https://modelviewer.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)

## The Problem

Restaurant menus are flat — text and, at best, a studio photo. Guests order what they recognise, not what looks best. Premium kitchens spend hours plating food that the diner never truly previews. Axon Aura solves this by putting the actual dish, in 3D, on the guest's own screen, in AR.

## What It Does

- Guest scans the QR code printed on their table
- Phone opens the restaurant's menu — **no app install** required
- Any dish can be tapped to see a photoreal 3D model
- On iOS the model drops into AR Quick Look (USDZ); on Android, into Scene Viewer (GLB)
- Owner-side CMS to upload models, edit menus, and see which dishes get the most AR views

## Features

- QR-to-AR flow with zero app install, powered by Google's `<model-viewer>` and WebXR where available
- Dual-format 3D pipeline — **GLB** (Android / Web) and **USDZ** (iOS AR Quick Look)
- Draco mesh compression and GLTF transform optimisations for fast mobile loads
- Per-restaurant, per-table unique QR codes with view-tracking analytics
- Admin dashboard for restaurants to upload dishes, edit descriptions, and monitor engagement
- Email alerts on new leads / pilot sign-ups via Nodemailer
- Mobile-first, premium visual design with Framer Motion transitions

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router) + TypeScript |
| 3D rendering | Three.js r183, `@google/model-viewer` v4, GLTF Transform |
| 3D assets | GLB (Draco-compressed) for Android/Web, USDZ for iOS |
| Styling | Tailwind CSS + Framer Motion |
| Email | Nodemailer (SMTP) for lead notifications |
| Image tools | `canvas` for thumbnail/poster generation |

## Project Structure

```
src/
├── app/                  # Next.js App Router pages and API routes
└── components/           # Reusable UI (AR viewer, menu grid, dish card, admin)
scripts/
└── bake-card-into-glb.mjs  # Bakes restaurant-branded info cards into GLB files
public/                   # Static assets, sample 3D models, favicons
```

## Getting Started

### Prerequisites
- Node.js 18+
- An SMTP account for lead notifications (any provider — Zoho, Gmail app password, etc.)

### Install & Run

```bash
git clone https://github.com/alphoder/AxonPremium.git
cd AxonPremium
npm install

cp .env.example .env.local
# Fill in:
#   SMTP_EMAIL=...
#   SMTP_PASSWORD=...
#   NOTIFY_EMAIL=...

npm run dev
# http://localhost:3000
```

### Build

```bash
npm run build
npm start
```

## 3D Asset Pipeline

Every dish needs a matched pair:

- **`dish.glb`** — Draco-compressed GLB for Android and browser fallback (target < 3 MB)
- **`dish.usdz`** — Apple USD Zip for iOS AR Quick Look

GLBs can be optimised with the bundled script:

```bash
node scripts/bake-card-into-glb.mjs input.glb output.glb
```

This uses `@gltf-transform/functions` to deduplicate, quantise, and Draco-encode geometry.

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `SMTP_EMAIL` | Sender address for transactional emails |
| `SMTP_PASSWORD` | App password / SMTP token |
| `NOTIFY_EMAIL` | Where pilot-signup and lead emails are delivered |

## Deployment

Optimised for Vercel (zero-config). Place large 3D assets on a CDN (Cloudflare R2 / S3) and reference them from the menu CMS — do not commit them to the repo.

## Why "Aura"

Axon Aura sits inside the broader Axon product suite — AI-powered growth tools for premium brands. Aura is the *premium segment* module: AR menus for hospitality, AR product previews for luxury retail.

## License

Proprietary — all rights reserved. Contact the repository owner for licensing enquiries.

---

Built by [@alphoder](https://github.com/alphoder) · Part of the Axon product suite.
