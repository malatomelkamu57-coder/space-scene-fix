# Fix header collisions and complete HUD translations

## Scope
- Keep the existing visual design and HUD controls unchanged while making the top command bar resilient across widths and longer translated labels.
- Complete the six-language coverage for the requested telemetry, map-layer, status, search, planet, and timeline controls.

## Implementation
1. **Rebuild the top command bar as a non-wrapping flex row**
   - Keep the Orbital Intelligence brand in a `shrink-0` section.
   - Give the desktop celestial-body navigation its own `flex-1 min-w-0 overflow-x-auto scrollbar-none` lane with stable spacing, so long translations scroll instead of crossing the brand or controls.
   - Keep mission time, tracked count, search, language, profile, fullscreen, and menu controls in a `shrink-0` right section.
   - Preserve the separate touch-scrollable mobile planet selector and prevent button labels from wrapping.

2. **Expand the translation dictionary for all requested HUD text**
   - Add complete EN, AM, OM, FR, RU, and ZH values for telemetry headings and measurements, map-layer headings and labels, system status terms, search text, timeline state and control labels, and all ten celestial-body names.
   - Include translated accessibility labels for play/pause, timeline scrubbing, search, and relevant header controls.
   - Keep technical constants such as UTC, SGP4, and numeric speed multipliers unchanged, while routing their surrounding labels and states through `t()`.

3. **Wire every requested visible label to `t()`**
   - Update the main dashboard, status strip, and search control to use translation keys rather than hardcoded English.
   - Translate planet names consistently in the top selector, mobile selector, navigation drawer, telemetry card, and body profile heading.

## Verification
- Check the header at mobile, tablet, and desktop widths, including a language with longer labels, confirming no overlap and horizontal body navigation remains usable.
- Switch through all six languages and verify the requested panels and controls update immediately.
- Confirm the preview builds cleanly and reports no runtime errors.
