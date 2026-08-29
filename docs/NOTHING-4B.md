# Portfolio on Nothing Phone (4b)

What is actually possible, what isn't, and exactly what to do on the phone.

Every Nothing-specific claim here was checked against the official Glyph
Developer Kit, Nothing OS documentation, or device reviews. Where something
could not be verified, it says so rather than guessing.

---

## 1. The short answer on the lock screen

**You cannot put a website — or any third-party app — directly on the Nothing OS
lock screen.** Two independent limits, both real:

1. **Nothing OS lock-screen shortcuts are a closed list.** The bottom-left and
   bottom-right slots accept only built-in system actions: camera, torch, Do Not
   Disturb, QR scanner, device controls, mute, video camera. There is no API to
   register a third-party app for those slots.

2. **Android never opens web content over a secured lock screen.** Launching a
   browser or web view always forces an unlock first. This is a platform
   security invariant — not a Nothing restriction, and not something any app or
   trick can bypass. Anything advertising otherwise is either abusing
   `showWhenLocked` (wrong and unsafe for arbitrary web content) or lying.

So `LOCK SCREEN -> ONE TAP -> WEBSITE` with no unlock is **not achievable**. The
closest real options, ranked:

| Route | From a locked phone | Built? |
|---|---|---|
| **Quick Settings tile** | swipe down, tap, unlock | yes |
| Home-screen icon (PWA/APK) | unlock, tap | yes |
| Home-screen widget, deep-linked | unlock, tap | yes |
| Launcher long-press shortcut | unlock, long-press, tap | yes |

**The Quick Settings tile is the fastest path and is what you should use.**

---

## 2. What Android permits

- **Quick Settings tiles** (`TileService`) — usable from the lock screen shade.
  Tapping one that opens an activity triggers the unlock prompt first.
- **App widgets** (`AppWidgetProvider`) — home screen, guaranteed.
- **App shortcuts** — long-press the launcher icon.
- **Notifications** — visible on the lock screen; tapping requires unlock.
- **Lock-screen widgets** — reintroduced in Android 15 QPR1 / 16 QPR1-2 and
  extended to third-party widgets on Pixel/AOSP. **OEM skins vary**, see below.
- **TWA (Trusted Web Activity)** — renders the live site in Chrome with zero
  browser UI, provided Digital Asset Links verification passes.

## 3. What Nothing OS permits

- **Nothing OS 4.1 (Android 16)** on the (4b) has lock-screen widgets.
- **Whether third-party widgets are allowed there is unverified.** No official
  Nothing source confirms it, and Nothing has historically restricted that
  surface to its own widget set. The widget in this repo is a standard
  `AppWidgetProvider`: if Nothing OS allows third-party widgets on the lock
  screen it will appear in the picker with no extra work; if not, it stays a
  home-screen widget. **Check it yourself in 30 seconds — step E below.**
  (The legacy `android:widgetCategory="keyguard"` flag is from Android 4.2-4.4
  and was removed in 5.0. It grants nothing on modern Android, so this project
  does not rely on it.)
- **Glyph is supported on the (4b)** — details below.

## 4. Glyph on the (4b) — what is real

GSMArena lists only "Notification LED (on the back)", which is **incomplete**.
The (4b) has a *Glyph Bar* (45 mini-LEDs across five segments), and the official
Glyph Developer Kit names the device explicitly.

**Available:**

| Capability | Status |
|---|---|
| Device identifier | yes — `Common.is25131()` / `Glyph.DEVICE_25131` |
| Addressable zones | yes — **4**: channels `A1`-`A4`, int indices `0`-`3` |
| On/off per zone | yes — `toggle(GlyphFrame)` |
| Breathing animation | yes — `animate(GlyphFrame)` with `buildPeriod` / `buildCycles` / `buildInterval` |
| API key | **Not needed.** Nothing: *"The API key restriction has been removed starting from Android B (Android 16)."* The (4b) ships Android 16. |

**Not available:**

| Capability | Status |
|---|---|
| Progress display | no — `displayProgress()` is a C1/D1 channel feature; the (4b) has neither |
| Per-LED control | no — only the 4 zones are addressable, not the 45 individual LEDs |
| Per-zone brightness | no — not exposed by the GDK |
| **Background / ambient use** | no — **"Only foreground applications are allowed to be used."** |
| Glyph Matrix effects | no — the Matrix SDK covers only Phone (3) and (4a) Pro |

**The foreground-only rule is the important one.** A third-party app cannot use
the Glyph as an ambient notification light. This app therefore fires a short
breathing sweep across A1-A4 **on launch**, and nothing else. That is the honest
ceiling of what is possible, not a limitation of this implementation.

---

## 5. Steps to perform on your phone

### A. Install the PWA (no APK needed — do this first)

1. Open `https://harshh.pages.dev` in **Chrome**.
2. Menu -> **Add to Home screen** / **Install app**.
3. Confirm. The icon appears on your home screen.
4. Open it — it launches full-screen with **no address bar**.

Long-pressing the icon gives shortcuts straight to Overview / Websites / Fun
Code / Posters.

### B. Build and sideload the APK (adds tile, widget, Glyph)

You need Android Studio and a JDK 17.

1. **Get the Glyph SDK.** Download the `.aar` from
   <https://github.com/Nothing-Developer-Programme/Glyph-Developer-Kit> into
   `android/app/libs/`. The build fails with a clear message if it's missing.
   (Nothing ships one AAR for both Glyph and Glyph Matrix.)

2. **Create a signing key:**

   ```bash
   keytool -genkey -v -keystore release.keystore \
     -alias portfolio -keyalg RSA -keysize 2048 -validity 10000
   ```

   Then create `android/keystore.properties` (already git-ignored):

   ```properties
   storeFile=release.keystore
   storePassword=...
   keyAlias=portfolio
   keyPassword=...
   ```

3. **Get the fingerprint:**

   ```bash
   keytool -list -v -keystore release.keystore -alias portfolio | grep SHA256
   ```

4. **Publish it.** Paste that SHA-256 into
   `public/.well-known/assetlinks.json`, replacing the placeholder, then deploy.
   Verify it is live:

   ```bash
   curl https://harshh.pages.dev/.well-known/assetlinks.json
   ```

   **This step is not optional.** If the fingerprint is missing or wrong, the
   TWA silently falls back to a Custom Tab **with a visible URL bar** — the exact
   browser chrome we are trying to remove.

5. **Build and install:**

   ```bash
   cd android
   ./gradlew assembleRelease
   adb install -r app/build/outputs/apk/release/app-release.apk
   ```

### C. Add the Quick Settings tile — the lock-screen route

1. Swipe down twice, then tap the edit (pencil) icon.
2. Find **Portfolio** in the inactive tiles.
3. Drag it into the **first four positions** so it is visible without scrolling.
4. Test: lock the phone, swipe down, tap the tile, unlock — the site opens.

### D. Add the widget

1. Long-press the home screen -> **Widgets** -> **Harshit**.
2. Drag the 4x1 widget out. Three chips deep-link to Overview / Websites /
   Posters; tapping the body opens the intro.

### E. Check the lock-screen widget question

Long-press the lock screen -> **Customise** -> **Widgets**. If a third-party
section or an app list appears, Nothing OS 4.1 allows it and the Harshit widget
should be selectable. If only Nothing's own widgets are offered, it does not —
use the Quick Settings tile instead.

---

## 6. Permissions

| Permission | Why | Prompt? |
|---|---|---|
| `com.nothing.ketchum.permission.ENABLE` | Glyph control | No — install-time, Nothing devices only |
| `BIND_QUICK_SETTINGS_TILE` | Declared *by* the tile service so only the system can bind it | No |
| (none for internet) | The TWA delegates rendering to Chrome | — |

No runtime permission prompts. No notification permission (no notifications are
posted). No location, camera, or storage access.

---

## 7. Offline behaviour

The site is a full PWA and works with no network:

- **Precached (~1.1 MB):** all HTML/JS/CSS, every route chunk, all three fonts,
  all icons. Every route renders offline, including cold deep links.
- **Runtime-cached:** photos under `/images/*.webp` and `resume.pdf`, cached the
  first time you view them.
- **Not cached:** `lbt_vid.mp4` (1.4 MB) — ranged media through a service worker
  is unreliable and it is `preload="none"` anyway.
- **GitHub contributions:** network-first with a 7-day cache, plus a
  last-known-good copy in `localStorage`. Offline it shows the cached grid, or
  an empty grid labelled *"offline, may be out of date"* — never a raw error.

**Known limitation:** a page whose images you have never opened will show broken
images offline. Precaching all ~2.4 MB of photography would roughly triple the
install size, so it is deliberately traded away.

---

## 8. Limitations, stated plainly

1. **No direct lock-screen placement.** Section 1. Not solvable.
2. **Unlock is always required** before web content is shown. Platform-level.
3. **Glyph is foreground-only** — it cannot be an ambient notification light.
4. **Glyph is 4 zones**, not 45 LEDs, and has no brightness control.
5. **The website cannot trigger Glyph.** A TWA has no JavaScript-to-native
   bridge. Glyph is driven by the native shell (launch), by design. Web-driven
   Glyph would require replacing the TWA with a WebView, which is a materially
   worse browser and loses PWA semantics — not worth it.
6. **Lock-screen widget support on Nothing OS 4.1 is unverified.** Section 3.
7. **Digital Asset Links is a hard dependency** for the chrome-less experience.
8. **Nothing OS may background-kill sideloaded apps.** If the tile feels slow,
   exempt the app under Settings -> Apps -> Harshit -> Battery -> Unrestricted.
9. **The Android project has not been compile-verified** — no Android SDK was
   available in the environment where it was written. All XML is validated and
   versions are pinned to a checked-compatible set (AGP 8.9.1 + Gradle 8.11.1 +
   compileSdk 36 + JDK 17), but expect to resolve minor issues on first build in
   Android Studio. `GlyphController.kt` flags the one API signature that was
   inferred from the GDK's device table rather than read from a code sample.

---

## 9. Fastest route to the site, ranked

1. **Quick Settings tile** — lock screen, swipe down, tap, unlock. *Best.*
2. **Home-screen icon** — unlock, tap.
3. **Widget chip** — unlock, tap a section directly.
4. **Launcher long-press** — unlock, long-press, pick a section.

---

## 10. Sources

- Glyph Developer Kit — <https://github.com/Nothing-Developer-Programme/Glyph-Developer-Kit>
  (device table incl. `is25131()` for Phone (4b), channels A1-A4 as ints 0-3;
  API-key removal for Android 16; foreground-only restriction; Android 14 floor)
- Glyph Matrix Developer Kit — <https://github.com/Nothing-Developer-Programme/GlyphMatrix-Developer-Kit>
  (supported devices: Phone (3), Phone (4a) Pro — **not** the 4b)
- Phone (4b) specs — <https://www.gsmarena.com/nothing_phone_(4b)_5g-14781.php>
- TWA / Digital Asset Links — <https://developer.android.com/develop/ui/views/layout/webapps/guide-trusted-web-activities-version2>
- android-browser-helper releases — <https://github.com/GoogleChrome/android-browser-helper/releases>
