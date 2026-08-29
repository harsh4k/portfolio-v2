import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {registerSW} from 'virtual:pwa-register';
import App from './App.tsx';
import {warmOfflineCache} from './lib/warm-offline-cache';
import './index.css';

// registerType is 'autoUpdate', so a new build takes over on the next launch.
// Registration is deliberately not awaited — a failure here (unsupported
// browser, blocked scope) must never keep the app from rendering.
registerSW({immediate: true});

// Pulls images and the travel video into the runtime cache once someone is
// actually using the site, so offline covers the whole thing and not just the
// shell. Self-gating: no-ops on save-data, slow links, and idle intro visits.
warmOfflineCache();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
