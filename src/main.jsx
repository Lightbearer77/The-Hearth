import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ─── Register service worker ───
// Scope is the app's base path; SW is served from /The-Hearth/sw.js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const base = import.meta.env.BASE_URL || '/';
    navigator.serviceWorker
      .register(`${base}sw.js`, { scope: base })
      .catch((err) => console.warn('Hearth SW registration failed:', err));
  });
}
