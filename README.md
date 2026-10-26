# UCanNarcan

Mobile-first Next.js / React PWA using shadcn-style Radix primitives, Tailwind, Framer Motion, and optional Firebase Firestore.

## Run locally

```sh
npm install
npm run dev
```

The development server is at http://127.0.0.1:3000. For the production PWA (including the service worker):

```sh
npm run build
node scripts/serve.mjs
```

The production preview is at http://127.0.0.1:3001. The static export in `out/` can be hosted on Firebase Hosting, Vercel, or another HTTPS static host.

## Vercel deployment

`vercel.json` selects the Other framework preset, installs with `npm ci`, runs the complete `npm run build` script, and serves `out/`. Serving the static export preserves the exact HTML and asset bytes checked by the offline-guide manifest. The service worker revalidates, the guide manifest is not cached, and immutable recordings may be cached for a year. These settings follow [Vercel's project configuration](https://vercel.com/docs/project-configuration/vercel-json).

Deploy from this app directory using the official CLI:

```sh
npx --yes vercel@latest login
npx --yes vercel@latest link --project ucannarcan
npx --yes vercel@latest deploy --prod
```

The local `.vercel/` link and `.env*` files are excluded from version control; `.vercelignore` also excludes local credentials, temporary recordings, audit screenshots, and generated builds from source uploads. A linked Git repository is not required for CLI deployment. Firebase variables can be added in Vercel's project environment settings later, followed by a redeploy; the bundled directory and audio work without them.

After deployment, verify the root page, manifest, service worker, all guide checksums, audio byte ranges, and Save guide & audio on the final HTTPS domain. Browser downloads belong to that domain; localhost downloads do not transfer. Hosting the app does not complete the clinical or physical-device release checks described below.

## Implemented

- Light/dark mode with a header toggle, device preference on first visit, and a locally saved explicit choice. Theme is applied before paint and carries through locator, learning, statistics, and dialogs.
The interface follows the BlockPrep app source: heavy Inter typography, a light gray ground, black and white rounded surfaces, pill controls, a mobile navigation dock, and spring selection transitions. Impeccable is required for future UI work; see `AGENTS.md` and `DESIGN.md`.

- A single Nearby map with the imported directory's resource pins, a real blue selected-location dot, device accuracy circle, and recenter control. The original iframe and map-view switcher were removed at the user's request; the source map remains an external attribution link.
- BlockPrep-source motion using the existing Framer Motion dependency: blur-to-clear navigation, spring/fade headings and introductory text on every page, shared filter selection, result reordering, lesson entrances/feedback/progress, spring lesson-dialog openings, Impact's rolling digit strips and graph growth, and theme/show-more indicators. Emergency help opens immediately; a connecting line animates the selected step without delaying text/audio. Reduced motion shows final states directly, including accurate metric values.
- 222 source records from the October 1, 2026 Maryland ORP map. Coordinates are reconciled against source row IDs because the KML export omits them.
- Address/city/ZIP geocoding through Esri's public geocoding endpoint, explicit candidate choice, optional device geolocation, and straight-line distance ranking.
- Location details, contacts, listed hours, services, website links, and Google Maps directions.
- Filters for free programs, vending machines, and fixed sites; price preference within local distance bands.
- Emergency text plus four generated, downloadable audio clips; three interactive learning scenarios with local progress.
- National CDC provisional death statistics refreshed on load, with a bundled fallback and transparent dates/definitions.
- Install manifest, locally bundled fonts, icons, Serwist service worker, and explicit offline guide/audio saving.
- Firebase read adapter, security rules, environment template, and an Admin SDK import script for later setup.

## Data interpretation and limitations

The exact map: https://www.google.com/maps/d/embed?mid=1Oc8m4uYRvpJmIKdtG-73GUFLcTQuPmpa&ehbc=2E312F

Nearby map uses Leaflet 1.9.4 and OpenStreetMap tiles to render a real geographic dot alongside the reconciled directory pins. It is the only in-app map; the Google source is linked for attribution. Device location is a requested position fix, not continuous tracking; select Use my location again to refresh it. Address-search dots identify the selected place, not live GPS. Center on me/search returns to the origin after panning. Pins match directory filters and open the existing provider detail panel. Failed tiles offer Retry map; provider details remain available through the list. No source-map changes are written.

OpenStreetMap tiles are online-only, carry visible attribution, and use browser HTTP caching. The service worker passes tile requests through rather than storing them in the offline guide. See the [tile policy](https://operations.osmfoundation.org/policies/tiles/); no offline tile downloads or prefetch are provided. Before public-scale launch, choose a tile provider appropriate to expected traffic and reliability needs.

The source includes 171 fixed sites, 40 vending machines, and 11 approximate locations. Approximate sites are available for browsing but excluded from nearest pickup recommendations. One source point (Somerset County Health Department, 8928 Sign Post Road) is plotted outside Maryland and excluded from recommendations. No correction has been written to the source map. This imported snapshot does not imply a live, field-for-field parity audit of the external source.

The map provides hours for 84 records, but does not provide machine prices or live stock. Fixed-site free-program labels refer to Maryland's ORP offering, not independently verified inventory or unrestricted access. Machine prices remain unknown. Free-program filtering does not guess machine prices. Hours are displayed as supplied; this version does not claim a reliable “open now” calculation from varied free-text schedules. Confirm hours and access with each provider.

Public program information: https://stopoverdose.maryland.gov/naloxone/

## Firebase later

1. Create/register a Firebase web app and copy `.env.example` to `.env.local`.
2. Populate the public web configuration. Never place a service-account private key in these variables or source control.
3. Enable Firestore and deploy `firestore.rules`. Public clients may read only published locations. Writes require an authenticated administrator with the `admin` custom claim; all other collections default to denied.
4. Use Application Default Credentials for an authorized administrator, set `FIREBASE_PROJECT_ID`, and run `npm run seed:firebase`.
5. Rebuild. Without configuration, or if a read fails, the bundled directory remains available. For this modest dataset the adapter reads published records once; use geohash queries and server-side validation as geographic coverage grows.

An administrator editing UI, contributor submissions, moderation, and service-hour approval are not implemented in this first version. Do not enable anonymous Firestore writes.

## Refresh data

`npm run import:map` downloads the public KML and rendered-map data, checks IDs/counts, and writes `src/data/locations.json`. Its map-data parser deliberately fails on structural changes; inspect and reconcile rather than publishing bad coordinates. The source date is explicitly pinned to the currently reviewed map edition and needs review when the map changes. `--local` uses the downloaded development files in the parent directory.

`npm run refresh:stats` updates `src/data/stats.json`. Failed fetches/validation retain the prior file. Deploy/rebuild after changing snapshots. The browser also checks the CDC public endpoint on each app load. The annual prescription-dispensing figure is separately sourced from CDC (2024; reviewed August 11, 2026) and requires editorial updating; it excludes OTC sales and does not represent administrations/reversals.

## Offline and privacy

Service workers run in the production build over HTTPS or localhost. Open the guide online and choose **Save guide & audio**. The build generates `out/offline-guide.json`, with SHA-256 checksums for the exported HTML, bundled JavaScript/CSS/fonts, install assets, and four versioned MP3s (about 3.8 MB total). Saving downloads into a separate cache and commits only after every asset passes its checksum and all required entries are present. A failed update deletes only its incomplete download, preserving previous complete guides. Readiness is rechecked on load, guide opening, and returning to the app; missing or evicted assets remove the Saved status. An old bundle does not qualify a new app shell as saved. Updates never activate forcibly, and saving is disabled during audio playback.

Offline navigation falls back to a complete downloaded guide and its matching shell. Audio byte ranges support seeking from cached MP3s. Each guide version has immutable clip URLs and matching narration in `src/data/content.ts`. Initial installation requires a connection; browser eviction/cleared storage can remove downloaded content. The embedded map, address search, and refreshed stats require connectivity. Offline directory data is a dated snapshot.

The themed audio controls use one native audio element: Play/Pause, elapsed and total time, a keyboard-accessible seek bar, mute, and explicit **Replay step** and **Retry audio** controls. Steps start paused; opening one may preload metadata but never starts playback. Step changes and closing stop playback; completion never advances the guide. Text remains visible through loading, playback failure, and download errors. No microphone, account, Firebase connection, or runtime AI service is required. See `AUDIO_RECORDINGS.md` for the exact four scripts and replacement process; `npm run audio:scripts` regenerates scripts from displayed text. The current private preview uses the user's recordings under `2026-10-10-human-v1`, converted to mono 64 kbps MP3 without changing delivery. Original prototype recordings and legacy URLs remain unchanged for older app builds. Choose Save again to download the new guide version; the old complete download is retained. Candidate generation writes to `.tmp/audio-candidates`, never directly to the app's versioned clips.

Precise coordinates and addresses are not saved in app storage or analytics. Coordinates are passed to Google when opening directions; address searches go to Esri. Nearby map requests OpenStreetMap tiles for the viewed area. Learning progress is local to the device. No analytics are included. External providers have their own data practices.

## Medical content and launch readiness

Text is based on CDC overdose-response guidance and Narcan 4 mg product labeling, retrieved October 10, 2026. The current audio comes from four user-supplied AI-generated WAVs, encoded with FFmpeg. Local Whisper transcription was compared with all four scripts, including dose, emergency number, and repeat interval; this does not certify pronunciation, human listening review, or clinical approval. Recording provenance and checksums are in `public/audio/2026-10-10-human-v1/recordings.json`. Obtain qualified review and real-device/offline testing before a public emergency-use launch. This private working version does not claim certified training or guaranteed supply.

Sources are linked in the app. Education is not a substitute for calling emergency services. Exact instructions must match the product being administered.

## Checks

```sh
npm run typecheck
npm test
npm run build
```

Tests cover source reconciliation, distance, filters, unavailable stock, price ordering, missing results, unsafe URLs, national statistics, complete-cache verification, failed/corrupt downloads, update rollback, stale shell rejection, missing clips, offline byte ranges, and retained recording/text identity. Browser checks and outstanding device tests are recorded in `EMERGENCY_AUDIO_QA.md`. Real iPhone Safari and Android Chrome, installed PWA mode, actual phone-call interruptions, VoiceOver/TalkBack, and qualified clinical review remain release requirements.
