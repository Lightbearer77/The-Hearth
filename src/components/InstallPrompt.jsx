import { useEffect, useState } from 'react';

const DISMISSED_KEY = 'hearth-install-dismissed-v1';

// Returns true when running as an installed PWA (no browser chrome)
const isStandalone = () =>
  typeof window !== 'undefined' && (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );

const isIOS = () =>
  typeof navigator !== 'undefined' &&
  /iPhone|iPad|iPod/.test(navigator.userAgent) &&
  !window.MSStream;

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);
  const [showIOSHelp, setShowIOSHelp] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;                       // already installed
    if (localStorage.getItem(DISMISSED_KEY)) return;  // user dismissed before

    // iOS — no install API; show iOS-specific banner after delay
    if (isIOS()) {
      const timer = setTimeout(() => setShow(true), 4000);
      return () => clearTimeout(timer);
    }

    // Android / Chrome — listen for the install event
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // If we never get the event (maybe already installed via different method),
    // do nothing — the banner stays hidden.

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS()) {
      setShowIOSHelp(true);
      return;
    }
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShow(false);
    if (choice.outcome === 'dismissed') {
      // Don't permanently dismiss on a single "not now" — let it return next session
    }
  };

  const handleDismiss = () => {
    setShow(false);
    setShowIOSHelp(false);
    localStorage.setItem(DISMISSED_KEY, '1');
  };

  if (!show && !showIOSHelp) return null;

  if (showIOSHelp) {
    return (
      <div style={overlay}>
        <div onClick={() => setShowIOSHelp(false)} style={backdrop} />
        <div className="slide-up" style={iosHelpBox}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20, fontWeight: 500,
            color: 'var(--text-primary)',
            marginBottom: 12,
          }}>
            Install on iOS
          </div>
          <ol style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14, lineHeight: 1.7,
            color: 'var(--text-secondary)',
            paddingLeft: 20, marginBottom: 16,
          }}>
            <li>Tap the <strong>Share</strong> button (square with arrow) in Safari</li>
            <li>Scroll and tap <strong>Add to Home Screen</strong></li>
            <li>Tap <strong>Add</strong> in the upper right</li>
          </ol>
          <button onClick={handleDismiss} style={dismissBtn}>GOT IT</button>
        </div>
      </div>
    );
  }

  return (
    <div className="slide-up" style={banner}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
        <div style={{
          width: 36, height: 36,
          borderRadius: 6,
          background: '#16120e',
          border: '1px solid var(--accent-dim)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          flexShrink: 0,
        }}>🔥</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 14, fontWeight: 500,
            color: 'var(--text-primary)',
            lineHeight: 1.2,
          }}>
            Install The Hearth
          </div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            color: 'var(--text-muted)',
            lineHeight: 1.3,
            marginTop: 2,
          }}>
            Add to home screen for notifications & faster access
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={handleDismiss} style={ghostBtn}>×</button>
        <button onClick={handleInstall} style={installBtn}>INSTALL</button>
      </div>
    </div>
  );
}

const banner = {
  position: 'fixed',
  bottom: 32, left: 12, right: 12,
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border-mid)',
  borderLeft: '3px solid var(--accent)',
  borderRadius: 6,
  padding: '12px 12px',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  zIndex: 80,
  boxShadow: '0 6px 24px rgba(0,0,0,0.5)',
};
const installBtn = {
  padding: '8px 14px',
  background: 'rgba(201,168,76,0.18)',
  border: '1px solid var(--accent)',
  borderRadius: 3,
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  letterSpacing: '0.18em',
  color: 'var(--accent)',
};
const ghostBtn = {
  padding: '4px 10px',
  background: 'transparent',
  color: 'var(--text-muted)',
  fontSize: 20,
  lineHeight: 1,
};
const overlay = { position: 'fixed', inset: 0, zIndex: 220 };
const backdrop = {
  position: 'absolute', inset: 0,
  background: 'rgba(0,0,0,0.6)',
};
const iosHelpBox = {
  position: 'absolute',
  left: 16, right: 16,
  bottom: 24,
  background: 'var(--bg-surface)',
  border: '1px solid var(--border-mid)',
  borderRadius: 8,
  padding: '20px 18px',
};
const dismissBtn = {
  width: '100%',
  padding: '10px',
  background: 'rgba(201,168,76,0.18)',
  border: '1px solid var(--accent)',
  borderRadius: 3,
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  letterSpacing: '0.2em',
  color: 'var(--accent)',
};
