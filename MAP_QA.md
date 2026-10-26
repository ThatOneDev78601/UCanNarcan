# Location-dot validation

## October 11 — Single map and BlockPrep motion

The user approved removing the original map view. Nearby map now loads immediately; there is no Google iframe or map-view switcher. The external source link remains. This supersedes the two-view behavior recorded below.

- Production Chromium: selecting the public Baltimore, Maryland candidate displayed the origin dot and 210 ranked pins. Vending filtering showed 39 pins, matching the list. Recenter positioned the dot within one pixel of the map center; mobile map/list controls continued to work.
- Failed OpenStreetMap requests displayed a recoverable error. Restoring requests and pressing Retry map loaded tiles and cleared the message without changing views. All network/cache/service-worker test overrides were reset.
- BlockPrep's source template supplies the 4px/250ms/easeOut blur treatment. The user's follow-up additionally requests source-style text/header entrances, spring Impact digits/graphs, stronger lesson openings, and a connecting emergency progress line. These supersede the first pass's restrained text/metric treatment. Filters share a moving selection pill and results reposition. No automatic steps or looping effects are added. Metric animation keeps a single accurate assistive-technology value.
- Desktop 1440×900, mobile 390×844, and the user's 840×820 viewport were inspected together, including light/dark, map, lessons, and emergency guide. No horizontal overflow was detected. The source map is an external attribution link, not a second embedded view.
- Keyboard testing found missing focus restoration on programmatically opened dialogs. The shared dialog now remembers its opener and restores focus on close. Emergency dialogs and their overlay skip entrance motion; Call 911 and the native audio player remain immediately present. Changing steps keeps the next clip paused at zero.
- Reduced-motion testing on reload showed no view blur or lesson transform. A CSS safety override additionally suppresses blur and decorative transforms when the preference changes during the session; progress scaling retains its semantic value.
- TypeScript and all 16 existing tests passed. The production export and verified guide-manifest generation passed; map tiles remain outside offline guide downloads.

Capture paths and the final review verdict are recorded in `.impeccable/review/MOTION_QA.md`. Browser full-page capture timed out, so the review packet uses labeled viewport and scrolled captures. This is not physical-device or clinical certification.

October 10, 2026, private production preview in Chromium. Location testing used the public Baltimore, Maryland search result, not the owner's GPS coordinates.

Continuation check October 11, 2026: the existing production preview remained usable, and recentering placed the geographic origin within one pixel of the map center. Final preview: `.impeccable/review/location-dot-current.jpg`. The Impeccable finish review returned `ship` at the feature scope, and the extension documentation is complete; pre-existing design-note/sidecar drift is recorded without altering the established system.

- Address selection switched from Original Google map to Nearby map and centered the real geographic blue marker. The dot was explicitly labeled as a selected place, not live GPS.
- Arrow-key panning moved the marker with its geographic position; Center on search returned it to the viewport center. Leaflet zoom controls and map resizing are enabled.
- A resource-pin click opened the existing provider details, including hours, contact information, services, and directions. Enter and Space activation also opened details.
- Vending filtering changed map pins from 210 to 39, matching the ranked directory. Original Google map retained the exact supplied map ID and centered iframe URL.
- Clearing the origin removed the dot and restored the Maryland overview; a subsequent address selection restored it.
- Blocking OpenStreetMap tile requests showed the recovery message while keeping the directory and Google-map switch usable. Restoring network access and reopening Nearby map loaded the tiles without the error. Network blocking, HTTP cache override, and service-worker bypass were reset.
- Desktop 1440 × 900, mobile 390 × 844, and the user's 840 × 820 viewport were inspected. No horizontal overflow was detected on mobile or the user's viewport. Attribution remained visible. Screenshots: `.impeccable/review/location-dot-desktop.jpg`, `location-dot-mobile.jpg`, `location-dot-user-840.jpg`.
- TypeScript, all 16 existing tests, and the production build pass. The verified offline-guide manifest includes 120 shell/audio assets; map tiles are excluded from guide downloads and use browser HTTP caching.

Pending physical-device checks: actual GPS permission/denial, device position and accuracy-circle placement, refreshing a moved device, pinch zoom, iPhone Safari/Android Chrome and installed-PWA behavior. Device position is requested explicitly and is not continuously tracked or saved. Map tiles require connectivity. Public-scale tile-provider choice remains release work.
