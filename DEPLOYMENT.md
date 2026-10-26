# Vercel deployment — October 11, 2026

Production: https://ucannarcan.vercel.app

Project: `ucannarcan`, under `thatonedev78601s-projects`.

Dashboard: https://vercel.com/thatonedev78601s-projects/ucannarcan

Deployment: `dpl_8WET6H73WryGW6beNdSCtdyaULDk`, reported READY by Vercel.

The remote build installed the locked dependencies, built Next.js 16.4.0 as a static export, and generated the offline-guide manifest. Framework preset Other serves the exported bytes directly; no app server, Firebase configuration, or Git integration was added. `vercel.json` supplies the build/output and PWA cache headers. `.vercelignore` excludes local environment files, credentials, caches, temporary assets and design-review artifacts from source uploads.

## Verification

- Local type checking and all 16 tests passed before deployment.
- Anonymous HTTP verification on the production domain passed: all 118 manifested assets have exactly their published SHA-256 checksums. Build ID: `9934467b734dc46a`; recording version: `2026-10-10-human-v1`.
- The production service worker and manifest respond successfully with their configured cache policy. Versioned MP3 cache headers and byte-range seeking passed.
- Live browser opened the locator and emergency guide and played the first recording with a 17.96-second duration. Text and custom controls remained available.
- Save guide & audio completed on the production domain. After a reload with simulated network loss, the app reopened, verified its saved readiness, and played the saved recording. Network simulation was restored to online and playback stopped before completion. Physical-device offline checks remain pending.
- Live screenshot: `.impeccable/review/vercel-live.jpg`; the HTTPS app remains open in the in-app browser.

## Maintenance and release limits

The remote install reported 13 dependency advisories (5 high, 8 moderate). The follow-up local npm audit traces them to Node gRPC/Firestore dependencies, Firebase Admin's Google Cloud dependency chain, and Sharp's native image libraries. This deployment is static and has no Node request handler, Admin endpoint, or server-side image processing. Firebase remains unconfigured. Dependency updates still need review before enabling Node/Admin workflows; no automatic major upgrade or forced downgrade was applied during deployment. The detailed report is local-only in `.tmp/vercel-dependency-audit.json`.

Independent clinical review, human listening sign-off, real iPhone/Android installed-PWA testing, GPS and phone-call interruptions, and ongoing source verification remain release work. Hosting does not certify emergency-use readiness.

Future deployments from this linked directory:

```sh
npx --yes vercel@latest deploy --prod --scope thatonedev78601s-projects
```

The CLI authenticated through the owner's browser approval. Its project link and local authentication/environment files are not intended for source control. GitHub automatic deployments and custom domains have not been configured.
