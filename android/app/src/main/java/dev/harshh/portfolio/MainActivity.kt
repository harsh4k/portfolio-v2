package dev.harshh.portfolio

import android.os.Bundle
import com.google.androidbrowserhelper.trusted.LauncherActivity

/**
 * Trusted Web Activity host.
 *
 * The site is rendered by Chrome with no browser UI — but only while Digital
 * Asset Links verification passes. If /.well-known/assetlinks.json on the site
 * does not list this APK's signing fingerprint, the TWA silently degrades to a
 * Custom Tab *with a visible URL bar*. That is the first thing to check if the
 * installed app suddenly looks like a browser.
 *
 * LauncherActivity resolves the launch URL from the incoming intent's data when
 * present, falling back to DEFAULT_URL in the manifest — which is what makes the
 * widget and tile deep links land on the right route.
 */
class MainActivity : LauncherActivity() {

    private lateinit var glyph: GlyphController

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        glyph = GlyphController(this)
        glyph.connect()
    }

    override fun onDestroy() {
        glyph.release()
        super.onDestroy()
    }
}
