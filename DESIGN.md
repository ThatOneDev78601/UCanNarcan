---
name: UCanNarcan
description: BlockPrep-inspired Maryland naloxone locator and emergency guide.
colors:
  ink: "#080808"
  paper: "#f4f4f4"
  white: "#ffffff"
  muted: "#585858"
  line: "#dedede"
  lilac: "#c7cffb"
  mint: "#b6d7c1"
  peach: "#f0c5b2"
  danger: "#a32924"
  focus: "#4c5ac5"
  primary-hover: "#292929"
  nav-ground: "#e7e7e7"
  control-ground: "#e4e4e4"
  control-hover: "#d7d7d7"
  fixed-site-ground: "#dfeee4"
  fixed-site-ink: "#254731"
  vending-ground: "#e7eafb"
  vending-ink: "#394478"
  success-ground: "#dcebe0"
  success-border: "#35764b"
  error-ground: "#f2dfda"
  warning-ground: "#f5e7c4"
  warning-ink: "#63511d"
  dock-help-ground: "#f0bfb9"
  dock-help-ink: "#781e1a"
typography:
  display:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "clamp(42px, 4.4vw, 64px)"
    fontWeight: 900
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  display-secondary:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "clamp(42px, 5vw, 72px)"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "36px"
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "21px"
    fontWeight: 900
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 800
  button:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 800
    lineHeight: 1.2
rounded:
  tag: "8px"
  control: "12px"
  field: "14px"
  input: "16px"
  dock-item: "20px"
  card: "24px"
  panel-mobile: "28px"
  panel: "32px"
  pill: "100px"
spacing:
  compact: "8px"
  control-gap: "10px"
  small: "12px"
  grid: "16px"
  section-gap: "20px"
  card: "24px"
  panel-mobile: "28px"
  panel: "30px"
  roomy: "32px"
  dialog: "38px"
  section: "48px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "13px 22px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "13px 22px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "13px 22px"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "13px 22px"
  input-location:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.input}"
    padding: "7px 7px 7px 14px"
  navigation-desktop:
    backgroundColor: "{colors.nav-ground}"
    rounded: "{rounded.pill}"
    padding: "5px"
  filter-chip:
    backgroundColor: "{colors.control-ground}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "11px 17px"
  filter-chip-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
  card-location:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "{spacing.card}"
  emergency-header:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "10px 18px 10px 10px"
  navigation-mobile:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.panel}"
    padding: "9px 12px"
    width: "min(344px, calc(100vw - 32px))"
---

# Design System: UCanNarcan

## Overview

**Creative North Star: "BlockPrep's approachable app grammar"**

This is the implemented, user-pinned BlockPrep app-source world: strong Inter headings, a quiet neutral ground, generous rounded panels, pill controls, and a compact floating mobile dock. Normal capitalization and punctuation keep its casual character readable. The approved periwinkle, mint, and peach accents support learning and preparation; emergency controls carry a distinct red treatment.

This record is extracted from `src/app/globals.css`, `src/components/ucannarcan.tsx`, the shared button/dialog components, and the locally loaded Inter weights in `src/app/layout.tsx`. The approved surface contract lives in `.impeccable/surfaces/src-components-ucannarcan-tsx.md`; its user-pinned override seed is `4bc63bdb`. Authority is implemented code and the pinned app source, with no approved image comp.

**Key Characteristics:**

- Black and white surfaces on a soft gray ground.
- Inter 900 headings with tight tracking and normal capitalization.
- Large rounded panels, smaller rounded fields, and pill controls.
- Shared spring selection, BlockPrep text entrances, rolling metrics, and bounded lesson/graph movement.
- Sticky desktop emergency access and a labeled mobile Overdose action.

## Colors

The palette pairs near-black structure with soft supportive color blocks; semantic emergency and feedback colors remain distinct.

### Primary

- **Ink:** Main text, dark finder panels, selected navigation, primary buttons, and the latest chart bar.
- **Periwinkle:** The source calls this token lilac; it colors the learning banner, one lesson card, location-search submit control, selection, and earlier chart bars. The existing lime custom property is an alias with the same value, not an additional palette color.
- **Emergency red:** Emergency header control, Call 911, danger buttons, and incorrect-answer borders.

### Secondary

- **Mint:** A lesson card, a statistics card, and the finder support icon.
- **Peach:** A lesson card. It is a supportive surface accent, not an emergency state.

### Neutral

- **Paper and white:** Paper is the app ground and dialog surface; white holds location cards, inputs, map chrome, and information panels.
- **Muted and line:** Secondary text and structural dividers. Dark panels use lighter secondary text already defined in the stylesheet.
- **Navigation and control grays:** Neutral pill tracks and unselected filters; selected controls turn ink with white text.
- **Focus periwinkle:** Keyboard outlines and input carets, distinct from the pale accent surface.
- **Semantic badge and feedback pairs:** Fixed-site and vending badge fills each have a darker matching ink. Success and error fills accompany their answer borders; warning fill and ink identify notices. The dock help pair keeps its circular emergency icon distinct on ink.

### Named Rules

**The Semantic Color Rule.** Preserve separate emergency, feedback, fixed-site, and vending roles; pale lesson accents do not communicate urgency or verified availability.

## Typography

**Display Font:** Inter with Arial and sans-serif fallbacks.  
**Body Font:** The same locally loaded Inter family, using weights 400 through 900.

**Character:** Heavy, tightly tracked display type carries the friendly confidence of the reference. Body copy and controls use familiar sentence case, with lighter secondary copy and bold action labels.

### Hierarchy

- **Display:** Locator heading uses the display token; at the mobile breakpoint it becomes 40px with a 1.02 line height, then 36px at the narrow breakpoint.
- **Secondary display:** Learning and impact headings use the display-secondary token; on mobile they become 45px.
- **Headline:** Main section headings use the headline token; mobile sections become 31px. Finder headings use 38px/1.05, then 32px and 29px.
- **Title:** Location names use the title token, 19px at the intermediate breakpoint and 22px on mobile.
- **Body:** Ordinary addresses and supporting copy use the body role. Introductory copy uses 15–16px; page introductions and learning-footer copy are limited to 65ch. Emergency instructions use 16px/1.75.
- **Label:** Navigation and field labels use the label role; metadata commonly uses 12px. Buttons use the separate button role. Distances and statistics use tabular numerals.

### Named Rules

**The Normal Capitalization Rule.** Preserve the user-approved normal capitalization and punctuation in headings, navigation, actions, and instructional copy.

## Layout

The centered shell has a maximum width of 1380px and desktop gutters of 48px. The sticky header is 96px high; its brand, navigation, emergency control, and install control share the top row. The locator uses two columns, `minmax(320px, .88fr) minmax(0, 1.8fr)`, with a 20px gap. Location, lesson, and statistics grids use three equal columns with 16px gaps.

At 1080px and below, gutters become 28px, the header wraps, navigation occupies a full second row, finder padding becomes 26px, and the locator columns narrow. At 760px and below, gutters become 20px, the header is 76px, desktop navigation and the emergency header button hide, and the locator and card grids become single-column. The floating dock takes over navigation and emergency access. A 240px pill switch controls map visibility. At 370px and below, gutters become 16px.

Section spacing is commonly 48px on desktop and 36px on mobile. The mobile footer leaves 150px of bottom space for the dock. The dock sits 16px plus the safe-area inset above the viewport bottom and stays centered. Dialogs cap at 620px, keep viewport clearance, and scroll internally; mobile dialogs use 10px side clearance and a maximum height of the viewport minus 24px.

## Elevation & Depth

Most panels are flat: contrast between paper, white, ink, and accent fills supplies depth. Floating emergency/dock controls and dialogs receive soft ambient shadows, never a hard offset shadow.

### Shadow Vocabulary

- **Floating control:** `var(--elevation)`, defined as `0 12px 36px rgb(0 0 0 / 12%)`, used by the header emergency control and mobile dock.
- **Dialog:** `0 24px 80px #0004`, paired with a `#000b` full-viewport overlay.

### Named Rules

**The Flat Panel Rule.** Keep content panels flat; reserve the observed ambient shadows for floating controls and modal elevation.

## Shapes

The form language is rounded and solid. Work panels, lessons, statistics, banners, and desktop dialogs use the panel radius; location cards use the card radius. Mobile work panels and dialogs use the panel-mobile radius. Fields use input or field radii, service tags use the tag radius, and navigation/action controls use the pill radius. Icon containers use the control radius; emergency icons and numbered steps are circular.

Buttons have a 2px transparent base border, with ink borders on outline variants. Most cards have no border. Dividers use a single line-color stroke. Preserve clipped map corners rather than placing an unrounded iframe over its panel.

## Components

### Page entrances

Find, Learn, and Impact share the BlockPrep heading entrance: travel from 20px above with opacity rising to 1. Supporting introductions and the learning summary travel from 12px below with an 80ms delay. Both use the source spring (stiffness 100, damping 18, mass 1.5), with opacity resolving over 250ms. Screen changes resolve 4px blur to zero over 250ms with easeOut; the first screen skips this blur. Content changes immediately, without an exit wait. Header emergency access and the mobile dock remain outside the page transition.

### Theme control

A 44px circular Moon/Sun control in the sticky header switches light and dark themes. Its accessible name describes the next action. Dark mode uses a #141414 canvas, #242424 content surfaces, #343434 neutral controls, #f4f4f4 primary text, and #b7b7b7 secondary text. Finder and mobile dock remain black; pastel learning/statistics panels retain dark text. Focus uses #aebaff. Emergency dialogs and custom audio controls follow the selected theme. On mobile, the install action uses a 44px icon button with its existing accessible name to leave room for the theme control.

### Buttons

Confident pill controls use bold labels and optional inline SVG icons. Primary, outline, ghost, and danger variants are defined in the shared button primitive. Default buttons have a 48px minimum height; small buttons use 44px, 13px type, and 10px 17px padding. Hover scales to 1.025 and press to 0.97 through a 180ms transition. Primary hover turns primary-hover; outline hover turns nav-ground. Disabled buttons use 0.5 opacity and a not-allowed cursor.

Keyboard focus is a 3px focus-color outline with a 4px offset. This also applies to links, fields, select controls, and the audio player's buttons and seek input.

### Chips

Filters use neutral control-ground pills, bold labels, and a 44px minimum height. Hover uses control-hover; selection uses ink and white plus a check icon. They wrap across lines. Service tags in details use a smaller rounded rectangular silhouette rather than a pill.

### Cards / Containers

Location cards are white, flat, and padded with the card spacing token. Fixed-site icon badges use fixed-site-ground and fixed-site-ink; vending badges use vending-ground and vending-ink. The source class for ordinary sites is `fixed-site`; do not rename it to the unrelated filter value `fixed`. Price text, distance, type, name, address, hours, and actions remain visually distinct.

Lesson cards and statistics panels use larger rounded accent or ink surfaces. Result cards settle from 12px down with a spring of stiffness 300 and damping 28; the first three stagger by 40ms, capped at 80ms. This is a result-state treatment, not an emergency-guide entrance effect.

Lesson cards enter from 24px below at scale 0.97, using the shared learning spring (stiffness 100, damping 18, mass 1.5) and an 80ms card stagger, capped at 160ms for the three lessons. Hover scales to 1.02 and press to 0.95 with the same spring. Learning completion progress scales from the left to the completed fraction with that spring. Impact panels settle from 20px below with the same spring.

### Impact metrics and graph

Digits roll through a 30-row strip containing three cycles of 0–9, settling at row `20 + digit`. Each character position adds 150ms delay to the shared learning spring (stiffness 100, damping 18, mass 1.5); punctuation and suffixes stay static and occupy their normal positions. Each metric begins once at 20% visibility. One unchanged screen-reader value accompanies the decorative, aria-hidden digit strips.

Graph bars grow from the bottom with scaleY 0 to 1 when 15% of the chart enters view, once per mount. They use the same spring with 80ms delay per bar. Their final height remains the real count divided by the series maximum, multiplied by 130px. The accessible graph description preserves every count and period; motion does not change the data or dated source labels.

### Inputs / Fields

The location field is a white rounded wrapper on ink, with a 40px input and a 42px periwinkle submit button. The input uses 15px type on desktop and 16px on mobile. Directory search uses a white field with 14px corners and 16px horizontal padding, reaching 16px input type on mobile. Placeholder text stays visible at full opacity. Native select controls use neutral gray fill, 12px corners, and a 44px minimum height.

### Navigation

Desktop navigation is a gray pill track with a moving ink selection capsule and white active text. Its shared-layout selection uses a spring of stiffness 420 and damping 34. The mobile dock is an ink panel with icon-plus-label buttons, a translucent active selection, and the same spring. Labels are Find, Learn, Overdose, and Impact; the Overdose action has a warm red circular icon and a visible text label.

### Emergency Access and Dialogs

Desktop emergency access is in the sticky header and reads Overdose help. Mobile access stays in the floating dock. The emergency dialog and overlay open immediately; the red Call 911 pill leads the guide, with numbered step controls, text instructions, and custom themed controls backed by native audio. The close control is a 44px circle. The connecting step track is 4px high between the circle centers; its fill scales from the left to the zero-based selected step divided by 3, with stiffness 300 and damping 28. The step bar stays sticky at the top of the scrolling dialog. Clinical text, Call 911, step controls, and audio update immediately; only the decorative line springs to the selected state. There is no automatic step progression.

Other dialogs resolve 4px blur over 250ms with easeOut. Lesson dialogs additionally enter from scale 0.96 and 24px below with the shared learning spring (stiffness 100, damping 18, mass 1.5), 200ms opacity, and 250ms easeOut blur. Their centering translation is preserved throughout. Non-emergency overlays retain the 150ms opacity fade. Dialogs remember the active opener and restore focus to it on close when it is still connected.

Respect the user's reduced-motion preference: Framer Motion uses user reduction and explicit zero-duration changes; CSS animation/transition durations collapse to 0.01ms, scrolling becomes immediate, and decorative hover/press transforms are removed. Headings, copy, cards, digits, graph bars, and step progress display their correct final state immediately, including a live preference change. Dialogs retain their centered geometry with no blur. No entrance or progress animation loops.

## Do's and Don'ts

### Do:

- **Do** preserve the pinned BlockPrep app-source typography, rounded geometry, neutral ground, and spring selection behavior.
- **Do** use normal capitalization and punctuation.
- **Do** keep emergency access visible in the sticky desktop header and the labeled mobile dock.
- **Do** use the existing semantic colors for emergency, feedback, and resource types.
- **Do** preserve visible keyboard focus and reduced-motion behavior.
- **Do** keep emergency instructions, Call 911, and audio controls immediate while the decorative step line moves.

### Don't:

- **Don't** promote uppercase kickers or eyebrows into this system.
- **Don't** add hard offset shadows to flat content panels.
- **Don't** replace the visible Overdose dock label with an icon alone.
- **Don't** use supportive accent colors to imply availability or medical verification.

The conditional uppercase “CHOOSE YOUR LOCATION” eyebrow remains a build defect, not a canonical type or component rule. This documentation does not repair UI or product behavior.

