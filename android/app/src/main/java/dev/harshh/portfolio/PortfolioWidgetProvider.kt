package dev.harshh.portfolio

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews

/**
 * Home-screen widget with one-tap deep links into the site's sections.
 *
 * On lock-screen placement: this is a standard AppWidget. Whether Nothing OS
 * 4.1 offers third-party widgets on its lock screen is unverified — Nothing has
 * historically limited that surface to its own widgets, and no official source
 * confirms otherwise. If it is allowed, this widget shows up in the picker with
 * no extra work. If not, it remains a home-screen widget. The legacy
 * `keyguard` widget category (Android 4.2–4.4) was removed in Android 5.0 and
 * grants nothing here, so it is not relied upon.
 */
class PortfolioWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray,
    ) {
        val base = context.getString(R.string.launch_url).trimEnd('/')

        for (id in appWidgetIds) {
            val views = RemoteViews(context.packageName, R.layout.widget_portfolio).apply {
                setOnClickPendingIntent(R.id.widget_root, deepLink(context, base, "/", 0))
                setOnClickPendingIntent(R.id.widget_overview, deepLink(context, base, "/overview", 1))
                setOnClickPendingIntent(R.id.widget_work, deepLink(context, base, "/websites", 2))
                setOnClickPendingIntent(R.id.widget_posters, deepLink(context, base, "/posters", 3))
            }
            appWidgetManager.updateAppWidget(id, views)
        }
    }

    private fun deepLink(context: Context, base: String, path: String, code: Int): PendingIntent {
        val intent = Intent(context, MainActivity::class.java).apply {
            action = Intent.ACTION_VIEW
            data = Uri.parse(base + path)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        return PendingIntent.getActivity(
            context, code, intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
    }
}
