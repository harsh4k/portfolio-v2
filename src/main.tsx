import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {registerSW} from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// registerType is 'autoUpdate', so a new build takes over on the next launch.
// Registration is deliberately not awaited — a failure here (unsupported
// browser, blocked scope) must never keep the app from rendering.
registerSW({immediate: true});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
