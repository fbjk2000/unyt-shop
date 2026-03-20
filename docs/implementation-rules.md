# Implementation rules

## Stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion for subtle motion only

## Component guidance
- Build reusable sections: header, footer, hero, ecosystem strip, feature split, FAQ accordion, trust band, app shell, action cards
- Centralize tokens in a theme or constants file where sensible
- Use a small reusable data layer for ecosystem items and FAQ content

## Style guidance
- Large typography
- Strong whitespace
- Clean shadows and borders
- No gimmicky gradients or excessive glassmorphism
- Motion should support clarity, not showmanship

## Accessibility guidance
- Use semantic landmarks
- Respect reduced motion preferences
- Ensure high contrast text
- Keyboard accessible nav and accordions
- Visible focus states

## Performance guidance
- Use optimized images where relevant
- Avoid heavy animation libraries beyond Framer Motion
- Keep the initial homepage load lean

## App shell guidance
Authenticated pages should feel like a premium finance app, not a dashboard template.

## Data guidance
Use static data and mock content unless a real integration is explicitly requested.
