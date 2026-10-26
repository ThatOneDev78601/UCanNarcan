# Emergency audio validation

October 11 custom-control update: the visible native controls have been replaced with themed Play/Pause, elapsed/total time, seek and mute, backed by the same native engine. Replay, retry, paused step changes, and explicit offline saving remain. Current UI/interaction/online and offline checks, including the distinction between a legacy open worker and the current worker, are recorded in `.impeccable/review/CUSTOM_AUDIO_QA.md`. Earlier references to native-player focus/controls below describe historical evidence; release checks now target the custom buttons and native range input.

Scope: Narcan 4 mg nasal-spray text and user-supplied recordings, current private-preview guide version `2026-10-10-human-v1`. The prior `2026-10-10-v1` prototype remains intact. Pricing/live-stock collection is deferred; dark mode, a genuine map location dot, and Firebase setup are separate tasks.

## Automated checks

`npm test`: 16 passing checks, including missing cache entries, reopening readiness from storage, failed updates retaining the previous complete shell and clips, corrupted downloads, interrupted downloads, stale app bundles, uncommitted caches, avoiding duplicate unchanged downloads, offline audio byte ranges, and exact preservation of the four original recordings. `npm run typecheck` and the production static build pass.

## Browser checks

Production export tested in the Codex browser (Chromium). Responsive viewports emulate sizes; they do not emulate Safari or physical phones.

- Replay reset an actively playing recording to the beginning and resumed it after the explicit click.
- Rapid step changes selected the final requested step, paused at zero. Opening/closing during playback removed the audio element; reopening started at step one, paused at zero.
- Finishing the first recording left the guide on step one, with the audio ended and paused. Next remained an explicit action.
- An unavailable clip (network blocking with service-worker bypass) showed the exact recovery error and readable transcript. Restoring access and choosing Retry cleared the error and played the clip.
- A blocked manifest request made Save show a recoverable failure while retaining the verified Saved status for the previous complete download. Network blocking and service-worker bypass were restored afterward.
- Explicit save finished successfully only after all 118 exported assets were verified. A fresh production-page load with simulated network loss detected Saved from cache and played all four clips.
- Native player Space paused audio; Tab skipped the disabled final Next button; Escape closed the guide. Accessible names and live current-step/error/save states were inspected through the accessibility tree. Actual screen-reader output remains pending.

The final configuration disables automatic reload when connectivity returns and forced service-worker activation. Audio is excluded from automatic public-file precaching; offline preparation remains explicit.

Final-build check: switching network availability off and back on during playback kept the dialog and player running. Desktop (1440 × 900), mobile (390 × 844), and the actual preview viewport (840 × 820) were inspected with top/lower viewport captures; mobile has no horizontal overflow. Evidence files are in `.impeccable/review/audio-*`. These screenshots are browser render checks, not physical-device certification.

## Physical-device release checklist (pending)

- iPhone Safari and Android Chrome: first play gesture, native pause/seeking, replay, rapid changes, close during playback, retry after a missing clip or connection failure.
- Installed PWA mode on both: explicit save, airplane-mode restart, all four clips, text immediately visible, cache readiness after OS storage eviction.
- Incoming/outgoing phone-call interruptions: audio stops or pauses, never resumes unexpectedly; Call 911 stays reachable. Test calling with a safe test contact; do not place test emergency calls.
- Keyboard navigation: focus trap, native player controls, replay/retry, Back/Next, numbered steps, Escape and focus restoration.
- VoiceOver and TalkBack: dialog title, Call 911, player name, current step, error announcement, save progress and readiness. No automatic step advancement.
- Slow connections and failed updates: previous complete download continues to work; no forced worker activation during emergency playback.
- Qualified clinical review of both exact transcripts and recordings, including dose, repeat interval, pronunciation, omitted words and breathing instructions.

The four user-generated replacement WAVs have been received and integrated into the private preview as mono 64 kbps MP3s, with original pacing preserved. They run 17.96, 19.64, 18.12, and 18.32 seconds. Local faster-whisper base.en transcription matched the scripts, including four-milligram dose and two-to-three-minute repeat interval; differences were punctuation, capitalization, and equivalent spoken-number formatting. The WAVs stayed on this computer. This automated check does not replace human listening/pronunciation review or qualified clinical sign-off, both pending. The application is not publicly released by this change.

Replacement integration checks: all four versioned MP3s loaded in Chromium with readyState 4, expected durations, and no media errors. Step changes remained paused at zero. The prior download did not mark the replacement version Saved. After explicitly saving the replacement guide, reloading with simulated network loss rechecked Saved readiness and all four new clips played offline without media errors. Network access was restored and the preview left paused at zero. Evidence: `.impeccable/review/human-audio-preview.jpg`. All 16 automated tests, TypeScript, and the production build pass; checksums guard the current MP3/text pairing and unchanged legacy recordings.
