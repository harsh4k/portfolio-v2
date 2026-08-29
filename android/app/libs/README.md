# Glyph SDK goes here

This directory must contain the Nothing Glyph Developer Kit `.aar` before the
app will build. It is deliberately **not** vendored into this repo — it is
Nothing's binary, and pinning a copy here would go stale.

1. Open <https://github.com/Nothing-Developer-Programme/Glyph-Developer-Kit>
2. Download the SDK `.aar` from the repository (Nothing ships a single AAR —
   their README states *"Glyph SDK and GlyphMatrix SDK are the same. Simply use
   the single AAR for integration."*)
3. Drop it in this folder. Any `*.aar` here is picked up automatically.

`GlyphController.kt` guards every call, so the built APK still installs and runs
normally on non-Nothing hardware — the Glyph code simply no-ops there.
