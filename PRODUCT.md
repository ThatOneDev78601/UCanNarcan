# UCanNarcan

<!-- impeccable:product-schema 1 -->

## Platform

web

UCanNarcan is a mobile-first, installable progressive web app. React Native and native iOS/Android interfaces are not part of the confirmed scope.

## Users

Anyone seeking naloxone in Maryland, especially high school students and young adults. Users may be preparing ahead of time, learning overdose response, or looking for help when someone may be overdosing.

## Product Purpose

Help people find nearby naloxone resources and learn how to recognize an opioid overdose and administer Narcan. The locator should make nearby options easy to compare by distance, cost, access, and listed hours. Emergency instructions must be quickly reachable through text and audio.

## Operating Context

- Locator coverage is Maryland-only, confirmed by the user on October 10, 2026. National statistics do not imply nationwide locator coverage.
- Users can type a location or choose device geolocation, then review nearby pickup options and provider details.
- The user approved removing the original Google My Maps view on October 11, 2026. Nearby map is the single embedded interface, using the imported Maryland directory, clickable resource pins, and a selected-location dot. The supplied Google map remains the import source and an external attribution link.
- Educational use includes interactive modules about administration, overdose symptoms, harm reduction, and prevention.
- The map and location search depend on a network connection. Saved emergency text and audio were verified in the production build with simulated network loss. Real-device installation and offline verification remain release tasks.

## Capabilities and Constraints

### Confirmed requirements

- Recommend two or three nearby resources when enough valid locations exist, prioritizing free or low-cost options while accounting for distance.
- Show vending-machine prices and fixed-site hours when verified data is available. Missing information must remain explicit.
- Keep an easily reached emergency-instructions control with both text and audio.
- Include interactive education and dated, sourced U.S. overdose and naloxone statistics.
- Use React and shadcn UI. The existing implementation uses Next.js, Radix primitives, Tailwind, and Framer Motion.
- Use Firebase rather than Supabase. Build the app first; configure Firebase later, as directed by the user.

### Current implementation facts

- Emergency audio has custom themed Play/Pause, time, seek, and mute controls backed by one native audio element. Replay and error recovery remain explicit; opening a step may load metadata, but never starts playback. No playback history or mute preference is stored.
- The owner approved expanded BlockPrep-source motion on October 11: heading/intro entrances on every page, spring lesson entrances and dialog opening, rolling Impact numbers and growing graph bars, plus a sticky connecting emergency step line. Emergency instructions, Call 911, and audio stay immediately usable. Reduced motion presents correct final states; animated metrics expose one stable readable value to assistive technology.
- Dark mode is available from the header theme control. First visits follow the device preference; an explicit choice stays on the device and persists after reopening. Both themes retain BlockPrep typography, shapes, and pastel learning panels.
- The bundled directory contains 222 records from the Maryland ORP map dated October 1, 2026. Data import and reconciliation are in `scripts/import-map.mjs`; records are in `src/data/locations.json`.
- Nearby ranking uses straight-line distance rather than driving time. Approximate locations and a flagged out-of-state source coordinate are excluded from pickup recommendations.
- The source does not supply live inventory or vending-machine prices. Fixed-site free-program labels describe program information, not independently verified stock or access.
- Hours are free text, with many missing values. The app does not currently compute reliable open-now status.
- Nearby map uses Leaflet and OpenStreetMap tiles with the imported directory, a map-projected blue origin dot, device accuracy circle, recenter, and clickable filtered resource pins. Device position is a requested fix, not continuous tracking. Search origins are explicitly labeled as selected places rather than live GPS. The original iframe and map-view switcher have been removed. Failed tiles offer Retry map and the directory remains usable.
- Firebase configuration, administrator editing, and contributor moderation are not yet enabled.
- Address searches use Esri; directions pass coordinates to Google. Nearby map sends tile requests for the viewed area to OpenStreetMap. The app does not save location history or include analytics. Learning progress is stored locally. Offline saving excludes map tiles.

### Open decisions

- Community photo submissions are optional future scope. Service-hour rewards and their approval process are undecided; do not promise them.
- A process and owner for verifying prices, hours, inventory, source-coordinate corrections, and medical content are not established.
- Public release timing and hosting destination remain undecided. Do not claim deployment or clinical certification.

## Brand Commitments

- Preserve the name UCanNarcan.
- The user's BlockPrep project is the binding style and animation reference: https://blockprep.vercel.app and https://github.com/ThatOneDev78601/blockprep.
- Preserve its casual, approachable character while using normal capitalization and punctuation. The user explicitly permits different colors.
- The audience includes younger people, but emergency instructions must remain clear and direct. Style must support comprehension during urgent use.

## Evidence on Hand

- `../UCANNARCAN_ROADMAP.md`: project roadmap and accepted scope.
- `README.md`: current behavior, source interpretation, setup, privacy, and validation limitations.
- `src/data/locations.json`: imported Maryland location snapshot; the supplied map remains the data source.
- `src/data/stats.json` and `src/lib/stats.ts`: CDC national provisional statistics, dated fallback, and refresh logic. Prescription dispensing is distinct from administration or overdose reversals.
- `src/data/content.ts`: emergency and educational text, with CDC, Maryland, and Narcan product-label sources. `public/audio/` contains synthesized narration of emergency text.
- The emergency material has not received independent clinical review. It must not be presented as certified training.
- Emergency audio uses immutable versioned URLs and shared text/narration records. Explicit offline saving verifies the complete shell and all four clips, rechecks readiness after reopening, and preserves previous complete downloads on failure. The private preview uses user-supplied AI recordings (`2026-10-10-human-v1`) with a local automated transcript comparison; prior prototypes remain intact. Human listening, physical-device, and clinical release checks are documented in `EMERGENCY_AUDIO_QA.md`.
- Provider availability, machine pricing, completed service hours, testimonials, and lives-saved claims are not verified evidence.

## Product Principles

1. Make overdose response and emergency-service access easy to reach from the locator.
2. Prefer useful nearby, affordable options without inventing supply, hours, or prices.
3. Preserve source details and show uncertainty and dates so users can judge access.
4. Support both urgent use and preparation through concise text, audio, and interactive learning.
5. Keep the experience approachable for young people while communicating medical instructions clearly.

## Accessibility & Inclusion

The product is intended for anyone, with particular attention to younger users on mobile devices. Emergency guidance must be available in text as well as audio. A specific compliance standard, additional language support, and accommodations beyond the current implementation remain unconfirmed.
