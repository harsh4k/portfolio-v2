package dev.harshh.portfolio

import android.app.PendingIntent
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.service.quicksettings.TileService

/**
 * Quick Settings tile — the fastest route to the site from a locked phone:
 * swipe down, tap, unlock.
 *
 * Note this does NOT bypass the lock screen. Android always requires an unlock
 * before showing an activity from the keyguard; no app can open arbitrary web
 * content over a secured lock screen.
 */
class PortfolioTileService : TileService() {

    override fun onClick() {
        super.onClick()

        val intent = Intent(this, MainActivity::class.java).apply {
            action = Intent.ACTION_VIEW
            data = Uri.parse(getString(R.string.launch_url))
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        val pending = PendingIntent.getActivity(
            this, 0, intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            // Android 14 removed the Intent overload; it throws if called.
            startActivityAndCollapse(pending)
        } else {
            @Suppress("DEPRECATION")
            startActivityAndCollapse(intent)
        }
    }
}
