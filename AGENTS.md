# AGENTS.md

## Project mission
Build `unyt.shop` as a world-class premium commerce and utility website for the UNYT ecosystem.

This website must feel like the best marketing team in the world refined it over years. The design language should feel closer to Apple + Stripe + Ramp than to a crypto exchange. The product should feel premium, calm, global, precise, and mobile-first.

## Core brand truths
- `unyt.shop` is the public marketing site.
- `app.unyt.shop` is the authenticated app surface.
- UNYTs are the ecosystem utility balance used across Fintery, Alakai, TechSelec, Unyted.world, Unyted.Chat, Earnrm.com, and future services.
- The UX should default to utility and payments, not speculation.
- Never frame UNYTs as an investment product.
- Avoid hype language such as: moon, alpha, pump, guaranteed, passive income, upside.
- Prefer language such as: balance, utility, spend, pay, access, wallet, supported, transparent, available.

## Product architecture
Public pages:
- `/`
- `/ecosystem`
- `/how-it-works`
- `/security`
- `/faq`

Authenticated app pages:
- `/app/wallet`
- `/app/swap`
- `/app/activity`
- `/app/settings`

## Technical stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion for subtle motion only
- Component-driven architecture
- Clean accessibility defaults
- Server components by default where practical

## Visual direction
- Dark cinematic foundation with warm editorial neutrals
- Minimal, refined, expensive-feeling UI
- Real product UI cards in the hero and feature sections
- No coin illustrations, token explosions, meme graphics, or exchange-chart aesthetics
- Large typography, strong spacing, clear hierarchy
- Premium card radius values and restrained shadows

Suggested palette:
- Obsidian `#0B1020`
- Graphite `#111827`
- Bone `#F7F4EE`
- Cobalt `#4F7CFF`
- Emerald `#12B76A`
- Mist `#98A2B3`

## UX principles
- Mobile quality is non-negotiable
- Primary actions must be obvious and thumb-friendly
- Marketing pages should scroll beautifully on mobile
- Wallet and Swap pages should feel app-like on mobile web
- Add a sticky bottom action bar on mobile where appropriate: Get UNYTs, Pay, Withdraw

## Copy rules
Primary brand line:
- One balance across every product.

Homepage hero:
- Eyebrow: ONE BALANCE. MANY PRODUCTS.
- H1: Spend UNYTs across the entire ecosystem.

Required ecosystem references:
- Fintery
- Alakai
- TechSelec
- Unyted.world
- Unyted.Chat
- Earnrm.com

## Implementation rules
- Prefer reusable components over page-specific one-offs
- Keep code clean, typed, and modular
- Avoid premature abstraction, but do not duplicate obvious section patterns
- Use semantic HTML
- Use accessible heading structure and button/link semantics
- Use alt text intentionally
- Ensure keyboard focus states are visible
- Do not add fake live data APIs
- Use realistic but static UI data unless instructed otherwise

## Asset direction
If images or illustrations are needed, use abstract product/finance motifs or polished UI placeholders. Do not use cliché crypto imagery.

## Done criteria for each task
At the end of each task:
1. Summarize exactly what changed.
2. List files created or modified.
3. Confirm lint/type/build status if available.
4. Mention any placeholders that still need real integrations.

## Preferred commands
When available, use:
- `npm install`
- `npm run lint`
- `npm run typecheck`
- `npm run build`

If a script is missing, add it in the least surprising way.
