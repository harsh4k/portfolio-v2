package dev.harshh.portfolio

import android.content.ComponentName
import android.content.Context
import android.os.Build
import android.util.Log
import com.nothing.ketchum.Common
import com.nothing.ketchum.Glyph
import com.nothing.ketchum.GlyphException
import com.nothing.ketchum.GlyphManager

/**
 * Thin, defensive wrapper over the Nothing Glyph Developer Kit.
 *
 * What is actually available on Phone (4b), verified against the GDK:
 *  - The device is `Common.is25131()` / `Glyph.DEVICE_25131`.
 *  - It exposes the Glyph Bar as **four** addressable zones, channels A1..A4,
 *    integer indices 0..3.
 *  - `toggle()` and `animate()` work. `displayProgress()` does NOT — that is a
 *    C1/D1 channel feature and the 4b has neither.
 *  - The SDK requires Android 14+.
 *  - Third-party Glyph control is **foreground-only**, so this can act as a
 *    launch signature but never as an ambient background notification light.
 *
 * Every entry point is guarded and swallowing: on a Pixel, an emulator, or a
 * Nothing phone with the service unavailable, this object quietly does nothing
 * and the app behaves normally.
 */
class GlyphController(private val context: Context) {

    private var manager: GlyphManager? = null
    private var sessionOpen = false

    /** False on any non-Nothing device, or below the SDK's Android 14 floor. */
    private val supported: Boolean by lazy {
        Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE && isNothingDevice()
    }

    private fun isNothingDevice(): Boolean = try {
        Common.is25131() // Phone (4b)
    } catch (t: Throwable) {
        // Class or method absent — not a Nothing build.
        false
    }

    fun connect() {
        if (!supported) return
        try {
            val gm = GlyphManager.getInstance(context.applicationContext)
            manager = gm
            gm.init(object : GlyphManager.Callback {
                override fun onServiceConnected(name: ComponentName?) {
                    try {
                        gm.register(Glyph.DEVICE_25131)
                        gm.openSession()
                        sessionOpen = true
                        playLaunchSignature()
                    } catch (e: GlyphException) {
                        Log.w(TAG, "Glyph session failed: ${e.message}")
                    }
                }

                override fun onServiceDisconnected(name: ComponentName?) {
                    sessionOpen = false
                    runCatching { gm.closeSession() }
                }
            })
        } catch (t: Throwable) {
            Log.w(TAG, "Glyph unavailable: ${t.message}")
        }
    }

    /**
     * A short breathing sweep across all four zones. Deliberately brief — the
     * foreground-only restriction means anything longer just burns battery
     * while the user is already looking at the screen.
     */
    fun playLaunchSignature() {
        val gm = manager ?: return
        if (!sessionOpen) return
        try {
            val frame = gm.glyphFrameBuilder
                .buildChannel(Glyph.Code_25131.A_1)
                .buildChannel(Glyph.Code_25131.A_2)
                .buildChannel(Glyph.Code_25131.A_3)
                .buildChannel(Glyph.Code_25131.A_4)
                .buildInterval(INTERVAL_MS)
                .buildCycles(CYCLES)
                .buildPeriod(PERIOD_MS)
                .build()
            gm.animate(frame)
        } catch (e: GlyphException) {
            Log.w(TAG, "Glyph animate failed: ${e.message}")
        } catch (t: Throwable) {
            Log.w(TAG, "Glyph animate failed: ${t.message}")
        }
    }

    fun release() {
        val gm = manager ?: return
        // turnOff() clears the bar; without it the last frame can linger.
        runCatching { gm.turnOff() }
        runCatching { if (sessionOpen) gm.closeSession() }
        runCatching { gm.unInit() }
        sessionOpen = false
        manager = null
    }

    private companion object {
        const val TAG = "GlyphController"

        // Phone (4b) exposes exactly four zones. Verified against the SDK
        // binary: Glyph.DEVICE_25131_SIZE == 4, and Code_25131.A_1..A_4 are
        // 0..3. The named constants are used above rather than raw ints.
        const val PERIOD_MS = 1200
        const val INTERVAL_MS = 40
        const val CYCLES = 1
    }
}
