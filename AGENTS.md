# AGENTS.md

Project conventions for AI agents and humans editing this codebase.

## Original request
create a sports streaming website

## Goal
Build a dark, immersive sports streaming website with live, schedule, on-demand, category, and watch pages using Next.js 14 App Router and Tailwind CSS.

## Project type
saas-app

## Design system — match this exactly
- Color tokens: `--accent: #E63946`, `--accent-hover: #c62d39`, `--accent-glow: rgba(230, 57, 70, 0.35)`, `--text-primary: #FFFFFF`, `--text-secondary: rgba(255, 255, 255, 0.65)`, `--text-muted: rgba(255, 255, 255, 0.35)`, `--border-subtle: rgba(255, 255, 255, 0.08)`, `--border-accent: rgba(230, 57, 70, 0.4)`, `--glass-border: rgba(255, 255, 255, 0.1)`, `--foreground: 240 10% 3.9%`, `--card: 0 0% 100%`, `--border: 240 5.9% 90%`
- Fonts: Inter, Barlow_Condensed

## Existing components — reuse these, don't create near-duplicates
- Footer (components/Footer.tsx)
- LanguageToggle (components/LanguageToggle.tsx)
- LocaleProvider (components/LocaleProvider.tsx)
- Navbar (components/Navbar.tsx)

## Existing i18n namespaces
Every translation key must be namespaced (`hero.title`, never a bare `title`) so two components never collide on the same catalog slot. Reuse one of these, or pick a new, distinct name:
`auth`, `footer`, `live`, `nav`, `onDemand`, `pricing`, `profile`, `watch`

When editing or adding pages: preserve the design system above, reuse existing components and the shared nav data file, and keep the established structure and tone.
