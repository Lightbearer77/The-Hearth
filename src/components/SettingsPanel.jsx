import { useState, useEffect } from 'react';
import { PRESET_COLORS } from '../storage.js';
import {
  notificationSupport,
  notificationPermission,
  requestNotificationPermission,
  fireTestNotification,
} from '../notifications.js';

export default function SettingsPanel({ categories, onSave, onDelete, onAdd, onClose }) {
  const [editing, setEditing] = useState(null);
  const [notifState, setNotifState] = useState('default');
  const [testFiring, setTestFiring] = useState(false);

  useEffect(() => {
    setNotifState(notificationPermission());
  }, []);

  const handleEnableNotifs = async () => {
    const result = await requestNotificationPermission();
    setNotifState(result);
  };

  const handleTest = async () => {
    setTestFiring(true);
    await fireTestNotification();
    setTimeout(() => setTestFiring(false), 1500);
  };

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.55)',
        zIndex: 190,
      }} />
      <div className="slide-up" style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        background: 'var(--bg-surface)',
        borderTop: '2px solid var(--border-strong)',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        zIndex: 200,
        maxHeight: '88vh',
        overflowY: 'auto',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.5)',
      }}>
        <div style={{ padding: '10px 0 4px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 36, height: 4, background: 'var(--border-strong)', borderRadius: 2 }} />
        </div>

        {/* Header */}
        <div style={{
          padding: '8px 20px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20,
            fontWeight: 500,
            color: 'var(--text-primary)',
          }}>
            Settings
          </span>
          <button onClick={onClose} style={{
            color: 'var(--text-muted)',
            fontSize: 22, lineHeight: 1, padding: 4,
          }}>×</button>
        </div>

        {/* Notifications section */}
        <div style={{ padding: '16px 16px 8px' }}>
          <SectionLabel>Notifications</SectionLabel>
          <NotificationBlock
            state={notifState}
            onEnable={handleEnableNotifs}
            onTest={handleTest}
            testFiring={testFiring}
          />
        </div>

        {/* Categories section */}
        <div style={{ padding: '12px 16px 8px' }}>
          <SectionLabel>Categories</SectionLabel>
          {categories.map(cat => (
            <CategoryRow
              key={cat.id}
              cat={cat}
              isEditing={editing === cat.id}
              onEdit={() => setEditing(cat.id)}
              onDone={() => setEditing(null)}
              onSave={onSave}
              onDelete={() => { onDelete(cat.id); setEditing(null); }}
            />
          ))}
          <button
            onClick={onAdd}
            style={{
              width: '100%',
              marginTop: 4,
              padding: '13px',
              background: 'transparent',
              border: '1px dashed var(--border-mid)',
              borderRadius: 4,
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.2em',
            }}
          >
            + NEW CATEGORY
          </button>
        </div>

        {/* Bottom spacing */}
        <div style={{ height: 24 }} />
      </div>
    </>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '0.25em',
      color: 'var(--text-muted)',
      marginBottom: 10,
      paddingLeft: 2,
    }}>
      {children.toUpperCase()}
    </div>
  );
}

function NotificationBlock({ state, onEnable, onTest, testFiring }) {
  const unsupported = state === 'unsupported';
  const granted     = state === 'granted';
  const denied      = state === 'denied';
  const pending     = state === 'default';

  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border-subtle)',
      borderLeft: `3px solid ${
        granted ? 'var(--g2)' :
        denied  ? 'var(--g3)' :
        'var(--accent-dim)'
      }`,
      borderRadius: 4,
      padding: '12px 14px',
      marginBottom: 10,
    }}>
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        color: 'var(--text-primary)',
        marginBottom: 6,
        fontWeight: 500,
      }}>
        {unsupported && 'Not supported in this browser'}
        {granted     && 'Notifications enabled'}
        {denied      && 'Notifications blocked'}
        {pending     && 'Notifications not yet enabled'}
      </div>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 12,
        color: 'var(--text-muted)',
        lineHeight: 1.5,
        marginBottom: 10,
      }}>
        {granted && 'Reminders fire when you open The Hearth on a 14, 7, or 1-day reminder day. For best results, install The Hearth to your home screen.'}
        {pending && 'When enabled, opening The Hearth on a reminder day will fire system notifications for upcoming holidays and Days of Remembrance.'}
        {denied  && 'Notifications are blocked at the browser level. Re-enable in your browser site settings if you want reminders.'}
        {unsupported && 'Your browser doesn\u2019t support web notifications. Install The Hearth as a PWA for the best chance of support.'}
      </p>

      {pending && (
        <button onClick={onEnable} style={primaryBtn}>
          ENABLE NOTIFICATIONS
        </button>
      )}
      {granted && (
        <button onClick={onTest} style={ghostActionBtn} disabled={testFiring}>
          {testFiring ? 'SENT ✓' : 'SEND TEST NOTIFICATION'}
        </button>
      )}
    </div>
  );
}

function CategoryRow({ cat, isEditing, onEdit, onDone, onSave, onDelete }) {
  const [draft, setDraft] = useState(cat);

  if (draft.id !== cat.id) setDraft(cat);

  const handleSave = () => {
    onSave({ ...cat, ...draft });
    onDone();
  };

  if (!isEditing) {
    return (
      <button
        onClick={onEdit}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          width: '100%',
          padding: '11px 12px',
          marginBottom: 6,
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          borderLeft: `3px solid ${cat.color}`,
          borderRadius: 3,
          textAlign: 'left',
        }}
      >
        <span style={{
          width: 14, height: 14, borderRadius: '50%',
          background: cat.color, flexShrink: 0,
        }} />
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: 14,
          color: 'var(--text-primary)', flex: 1,
        }}>{cat.name}</span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 9,
          color: 'var(--text-faint)', letterSpacing: '0.1em',
        }}>EDIT ›</span>
      </button>
    );
  }

  return (
    <div style={{
      marginBottom: 8,
      background: 'var(--bg-elevated)',
      border: `1px solid ${draft.color}`,
      borderRadius: 4,
      padding: '12px 14px',
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 9,
        letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: 6,
      }}>NAME</div>
      <input
        value={draft.name}
        onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
        autoFocus
        style={{ marginBottom: 12 }}
      />

      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 9,
        letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: 8,
      }}>COLOR</div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: 8,
        marginBottom: 14,
      }}>
        {PRESET_COLORS.map(color => (
          <button
            key={color}
            onClick={() => setDraft(d => ({ ...d, color }))}
            style={{
              width: '100%',
              aspectRatio: '1/1',
              borderRadius: '50%',
              background: color,
              border: draft.color === color
                ? '2px solid var(--text-primary)'
                : '2px solid transparent',
              boxShadow: draft.color === color ? `0 0 0 1px ${color}` : 'none',
            }}
          />
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={handleSave} style={{
          flex: 1, padding: '10px',
          background: `${draft.color}24`,
          border: `1px solid ${draft.color}`,
          borderRadius: 3,
          fontFamily: 'var(--font-mono)', fontSize: 10,
          letterSpacing: '0.15em', color: draft.color,
        }}>SAVE</button>
        <button onClick={onDone} style={{
          flex: 1, padding: '10px',
          background: 'transparent',
          border: '1px solid var(--border-mid)',
          borderRadius: 3,
          fontFamily: 'var(--font-mono)', fontSize: 10,
          letterSpacing: '0.15em', color: 'var(--text-muted)',
        }}>CANCEL</button>
        <button onClick={onDelete} style={{
          padding: '10px 14px',
          background: 'transparent',
          border: '1px solid var(--g3)',
          borderRadius: 3,
          fontFamily: 'var(--font-mono)', fontSize: 10,
          letterSpacing: '0.15em', color: 'var(--g3)',
        }}>DEL</button>
      </div>
    </div>
  );
}

const primaryBtn = {
  width: '100%',
  padding: '10px',
  background: 'rgba(201,168,76,0.18)',
  border: '1px solid var(--accent)',
  borderRadius: 3,
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  letterSpacing: '0.18em',
  color: 'var(--accent)',
};

const ghostActionBtn = {
  width: '100%',
  padding: '9px',
  background: 'transparent',
  border: '1px solid var(--border-mid)',
  borderRadius: 3,
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  letterSpacing: '0.18em',
  color: 'var(--text-secondary)',
};
