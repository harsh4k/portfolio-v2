# Portfolio on Nothing Phone (4b)

What is actually possible, what isn't, and exactly what to do on the phone.

Every Nothing-specific claim here was checked against the official Glyph
Developer Kit, Nothing OS documentation, or device reviews. Where something
could not be verified, it says so rather than guessing.

The Android project **builds** — verified with AGP 8.9.1 / Gradle 8.11.1 /
compileSdk 36 / JDK 17, producing a 9.1 MB APK containing the launcher activity,
the Quick Settings tile, the widget provider and the Glyph permission. The Glyph
API surface was confirmed by decompiling Nothing's shipped SDK binary.

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

| Route | From a locked phone | Needs |
|---|---|---|
| **Essential Key (double-press)** | press twice, unlock | a third-party remapper |
| **Quick Settings tile** | swipe down, tap, unlock | built in this repo |
| Home-screen icon (PWA/APK) | unlock, tap | built |
| Home-screen widget, deep-linked | unlock, tap | built |
| Launcher long-press shortcut | unlock, long-press, tap | built |

**The Essential Key is the closest you can physically get** — a hardware button
on the left edge, no screen interaction at all before the unlock. It needs a
third-party remapper (section 5E). The **Quick Settings tile** is the best
option that needs nothing beyond this repo.

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
  home-screen widget. **Check it yourself in 30 seconds — step F below.**
  (The legacy `android:widgetCategory="keyguard"` flag is from Android 4.2-4.4
  and was removed in 5.0. It grants nothing on modern Android, so this project
  does not rely on it.)
- **Glyph is supported on the (4b)** — details below.

## 4. Glyph on the (4b) — what is real

GSMArena lists only "Notification LED (on the back)", which is **incomplete**.
The (4b) has a *Glyph Bar* (45 mini-LEDs across five segments), and the official
Glyph Developer Kit names the device explicitly.

Everything below was **decompiled from the shipped SDK binary**, not inferred
from documentation: `Glyph.DEVICE_25131` = `"A009P"`,
`Glyph.DEVICE_25131_SIZE` = `4`, and `Glyph.Code_25131.A_1..A_4` = `0,1,2,3`.

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

1. **The Glyph SDK is already vendored** at
   `android/app/libs/glyph-matrix-sdk-2.0.aar` (from Nothing's official repo),
   so there is nothing to download. Skip to the next step.

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

   Without `keystore.properties` the output is `app-release-unsigned.apk`
   instead, which **cannot be installed** — Android rejects unsigned APKs. Do
   step 2 first.

   The project requires **minSdk 33 (Android 13)**. That floor is set by the
   Glyph AAR itself, whose manifest declares `minSdk 33`; the manifest merger
   rejects anything lower. Your (4b) runs Android 16, so this is irrelevant in
   practice.

### C. Add the Quick Settings tile — the lock-screen route

1. Swipe down twice, then tap the edit (pencil) icon.
2. Find **Portfolio** in the inactive tiles.
3. Drag it into the **first four positions** so it is visible without scrolling.
4. Test: lock the phone, swipe down, tap the tile, unlock — the site opens.

### D. Add the widget

1. Long-press the home screen -> **Widgets** -> **Harshit**.
2. Drag the 4x1 widget out. Three chips deep-link to Overview / Websites /
   Posters; tapping the body opens the intro.

### E. Essential Key -> your site (the closest to a physical shortcut)

The (4b) has Nothing's **Essential Key** on the left edge. Nothing OS does not
let you rebind it natively, but it can be remapped without root:

1. Install **Essential Key Tools** (MIT, open source —
   <https://github.com/KoukeNeko/EssentialKeyTools>, also on Play Store).
2. Grant its accessibility service. It reads *hardware key events only* — the
   README and privacy policy state it does not read screen content or text.
3. Home -> *Key setup* -> press the Essential Key so it learns the identifier.
4. Assign **double press** -> *Launch app* -> **Harshit**.
5. Test in *Key Test* first, which shows detected gestures without firing them.

Why double press: Nothing OS reserves **single** press for Essential Space at the
system-policy level, and freeing it means disabling Essential Space and Recorder
outright. Double, triple and long press need no such surgery.

Caveats, stated honestly:

- This is a **third-party app**, not a Nothing or Google API. It works by
  observing the key event (`keyCode=0`, `scanCode=250`) through an accessibility
  service.
- It requires **Android 15+**; your (4b) is on 16.
- It is documented as supporting "Nothing phones with an Essential Key" and
  learns the key ID at runtime rather than hardcoding per-model values — but it
  has **not been verified on the (4b) specifically**. Try it; if the key is
  never learned in *Key setup*, that model is not supported and the Quick
  Settings tile remains your best route.
- It still cannot bypass the unlock. Nothing can.

### F. Check the lock-screen widget question

Two places to look, because Nothing OS and stock Android 16 expose this
differently:

1. **Nothing's own path:** Settings -> **Lock Screen** -> **Lock screen
   widgets**. Historically this lists only Nothing's categories (clock, quick
   settings, photos, weather) with no third-party section.
2. **The stock Android 16 path**, if Nothing left it in place: Settings ->
   **Display & touch** -> **Lock display** -> **Lock screen** -> **Widgets on
   lock screen**, and enable the toggle.

If either offers an app list, look for **Harshit** — the widget is a standard
`AppWidgetProvider` and will be selectable. If neither does, Nothing OS does not
support it, and the Quick Settings tile is your answer.

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
9. **minSdk is 33 (Android 13)**, forced by the Glyph AAR's own manifest. The
   APK will not install on Android 12 or older.

---

## 9. Fastest route to the site, ranked

1. **Essential Key, double press** — a physical button, no screen interaction
   before the unlock. Needs the third-party remapper in section 5E. *Closest to
   the goal.*
2. **Quick Settings tile** — lock screen, swipe down, tap, unlock. *Best option
   that needs nothing beyond this repo.*
3. **Home-screen icon** — unlock, tap.
4. **Widget chip** — unlock, tap a section directly.
5. **Launcher long-press** — unlock, long-press, pick a section.

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
- Essential Key Tools — <https://github.com/KoukeNeko/EssentialKeyTools>
  (no-root Essential Key remapping; Android 15+; single press is reserved by
  Nothing OS system policy, double/triple/long are free)
- Phone (4b) has an Essential Key — BGR review, "The left side has Nothing's
  Essential Key, though." <https://www.bgr.com/2241278/nothing-phone-4b-review/>
  (note: GSMArena's spec sheet omits it)
