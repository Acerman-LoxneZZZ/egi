---
name: "Египет — путешествие сквозь тысячелетия"
description: "A warm museum world of weathered stone, sunset gold, papyrus, and calm Cyrillic typography."
colors:
  gold: "#dcb878"
  ink: "#342518"
  paper: "#e9d0b1"
  light: "#f7eace"
  stone: "#452f21"
  muted: "#755c42"
  deep-stone: "#37271d"
  reading-stone: "#34261d"
  footer-stone: "#271e18"
  light-plaque: "rgba(248,229,195,.73)"
  dark-plaque: "#4b3728"
  entry-stone: "#4b3725"
  entry-hover: "#5e4028"
  source-ink: "#67492b"
  dark-source: "#dfbd88"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(84px,7.7vw,144px)"
    fontWeight: 400
    lineHeight: 0.82
    letterSpacing: "0"
  gateway-subtitle:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(23px,2.15vw,36px)"
    fontWeight: 500
    lineHeight: 1.2
  headline:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(40px,3.2vw,58px)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-.02em"
  lead:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(24px,1.85vw,32px)"
    fontWeight: 400
    lineHeight: 1.4
  title:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "29px"
    fontWeight: 400
    lineHeight: 1.2
  fact-number:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "88px"
    fontWeight: 400
    lineHeight: 1
  body:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "clamp(15px,1vw,18px)"
    fontWeight: 400
    lineHeight: 1.85
  entry-label:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(17px,1.33vw,23px)"
    fontWeight: 400
    lineHeight: 1
  navigation:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(16px,1.15vw,21px)"
    fontWeight: 400
    lineHeight: 1
  chapter-navigation:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(15px,1.12vw,19px)"
    fontWeight: 400
    lineHeight: 1.2
  label:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.8
  caption:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: ".01em"
rounded:
  square: "0"
  entry: "2px"
spacing:
  page-gutter: "7.3vw"
  page-gutter-mobile: "7vw"
  small: "8px"
  text: "24px"
  plaque-compact: "28px"
  plaque-gap: "44px"
  plaque-block: "72px"
components:
  button-entry:
    backgroundColor: "{colors.entry-stone}"
    textColor: "{colors.gold}"
    typography: "{typography.entry-label}"
    rounded: "{rounded.entry}"
    padding: "0 24px"
    height: "3.23vw"
  button-entry-hover:
    backgroundColor: "{colors.entry-hover}"
    textColor: "{colors.gold}"
  button-motion:
    textColor: "{colors.light}"
    padding: "0"
    size: "36px"
  navigation-primary:
    textColor: "{colors.light}"
    typography: "{typography.navigation}"
  navigation-chapters:
    textColor: "{colors.light}"
    typography: "{typography.chapter-navigation}"
    padding: "8px 0"
  navigation-chapters-current:
    textColor: "{colors.gold}"
  navigation-reading:
    backgroundColor: "#34261df5"
    textColor: "{colors.light}"
    padding: "0 7.3vw"
    height: "62px"
  heading-chapter:
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
  plaque-light:
    backgroundColor: "{colors.light-plaque}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "32px 46px"
  plaque-dark:
    backgroundColor: "{colors.dark-plaque}"
    textColor: "{colors.light}"
    rounded: "{rounded.square}"
    padding: "32px 46px"
  source-link:
    textColor: "{colors.source-ink}"
    typography: "{typography.label}"
    padding: "0 0 4px"
  source-link-dark:
    textColor: "{colors.dark-source}"
    typography: "{typography.label}"
  source-directory:
    backgroundColor: "{colors.footer-stone}"
    textColor: "{colors.light}"
    padding: "18px 0"
---

# Design System: Египет — путешествие сквозь тысячелетия

## Overview

**Creative North Star: "The Stone Threshold"**

The visual world comes from weathered sandstone, sunset light, dark umber, and papyrus. Monumental imagery gives the visitor a sense of place; open editorial layouts and restrained museum plaques make the history comfortable to read. Cyrillic Cormorant Garamond supplies the museum voice, while Manrope carries the factual reading layer.

Materials retain their own detail. Warm washes unify the photographs and reconstructed landscapes without burying the stone carving or the papyrus grain. Depth belongs to the scene and to softly lifted fact plaques; navigation and source lists remain quiet and precise.

Recorded from the current source on 7 October 2026, after the bounded visual corrections. This document describes the built system; the independent finish verdict is recorded separately. The first-viewport composition and its approved reference remain in `.impeccable/surfaces/index-html.md`.

**Key Characteristics:**

- Weathered stone and textured papyrus with warm, readable tonal contrast.
- Cormorant Garamond display type paired with Manrope reading text.
- Open chapter layouts, visible ordinal numbers, and sparse fact plaques.
- Gold for actions, current location, and keyboard focus.
- Scroll-linked depth on desktop and a direct reading route on small screens.

## Colors

A warm material palette connects golden light, pale papyrus, and dark stone. The frontmatter is the normative color source. The sidecar's synthesized OKLCH tonal ramps are panel previews, not additional authored palette tokens.

### Primary

- **Sunset Gold** (`gold`): entry border and label, current chapter, hover navigation, motion and return controls, and visible keyboard focus.

### Neutral

- **Umber Ink** (`ink`): reading text on paper and the static portal backing.
- **Papyrus** (`paper`): the main reading material. The texture is the existing papyrus raster beneath `linear-gradient(#e9d0b1b8,#e9d0b1b8)`; the alpha is approximately 72%.
- **Ivory Light** (`light`): portal typography and text on dark chapters.
- **Weathered Stone** (`stone`): the browser theme and identity asset backing.
- **Muted Ochre** (`muted`): captions on light surfaces.
- **Deep Stone** (`deep-stone`): dark exhibition chapters.
- **Reading Stone** (`reading-stone`): the legacy chapter backing; its translucent form is used by the fixed reading bar.
- **Footer Stone** (`footer-stone`): the source directory and colophon.
- **Light Plaque / Dark Plaque** (`light-plaque`, `dark-plaque`): localized fact surfaces within the corresponding chapter.
- **Entry Stone / Entry Hover** (`entry-stone`, `entry-hover`): the desktop entrance action and its warmed hover state.
- **Source Ink / Dark Source** (`source-ink`, `dark-source`): quiet source links that remain distinct on light and dark materials.

**The Material Light Rule.** Preserve texture and carved detail before adding tint: the shared portal scene uses `brightness(.98)`, and the WebGL doorway and panorama materials use white tint (`0xffffff`). The static portal and flight both use `giza-world.png` with matching framing; the 3D scene renders at rest before the first scroll. Stone supports sit behind the carved frame without obscuring the opening.

**The Gold Wayfinding Rule.** Use gold for actions, location, and focus; give reading paragraphs the chapter's ink or ivory text color.

## Typography

**Display Font:** locally loaded Cormorant Garamond, with Georgia and generic serif fallback.  
**Body Font:** locally loaded Manrope, with Arial and generic sans-serif fallback.

The serif carries names, chapter titles, leads, facts, and navigation. The sans-serif carries paragraphs, references, units, and captions. Both have local Cyrillic subsets. Cormorant has loaded normal weights 400 and 500; Manrope has loaded weight 400. The source's serif declaration lists Halant first, but there is no loaded Halant font: it is not the authored display face documented here.

### Hierarchy

- **Display:** the entrance title; the desktop value is in `display`. At small-screen width it becomes `clamp(72px,16vw,110px)`.
- **Gateway subtitle:** medium-weight serif beneath the title; small screens use 24px with 1.1 line height and a 280px maximum text width.
- **Headline:** chapter titles, with balanced wrapping. At 1100px and below the general title size is 44px; at 700px and below all chapter titles are 37px. The Nile opening has its own compact desktop title (`clamp(37px,2.85vw,51px)`, then `2.85vw` at the intermediate breakpoint).
- **Lead:** a larger serif paragraph introducing each chapter.
- **Title / Fact number:** museum plaque title and the large factual value. Artifact plaques use 26px titles and 68px numbers; writing plaques use 24px and 62px. These are fitted component variants, not a new display family.
- **Body:** readable sans-serif paragraphs, normally capped at 65ch; artifact reading text is capped at 54ch and the final chapter at 52ch.
- **Navigation / Entry label:** serif controls; the brand has medium weight and wider tracking (`.25em`), while the reading-bar brand uses `.15em`.
- **Label / Caption:** quiet references and provenance text. Captions use the distinct `caption` rhythm, rather than a decorative uppercase label above headings.

**The Two Voices Rule.** Keep expressive titles, chapter leads, and fact values in Cormorant; keep factual reading, citations, captions, and units in Manrope.

## Layout

The page uses fluid side gutters rather than a fixed centered card grid. The desktop gutter is in `spacing.page-gutter`; small screens use `spacing.page-gutter-mobile`. Paragraphs use a 24px bottom interval, with a 30px interval after the serif lead.

Desktop chapters alternate editorial compositions: landscape plus copy (1.2fr / 1fr), artifact plus copy (1.1fr / .8fr, or reversed), and two equal writing columns. Their normal gaps are 8vw or 9vw; landscape and artifact gaps tighten to 5vw at 1100px. General chapters have 110px top and 120px bottom padding. The opening chapter has its own shorter lead-in (36px top, 100px bottom).

At 700px and below, columns become a single reading flow with 35px gaps. Later chapters use 70px top and 75px bottom padding. Images stay large, with artifact photographs contained and landscapes cropped. The mobile chapter index scrolls within its own row; the document itself does not expand horizontally.

Fact plaques are centered with an 860px maximum width and a 72px top interval. Their base padding and gap live in the component tokens; compact artifact and writing variants use tighter interiors. At 1100px they reduce to 28px padding and a 25px gap; at 900px the base fact value becomes 68px. On mobile they stack the large value above the explanation.

The fixed reading bar is 62px high on desktop and 56px on small screens. It appears after the portal has left the reading viewport; chapter navigation keeps real anchor links.

**The Open Exhibition Rule.** Let large images and text share the page's open grid. Reserve filled panels for focused facts and the reading navigation menu.

## Elevation & Depth

Depth is a hybrid of cinematic space and restrained material lift. The portal scene has separate foreground stone, a distant panorama, volumetric supports, a warm threshold flare, and depth-aware background blur. Paper chapters use texture and tonal contrast; they do not receive general card shadows.

### Shadow Vocabulary

- **Light fact plaque:** `0 15px 38px -22px rgba(64,40,19,.4)`.
- **Dark fact plaque:** `0 18px 50px -28px #130c07`.
- **Reading bar:** `0 5px 24px -12px #130c0777`.
- **Portal title:** text shadow `0 3px 26px rgba(24,16,11,.32)` protects the heading over imagery.
- **Papyrus artifact:** drop shadow `0 18px 22px rgba(79,47,16,.2)` separates the museum object from the paper surface.

**The Gentle Lift Rule.** Fact plaques may tilt by at most 3 degrees with a fine pointer; use the existing 1200px perspective and .35s `cubic-bezier(.16,1,.3,1)` return. Touch and reduced-motion reading remain stable.

The desktop flight is driven by one absolute scroll state across a runway of 2.15 viewport heights. Text fades near the entrance, the flare peaks at progress .56, and the panorama gradually loses focus near the exit. Reversing scroll restores the same scene state. On small screens, manual pause, system reduced motion, or a WebGL failure, the document uses its static reading route. The reduced-motion CSS also shortens transitions and animations to .01ms.

The entrance title, subtitle, and action arrive over .75s with a .1s stagger and exponential deceleration. During the flight, the copy recedes upward while the chapter index moves down. Reading chapters enter in scroll order with one synchronized timeline: headings, text and fact plaques arrive from 36px to the left, while photographs and captions arrive from 36px to the right. The legacy background joins the image side. Both sides move over 1.3s with gentle power2.out deceleration. The shared chapter trigger starts at top 65%, when about a third of the viewport already contains the section, so the entrance remains visible. Every content root starts at the same time, without stagger, separate image masks or zoom. Nested text inherits its parent's motion without a second offset. Each chapter entrance plays once, leaves already visible content in place, and reverts completely when motion is disabled. Chapter boundaries clip the travelling content so the document never widens. The desktop reading bar arrives over .38s; the entrance arrow and sun control give short directional feedback.

## Shapes

Reading surfaces, object frames, and plaques have square corners. The entry action has only the slight `entry` radius. Fine rules divide source rows, frame the entrance action, underline the current chapter, and separate desktop chapter links. This stone-and-paper world does not forbid lines: its rules are part of the material and wayfinding language.

All control marks are authored inline SVG with fine current-color strokes: the entrance arrow, sun control, chapter menu chevron, source arrow, and return arrow. The Nile source uses the diagonal SVG arrow present in the current HTML.

## Components

### Entrance action

A framed threshold action, with a gold label and border over dark stone. Desktop uses the `button-entry` tokens with a 48px minimum height and 15.67vw minimum width. The small-screen version is 48px high with a 19px label; the base translucent background is `rgba(61,43,29,.85)`. Hover warms the fill and lifts the action by 2px over .25s. The inline arrow remains 24px by 16px. Focus uses a 2px gold outline with 6px offset.

### Motion control

A transparent sun button with an accessible pressed state. The entrance button is 36px square; the reading-bar version is 28px square. Pressed state reduces opacity to .55. Small-screen mode hides these controls, and system reduced motion disables them. The sun is SVG, not a text glyph.

### Navigation

Primary navigation uses the quiet serif navigation role and warms to gold on hover over .2s. The entrance chapter row combines a tabular current count, the seven chapter anchors, and a fine upper rule. Desktop links have vertical separators after the first link. The current anchor has a gold label and a 2px gold underline; hover reveals the same underline over .3s.

The reading bar contains a serif brand, current chapter text, and a native details menu. The menu is a square dark panel with a fine warm border and 16px by 22px padding. Its links are 17px serif with 9px vertical padding; on small screens they use 11px padding and a constrained scrolling menu. Opening rotates the chevron; selecting a link or pressing Escape closes the menu.

### Chapter heading

An ordinal number and an expressive title share a baseline. Later chapters use a 34px gap and a subdued ordinal; the opening chapter keeps a longer fine rule between its number and title. Small screens use tighter gaps and wrapping. The title is sufficient by itself: the sources footer starts directly with its heading and explanatory paragraph.

### Museum plaque

A focused fact surface, not a general content card. A large serif number sits beside a serif title and short 14px sans-serif explanation at 1.8 line height. The light and dark variants inherit their chapter text colors and use their corresponding plaque fill and shadow. Units are a separate 16px sans-serif line below the number. Compact artifact and writing variants fit the surrounding editorial column; mobile plaques stack.

### Source links and directory

Inline sources use 12px sans-serif, a fine bottom rule, an 8px icon gap when present, and 4px bottom padding. Light sources darken on hover; dark sources use the warmer `dark-source` color. The Nile arrow is the authored diagonal inline SVG, sized 15px.

The source directory uses full-width text rows with a top rule, a 14px topic, and a quieter 12px institution name aligned to the right. Hover changes the row text to gold over .2s. Mobile rows stack their two text parts and align both left. There are no decorative eyebrows above this directory.

### Images and captions

Landscape images use cover crops; museum objects use contain so their full silhouette stays visible. Captions remain small, readable, and tied to the image. The Nile caption uses an ivory label over a localized dark translucent backing. The desktop pinned opening preview uses an unscaled image crop at `center 72%`, keeping the river visible; the full chapter keeps its separate editorial crop.

## Do's and Don'ts

### Do:

- **Do** preserve readable material detail using the Material Light Rule.
- **Do** use gold to identify actions, location, and keyboard focus.
- **Do** pair Cormorant museum typography with Manrope factual reading.
- **Do** use open chapter layouts and square fact plaques with soft material lift.
- **Do** keep source links, provenance captions, and chapter anchors visible in the static reading route.
- **Do** preserve desktop chapter separators and the river-focused opening preview crop.
- **Do** use the existing inline SVG marks and visible gold focus outline.

### Don't:

- **Don't** darken the corrected portal texture or tint the WebGL doorway away from white.
- **Don't** replace the textured paper wash with a plain fill or a heavier wash that buries its grain.
- **Don't** treat the unprovided Halant fallback as the site's loaded display font.
- **Don't** add a decorative eyebrow to the sources heading.
- **Don't** extend the cinematic flight, particle motion, or plaque tilt into reduced-motion or small-screen reading.
- **Don't** turn the sparse fact plaques into a uniform grid around every reading block.
