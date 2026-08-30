---
name: steelwood-design
description: SteelWood's own brand design system — warm premium palette (cream/beige/dark-wood/sage-green + gold accent), Cormorant Garamond serif headings over Inter sans body, 16/24/32px radius scale, soft-shadow elevation ("shadow-soft*"), ease-luxe motion, uz/ru bilingual content pattern. Load this before designing, styling, restyling, or handling any "chiroyliroq/premium/yaxshi qil" request on a SteelWood page, component, admin panel, or texture/pattern — so new work matches the existing brand instead of generic or invented styling.
---

# SteelWood design system

SteelWood is a furniture e-commerce site (steel-frame + wood furniture: desks,
shelving, etc.) with an already-established **"Premium" design system** — do
not invent a new palette, font pairing, or shadow style. Extend the existing
one. Source of truth: [tailwind.config.ts](../../../tailwind.config.ts) and
[src/index.css](../../../src/index.css) (search there for the literal HSL
values before writing any color, they may have shifted since this was written).

## Identity

Warm, quiet, "premium furniture catalog" — not tech-startup, not loud
e-commerce. Off-white/cream backgrounds, deep forest-green as the structural
"ink" color (not black), a warm tan/beige as the default accent, generous
rounded corners, soft diffuse shadows instead of hard borders, slow
confident motion (`ease-luxe`).

## Color tokens

All colors are HSL CSS variables (`hsl(var(--token))`), themed via `.dark`,
consumed through Tailwind color names (`bg-secondary`, `text-foreground`,
etc.) — never hardcode hex unless deliberately breaking the palette for a
one-off accent the user explicitly asked for (see "Deliberate exceptions").

Light theme:
- `--background` 43 30% 95% (warm cream), `--foreground` 0 0% 13% (near-black)
- `--card` 43 26% 97%, `--primary` 153 30% 17% (deep sage/forest green — the
  brand's real "ink" color, used for CTAs and headings, not pure black)
- `--secondary` / `--accent` both 34 36% 75% (warm tan/beige) — in this
  system secondary and accent are the same warm beige; there is normally
  only **one** non-neutral hue on screen at a time
- `--muted` 43 24% 90% (soft cream-gray), `--muted-foreground` 0 0% 40%
- `--border`/`--input` 34 30% 85% (warm beige-gray, not cool gray)
- `--gold-accent` 38 45% 55% — reserved for rare premium highlights
  (badges, discount callouts), not a general-purpose accent

Dark theme mirrors this with deep forest-green backgrounds (`150 20% 10%`)
and warm cream foreground/primary — always check both when touching colors.

Rule of thumb: **one warm hue family** (cream → beige → tan → gold) plus the
deep forest-green as the "dark ink." Don't add blues, purples, or saturated
brand-unrelated hues to core UI. `--success`/`--whatsapp` (green) and
`--destructive` (red) are the only sanctioned functional-status exceptions.

## Typography

- Headings (`h1`–`h6`, and anything `font-serif`/`font-heading`):
  **Cormorant Garamond** (falls back to Georgia/serif) — set globally with
  `letter-spacing: -0.02em; font-weight: 600`. This serif is the brand's
  signature editorial touch; use it for card/section titles like "Stollar".
- Body/UI text: **Inter** (`font-sans`), the default — do not add a third
  typeface.
- Small uppercase labels (category eyebrows, section kickers) get wide
  tracking (`tracking-[0.2em]`–`tracking-[0.24em]`) and
  `text-muted-foreground`, matching the pattern in
  [HomeSections.tsx](../../../src/components/home/HomeSections.tsx) and
  [PromoCarousel.tsx](../../../src/components/home/PromoCarousel.tsx).

## Radius & spacing

- Named radius scale: 16px / 24px / 32px (`rounded-16/24/32` or the raw
  `rounded-[1.5rem]`/`rounded-[2rem]` forms already used across cards).
  Large cards read as SteelWood when they use `rounded-[2rem]`
  (`lg:rounded-[2rem]`) — sharp corners or small radii (4–8px) read as a
  different brand, avoid them for hero/category cards.
  Buttons commonly go fully round (`rounded-full`).
- Section rhythm: `mt-10 lg:mt-16` between related blocks,
  `mt-16 lg:mt-24` between major sections, `container mx-auto px-4 lg:px-8`
  as the standard page gutter.

## Elevation & motion

- Shadows: use the existing utility classes — `shadow-soft` (default),
  `shadow-soft-lg` (hover-elevated), `shadow-soft-xl` (rare, big hero
  elements). These map to soft, diffuse, forest-green-tinted shadows
  (`--shadow-md`/`--shadow-lg` in `index.css`), not hard gray drop-shadows.
  Never add `shadow-md`/generic Tailwind shadow utilities alongside these —
  pick one system.
- Motion: `transition-all duration-500 ease-luxe` (a slow, confident
  `cubic-bezier(0.22, 1, 0.36, 1)`) is the house easing for hover states
  (lift `hover:-translate-y-1`/`1.5`, scale `hover:scale-105` on images).
  Faster/snappier easings (linear, default ease) read off-brand here.

## Component patterns already in place

- **Category/collection cards**: a `Link`-wrapped card, text pane +
  image pane (`grid grid-cols-[1fr_1.1fr]`), image via the shared
  `LazyImage` component (never a raw `<img>` for content images — it
  handles lazy loading consistently), title in serif, a muted one-line
  description, and a text `Ko'rish →` affordance using `ArrowRight` from
  `lucide-react` that nudges right on hover
  (`group-hover:translate-x-1`). See
  [HomeSections.tsx](../../../src/components/home/HomeSections.tsx) as the
  reference implementation.
- **Buttons**: shadcn `Button` (`src/components/ui/button.tsx`) with
  `asChild` wrapping a `Link`, `rounded-full`, generous horizontal padding
  (`px-8`).
- **Icons**: `lucide-react`, single stroke weight, used sparingly and
  functionally (arrows, feature-strip icons) — not as decoration.

## Mobile carousel pattern

For any "make this a swipeable single-row mobile carousel" request, the
established pattern (see `CollectionBanners` in
[HomeSections.tsx](../../../src/components/home/HomeSections.tsx)) is:

- Container: `flex overflow-x-auto snap-x snap-mandatory scrollbar-hide
  gap-4` on mobile, switching to `md:grid md:grid-cols-N md:overflow-visible
  md:snap-none` at the desktop breakpoint — one component, two layouts via
  responsive classes, not a separate mobile component.
- Cards: `shrink-0 w-full` (one full card per view, centered by the
  section's own `px-4` gutter — don't reintroduce a canceling
  `-mx-4 px-4` bleed unless a peek-next-card effect is explicitly wanted)
  and `snap-start`.
- `.scrollbar-hide` utility (in `index.css`) hides the native scrollbar
  while keeping native touch/drag scrolling — prefer this over pulling in
  a JS carousel library for simple cases. `embla-carousel-react` is already
  a dependency (see `PromoCarousel.tsx`) and is the fallback when you need
  drag-free momentum, snap progress indicators, or prev/next buttons.
- Optional autoplay: a `matchMedia('(max-width: 767px)')`-gated
  `setInterval` that advances an index and calls
  `child.scrollIntoView({ behavior: 'smooth', inline: 'start' })`, paused
  on `pointerdown`/resumed on `pointerup` — see the `CollectionBanners`
  autoplay effect for the exact shape.

## Bilingual content (uz/ru)

Every user-facing string branches on a `language: 'uz' | 'ru'` prop with a
plain ternary (`language === 'uz' ? '...' : '...'`) at the call site — there
is no i18n library in these components. Always provide both strings, never
leave a TODO in one language, and match the existing tone (short, direct,
lowercase-first Uzbek like "Zamonaviy dizayn, uzoq muddatli sifat.").

## Decorative textures

If asked to add a background pattern/texture to a card or panel, favor a
**thin, corner-or-edge-confined motif**, masked to fade away from any text
(`mask-image: linear-gradient(...)`), at low opacity (~0.10–0.15). For the
`CollectionBanners` cards specifically the client settled on `#f46734`
(a specific brand coral-orange, not the `--gold-accent` token) as the
texture color at this low opacity — treat that literal hex as the
established color for this element; don't quietly swap it back to
`--gold-accent`. For a *new* textured element elsewhere, ask/default to
`--gold-accent` first since `#f46734` was a one-off pick for this card, not
declared as the site's general accent replacement.

See the herringbone (wood-parquet chevron) strip on the
`CollectionBanners` cards in
[HomeSections.tsx](../../../src/components/home/HomeSections.tsx) as the
reference: a fixed-width strip (`w-16 lg:w-24`, not `w-full`) confined to
the edge nearest the image, masked with
`linear-gradient(to left, black 45%, transparent 100%)`.

**What was tried and rejected** (don't reintroduce): a dense all-over
halftone/hexagon dot texture in vivid orange, a full-bleed opaque
white+orange herringbone, and full-bleed thin diagonal stripes — all of
them covered the *entire* card including behind the text and read as
"busy/unprofessional" regardless of the motif's shape. The lesson: **the
failure mode was full-bleed coverage + high contrast behind copy, not the
specific shape.** Any new texture must (a) stay confined to a strip/corner
that never sits under text, (b) stay under ~15% opacity in a brand tone,
not a saturated hue at full opacity.

Mask-direction gotcha: `linear-gradient(to left, black X%, transparent
100%)` keeps the box opaque for its first `X%` (measured from the *right*
edge, since `to left` points away from there) and only fades out in the
final `100-X%` before the left edge — so a *high* `X` value (e.g. 92%)
paradoxically makes almost the whole box visible, and a low value (e.g.
45%, applied to an already-narrow strip) is what actually confines the
visible portion to a slim sliver near the right edge. Sanity-check which
direction is opaque before shipping a mask tweak.

## Anti-patterns

- Hard, saturated, non-warm hues (blue/purple/teal) as a new default accent.
- Sharp 0–4px corners on cards/hero elements (this isn't the neo-minimalist
  or brutalist system — it's soft/warm/rounded).
- Generic Tailwind default shadows (`shadow-md`, `shadow-xl`) mixed in with
  `shadow-soft*` — pick the house system.
- A third typeface, or body text set in the serif.
- Introducing a JS-heavy mobile carousel when the CSS
  `overflow-x-auto snap-x scrollbar-hide` pattern already covers the need.

## Working process

1. Check `tailwind.config.ts` / `index.css` for the current literal token
   values before writing colors — this file describes the *system*, not a
   frozen snapshot; values may have been tuned since.
2. Reuse an existing component pattern (card, button, carousel) rather than
   inventing a new structure for the same job.
3. New accent colors, textures, or motion only where the user asked for
   something to "stand out" — otherwise stay inside the warm palette above.
