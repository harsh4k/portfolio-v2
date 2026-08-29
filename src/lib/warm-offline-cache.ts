import OFFLINE_ASSETS from "virtual:offline-assets";

/**
 * Pulls the heavy public assets (photography, the travel video, the resume)
 * into the service worker's runtime caches so the whole site — not just its
 * shell — survives with no network.
 *
 * These are deliberately not precached: 3.7 MB is too much to push at someone
 * who opens the intro and leaves. Instead this runs once the visitor is
 * demonstrably using the site, so first load stays cheap and the people who
 * actually need offline get it.
 *
 * Fetching through the SW is enough — the CacheFirst routes in vite.config.ts
 * store each response as it passes. Nothing here touches the cache directly.
 */

const CONCURRENCY = 3;

function shouldWarm(): boolean {
  if (!("serviceWorker" in navigator)) return false;

  // Respect an explicit "don't burn my data" signal, and skip genuinely slow
  // connections where 3.7 MB in the background would hurt.
  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  if (connection?.saveData) return false;
  if (connection?.effectiveType && /(^|-)2g$/.test(connection.effectiveType)) return false;

  // The installed app opens at "/", and its user is exactly who needs offline,
  // so warm unconditionally there. In a browser tab, wait until the visitor has
  // moved past the intro before spending their bandwidth.
  const installed = window.matchMedia("(display-mode: standalone)").matches;
  return installed || location.pathname !== "/";
}

async function fetchQuietly(url: string): Promise<void> {
  try {
    // Already-cached entries are served by the SW without touching the network,
    // so re-running this is cheap.
    await fetch(url, { credentials: "same-origin" });
  } catch {
    // Offline, or the asset moved. The next run picks it up.
  }
}

async function warm(): Promise<void> {
  const queue = [...OFFLINE_ASSETS];
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    for (let url = queue.shift(); url; url = queue.shift()) {
      await fetchQuietly(url);
    }
  });
  await Promise.all(workers);
}

/** Schedules the warm-up for the first idle moment after load. */
export function warmOfflineCache(): void {
  if (!shouldWarm()) return;

  const start = () => {
    const idle = window.requestIdleCallback;
    if (idle) idle(() => void warm(), { timeout: 10_000 });
    else window.setTimeout(() => void warm(), 3_000);
  };

  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
}
