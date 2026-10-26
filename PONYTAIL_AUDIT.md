# Whole-codebase Ponytail audit — October 11, 2026

The audit covered every authored source module, component, stylesheet, script, test, dependency declaration, and application/Firebase/build configuration. Generated Next.js output, vendored packages, imported snapshots, and immutable recordings were checked as inputs, not rewritten. The user explicitly requested applying behavior-preserving refactors, extending Ponytail audit's normal report-only scope.

## Findings applied, ranked

- native: Replace three class-building packages and the one-caller `cn` wrapper with typed class maps and native array joining. All application callers use plain CSS classes without conflicting Tailwind utilities. Keep Radix Slot, forwarded refs, default/null variants, sizes, disabled attributes, and native link semantics. [src/components/ui/button.tsx; removed src/lib/utils.ts; package.json; package-lock.json]
- delete: Remove SHA-256 ID generation immediately overwritten by the source map ID. Assign that same final map ID directly; retain import reconciliation and validation. [scripts/import-map.mjs]
- shrink: Fold approximate-location exclusion into the existing filter, express eligibility as early returns, and calculate stock priority directly. Preserve deduplication order, availability priority, 25-mile price bands, distance, and name sorting. [src/lib/locations.ts]
- delete: Remove the replay-only forwarding function. Pass named restart/retry options to the existing audio operation and calculate the immutable clip URL list once. Keep error handling, stale-element guards, stopping/resetting playback, and explicit user initiation. [src/components/ucannarcan.tsx]

## Deliberately retained

The existing framework route/layout/manifest files are required entry points. Shared Button/Dialog components implement the requested shadcn/Radix behavior. Framer Motion and its accessibility/reduced-motion rules implement the owner's explicit BlockPrep motion requirement. Leaflet projects real coordinates and handles map interaction. Serwist and the verified download layer solve different offline responsibilities: app worker lifecycle versus explicit complete-guide saving, rollback, checksums, reopening, and byte-range audio responses. Firebase and its import/rules scaffolding are requested pending work. XML parsing and image/audio tooling have actual maintenance callers.

No speculative architecture, new dependency, store, factory, generic hook layer, or cosmetic component split was introduced. Medical text, recordings, data snapshots, CSS, animations, geolocation, Firebase behavior, and offline integrity logic remain unchanged. The main component is compact but dense; splitting every section or reformatting the entire repository solely to manufacture a large refactor would add churn rather than remove overengineering.

## Verification

- All 16 existing tests passed before editing and after each refactor batch, without changing their assertions.
- TypeScript check passed. A stricter unused-symbol scan found only unused symbols in generated Next.js validators, with none in authored source; generated files were left alone.
- The production static build passed: guide manifest `d990867b7fb57043`, 120 verified assets. The first sandboxed build hit a Windows directory-creation permission error; the same build succeeded on the native host.
- `.tmp/check-ponytail.ts` compares preserved before/after modules: 480 ranking combinations, including duplicates, approximate/review/unpublished records, unknown costs, unavailable stock, both sorts, all filters, empty datasets, and multiple origins. Every result matched exactly.
- Original and refactored importers ran against the same local KML/HTML fixtures in isolated temporary folders: all 222 records and metadata matched, excluding the expected retrieval timestamp.
- Preview-server full/suffix/open-ended MP3 ranges, invalid range, and HEAD checks passed.
- Production browser regression checks covered locator/provider links and button classes; disabled/enabled quiz completion; three dated Impact metrics and six graph columns; dark/light controls; custom audio play/replay; paused-at-zero step switching; missing-audio text fallback and successful Retry; removal of the audio element on closing. Desktop 1280×720 and mobile 390×844 had no horizontal document overflow.
- Explicit saving completed for the current build. Reopening with simulated network loss retained saved readiness and played the saved recording. Network and viewport testing overrides were restored afterward.
- Settled screenshots: `.impeccable/review/ponytail-desktop-light.jpg`, `ponytail-user-1280-impact.jpg`, `ponytail-mobile-dark.jpg`, and `ponytail-mobile-light.jpg`. These preserve the incumbent visual system; no visual redesign was attempted.
- Independent Impeccable finish review: `ship`, with no material fixes, in `.impeccable/review/PONYTAIL_FINISH_REVIEW.md`. Documenter preserved existing system files and recorded pre-existing documentation drift separately in `.impeccable/review/PONYTAIL_DOCUMENTATION.md`.

This is an overengineering audit and a bounded regression check, not a claim of exhaustive performance optimization or public emergency-use certification. Existing physical-device, clinical, data-verification, and release tasks remain separate.

net: -3 direct runtime dependencies, -1 source file, +20 physical source lines. Readable guard clauses and explicit prop types increase line count; dependency removal and simpler execution paths are the measured simplifications.
