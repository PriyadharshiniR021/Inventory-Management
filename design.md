# Auralis Style Guide

Style foundations only: color, type, spacing, shape, effects, motion, icons.

**Look:** warm-neutral, light mode, editorial. Black and off-white UI, big tight bold headlines, hairline borders, pill buttons, soft blurred pastel glows as the only color.

---

## 1. Color

### Neutrals (UI)

| Role | Hex | Use |
|------|-----|-----|
| Page background | `#F7F7F5` | Body, nav (80% opacity) |
| Panel | `#F3F2EF` | Large panels, small cards |
| Card | `#FCFCFB` | Feature cards |
| Border | `#E7E7E4` | All 1px hairlines |
| Text primary | `#111111` | Headings, body |
| Text secondary | `#6B6B6B` | Paragraphs, captions, inactive items |
| Primary (action) | `#000000` | Filled buttons |
| On primary | `#FFFFFF` | Text on black |
| Outline | `#747878` | Outlined button border |
| Surface | `#FDF8F8` | Chips, tab active bg |
| Surface variant | `#E5E2E1` | Tags, hover tint, chat bubbles |
| Surface container low | `#F7F3F2` | Tab switcher bg, pills |
| Dark surface | `#1C1B1B` | Dark avatar, dark elements |

### Accents (decorative only, never for UI controls)

| Name | Gradient / value | Use |
|------|------------------|-----|
| Rose to orange | `rose-400 → orange-300` | Hero orb |
| Indigo to purple | `indigo-300 → purple-400` | Hero orb |
| Emerald to teal | `emerald-300 → teal-200` | Hero orb |
| Sky to blue | `sky-300 → blue-400` | Hero orb |
| Card tint A | `indigo-500/10 → purple-500/20` | Card background glow |
| Card tint B | `emerald-500/10 → teal-500/20` | Card background glow |
| Soft orbs | `blue-200→cyan-100`, `purple-200→pink-100` | Showcase card glow |
| Live / status | `emerald-500` dot, `emerald-700` text, `emerald-500/15` bg | Status badge |
| Data bars | `blue-500`, peaks `purple-600` | Chart / spectrum |

**Rule:** 95% of the interface is neutral. Color only appears as blurred glow shapes behind content.

---

## 2. Typography

**Font:** Geist (400, 500, 600, 700)
**Icons:** Material Symbols Outlined

### Scale

| Style | Size | Line height | Letter spacing | Weight |
|-------|------|-------------|----------------|--------|
| H1 (hero) | 84px | 1.05 | -0.04em | 600 |
| H2 (section) | 64px | 1.1 | -0.03em | 600 |
| H2 (module) | 48px | 1.1 | -0.03em | 600 |
| H3 | 32px | 1.2 | -0.02em | 600 |
| Card title | 20px | 1.2 | -0.02em | 600 |
| Body large (lead) | 18px | 1.6 | -0.01em | 400 |
| Body | 16px | 1.5 | 0 | 400 |
| UI text (nav, tabs, buttons) | 14px | 1.5 | -0.01em | 500 |
| Label caps | 12px | 1 | +0.1em, uppercase | 600 |
| Micro label | 10px | 1 | +0.1em, uppercase | 600 |
| Mono (timecode) | 12px | 1 | 0 | 700 |
| Wordmark | 20px | 1 | -0.05em | 700 |

### Rules
- Large headings: tight negative tracking, weight 600.
- Tiny labels: wide positive tracking, uppercase.
- UI controls: weight 500. Body: weight 400.
- Paragraphs use secondary gray `#6B6B6B`; headings use `#111111`.
- Headlines are sentence case.

---

## 3. Spacing and Layout

| Token | Value |
|-------|-------|
| Base unit | 8px |
| Content max width | 1280px |
| Side padding | 32px |
| Grid | 12 columns |
| Gutter | 32px |
| Nav height | 72px |
| Top offset below nav | 140px |
| Section gap | 140px to 180px |
| Header to content | 48px to 64px |
| Heading to paragraph | 24px |

### Spacing scale in use

| Size | Where |
|------|-------|
| 4px | Tab switcher inner padding |
| 8px | Icon gaps, tight stacks |
| 12px | Chip padding vertical, label gaps |
| 16px | Button padding (small), card inner gaps, divider gaps |
| 20px | Small card padding |
| 24px | Large card padding, grid gap (cards), button padding (large horizontal) |
| 32px | Panel padding, grid gutter, page side padding |
| 48px | Header to content |
| 64px | Large header to content |
| 140px / 180px | Between sections |

### Padding by component

| Component | Padding |
|-----------|---------|
| Button large | 12px 24px |
| Button small / nav | 8px 16px |
| Tab | 8px 16px |
| Label pill | 4px 12px |
| Small card | 20px |
| Large card | 24px |
| Panel / showcase card | 32px |
| Glass widget | 32px |

### Breakpoints
- Tablet: 768px (2 and 4 column grids, nav links appear)
- Desktop: 1024px (12-column layouts)

---

## 4. Shape (Border Radius)

| Token | Value | Use |
|-------|-------|-----|
| sm | 4px | Small details |
| md | 8px | Chips, inputs |
| lg | 12px | Small cards |
| xl | 24px | Large cards, inner bars |
| 2xl | 28px | Hero panel, showcase cards |
| glass | 32px | Floating glass widget |
| full | 9999px | Buttons, tabs, pills, orbs, avatars |

---

## 5. Borders and Elevation

| Item | Value |
|------|-------|
| Default border | 1px solid `#E7E7E4` |
| Outlined button | 1px solid `#747878` |
| Nav bottom border | 1px, zinc-200 at 60% |
| Glass border | 1px, white at 40% |
| Divider line | 1px, `#E7E7E4`, 50% opacity |

### Shadows (very light use)

| Level | Value | Use |
|-------|-------|-----|
| None | none | Most cards and panels |
| Small | `0 1px 2px rgba(0,0,0,0.05)` | Active tab, card hover |
| Large | `0 10px 15px rgba(0,0,0,0.1)` | Circular play buttons |
| Glass float | `0 48px 96px -24px rgba(0,0,0,0.25)` | Floating widget |

Depth comes from tonal layering (page, then panel, then card) plus hairline borders, not shadows.

---

## 6. Effects

### Blur and glass

| Effect | Value |
|--------|-------|
| Nav | bg `#F7F7F5` at 80%, backdrop blur 12px |
| Frosted bar / overlay | bg surface at 80-90%, backdrop blur 12px |
| Label chip on card | bg surface at 80%, backdrop blur 4px |
| Glass widget | bg white at 25%, backdrop blur 64px, border white at 40% |

### Decorative glow (orbs)
- Shapes: circles 200px to 400px.
- Fill: the accent gradients in section 1, diagonal (`to top right`).
- Blur: 40px to 64px (`blur-3xl`); up to 80px for large soft glows.
- Opacity: 40-60% in cards (rises on hover), 100% in hero panel.
- Placement: behind content, overlapping each other, offset from center.

### Opacity levels
| Value | Use |
|-------|-----|
| 10-20% | Card tints |
| 25% | Glass fill |
| 40-50% | Resting glow layers |
| 60-80% | Hovered glow layers |
| 80-90% | Frosted bars |

---

## 7. Motion

| Interaction | Effect | Duration |
|-------------|--------|----------|
| Link hover | Color gray to near-black | 200ms |
| Card hover | Tint fades in, tiny shadow | 150-300ms |
| Glow layer hover | Opacity 40% to 60% | 500ms |
| Image hover | Opacity 80% to 100% | 500ms |
| Circular button hover | Scale 1.05 to 1.10 | 150ms |
| Button press | Opacity 80% | instant |
| Live status dot | Gentle pulse | loop |
| Logo marquee | Continuous horizontal scroll, pauses on hover | 40s linear |

**Feel:** soft and slow. Only opacity, color and small scale. No bouncing or sliding.

---

## 8. Iconography

| Property | Value |
|----------|-------|
| Set | Material Symbols Outlined |
| Weight | 400 |
| Default size | 24px |
| Other sizes | 14px (avatars), 30px (logos), 36px (hero play) |
| Style | Outline by default, filled only for the main play control |
| Color | Secondary gray for decorative, primary for functional |

---

## 9. Quick Reference

```
FONT        Geist 400 / 500 / 600 / 700
BG          #F7F7F5      PANEL   #F3F2EF      CARD   #FCFCFB
BORDER      #E7E7E4      TEXT    #111111      MUTED  #6B6B6B
ACTION      #000000 with #FFFFFF text
H1          84 / 1.05 / -0.04em / 600
H2          64 (48 in modules) / 1.1 / -0.03em / 600
CARD TITLE  20 / 600          BODY  16-18          UI  14 / 500
LABEL       12 uppercase, +0.1em, 600
WIDTH       1280 max, 32 side padding, 12 cols, 32 gutter
SECTIONS    140-180 apart
RADIUS      cards 24 / panels 28 / buttons, tabs, pills full
SHADOW      almost none (hairline borders instead)
GLASS       blur 12px (bars), 64px (widget), white 25-90%
ACCENT      pastel blurred orbs only; green dot for "live"
MOTION      opacity / color / scale 1.05; 40s marquee
```

---

## 10. Design Tokens (copy into any project)

```css
:root {
  /* Color */
  --bg: #F7F7F5;
  --panel: #F3F2EF;
  --card: #FCFCFB;
  --border: #E7E7E4;
  --text: #111111;
  --text-muted: #6B6B6B;
  --primary: #000000;
  --on-primary: #FFFFFF;
  --outline: #747878;
  --surface: #FDF8F8;
  --surface-variant: #E5E2E1;

  /* Type */
  --font: "Geist", sans-serif;
  --fs-h1: 84px;  --fs-h2: 64px;  --fs-h2-module: 48px;
  --fs-h3: 32px;  --fs-card: 20px;
  --fs-lead: 18px; --fs-body: 16px; --fs-ui: 14px; --fs-label: 12px;

  /* Spacing */
  --space-1: 4px;  --space-2: 8px;   --space-3: 12px; --space-4: 16px;
  --space-5: 20px; --space-6: 24px;  --space-8: 32px; --space-12: 48px;
  --space-16: 64px; --section-min: 140px; --section-max: 180px;
  --container: 1280px; --gutter: 32px; --nav-h: 72px;

  /* Radius */
  --r-sm: 4px; --r-md: 8px; --r-lg: 12px;
  --r-xl: 24px; --r-2xl: 28px; --r-glass: 32px; --r-full: 9999px;

  /* Shadow */
  --shadow-sm: 0 1px 2px rgba(0,0,0,.05);
  --shadow-lg: 0 10px 15px rgba(0,0,0,.1);
  --shadow-glass: 0 48px 96px -24px rgba(0,0,0,.25);

  /* Blur */
  --blur-bar: 12px; --blur-glass: 64px;
  --blur-orb: 64px; --blur-orb-lg: 80px;

  /* Motion */
  --t-fast: 150ms; --t-base: 200ms; --t-slow: 500ms;
}
```