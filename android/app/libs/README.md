# Glyph SDK

`glyph-matrix-sdk-2.0.aar` is Nothing's official Glyph Developer Kit, vendored
here so the project builds with no manual setup.

- Source: <https://github.com/Nothing-Developer-Programme/Glyph-Developer-Kit>
  (`sdk/glyph-matrix-sdk-2.0.aar`)
- One AAR covers both SDKs — Nothing: *"Glyph SDK and GlyphMatrix SDK are the
  same. Simply use the single AAR for integration."*

To update, drop a newer `.aar` in this folder; any `*.aar` here is picked up.

## What this build was verified against

Decompiled from the AAR itself, not inferred from docs:

- `Common.is25131()` — Phone (4b) detection
- `Glyph.DEVICE_25131` = `"A009P"`
- `Glyph.DEVICE_25131_SIZE` = **4** (four addressable zones)
- `Glyph.Code_25131.A_1..A_4` = `0, 1, 2, 3`
- `GlyphFrame.Builder.buildChannel(int)`, `buildPeriod(int)`,
  `buildCycles(int)`, `buildInterval(int)`, `build()`
- `GlyphManager.getInstance(Context)`, `init(Callback)`, `register(String)`,
  `openSession()`, `closeSession()`, `toggle(GlyphFrame)`,
  `animate(GlyphFrame)`, `turnOff()`, `unInit()`

`GlyphController.kt` guards every call, so the APK still installs and runs
normally on non-Nothing hardware — the Glyph code simply no-ops there.
