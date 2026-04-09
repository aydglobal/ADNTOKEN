import React from 'react';
import ReactDOM from 'react-dom/client';
import MainRouter from './router';
import { UserProvider } from './store/useUser';
import './styles.css';
import './adn-pro-visual-patch.css';
import './adn-crypto-empire.css';

async function clearLegacyOfflineState() {
  if (typeof window === 'undefined') return;

  try {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    }

    if ('caches' in window) {
      const cacheKeys = await caches.keys();
      await Promise.all(cacheKeys.map((key) => caches.delete(key)));
    }
  } catch {
    // Best-effort cleanup to prevent stale bundles from forcing old API hosts.
  }
}

void clearLegacyOfflineState();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <MainRouter />
    </UserProvider>
  </React.StrictMode>
);
