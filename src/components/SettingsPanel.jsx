import { useState } from 'react';
import { PRESET_COLORS } from '../storage.js';

export default function SettingsPanel({ categories, onSave, onDelete, onAdd, onClose }) {
  const [editing, setEditing] = useState(null); // category id being edited

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.55)',
          zIndex: 190,
        }}
      />
      <div className="slide-up" style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        background: 'var(--bg-surface)',
        borderTop: '2px solid var(--border-strong)',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        zIndex: 200,
        maxHeight: '85vh',
        overflowY: 'auto',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.5)',
      }}>
        {/* Drag handle */}
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
            Categories
          </span>
          <button onClick={onClose} style={{
            color: 'var(--text-muted)',
            fontSize: 22,
            lineHeight: 1,
            padding: 4,
          }}>×</button>
        </div>

        {/* Category list */}
        <div style={{ padding: '12px 16px 8px' }}>
          {categories.map(cat => (
            <CategoryRow
              key={cat.id}
              cat={cat}
              isEditing={editing === cat.id}
              onEdit={() => setEditing(cat.id)}
              onDone={() => setEditing(null)}
              onSave={onSave}
              onDelete={() => {
                onDelete(cat.id);
                setEditing(null);
              }}
            />
          ))}
        </div>

        {/* Add new */}
        <div style={{ padding: '4px 16px 32px' }}>
          <button
            onClick={() => { onAdd(); }}
            style={{
              width: '100%',
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
      </div>
    </>
  );
}

function CategoryRow({ cat, isEditing, onEdit, onDone, onSave, onDelete }) {
  const [draft, setDraft] = useState(cat);

  // Sync draft if cat changes externally
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
          width: 14, height: 14,
          borderRadius: '50%',
          background: cat.color,
          flexShrink: 0,
        }} />
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          color: 'var(--text-primary)',
          flex: 1,
        }}>
          {cat.name}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--text-faint)',
          letterSpacing: '0.1em',
        }}>
          EDIT ›
        </span>
      </button>
    );
  }

  // Expanded edit mode
  return (
    <div style={{
      marginBottom: 8,
      background: 'var(--bg-elevated)',
      border: `1px solid ${draft.color}`,
      borderRadius: 4,
      padding: '12px 14px',
    }}>
      {/* Name field */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        letterSpacing: '0.2em',
        color: 'var(--text-muted)',
        marginBottom: 6,
      }}>NAME</div>
      <input
        value={draft.name}
        onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
        autoFocus
        style={{ marginBottom: 12 }}
      />

      {/* Color picker */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        letterSpacing: '0.2em',
        color: 'var(--text-muted)',
        marginBottom: 8,
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
                ? `2px solid var(--text-primary)`
                : '2px solid transparent',
              boxShadow: draft.color === color
                ? `0 0 0 1px ${color}`
                : 'none',
            }}
          />
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={handleSave}
          style={{
            flex: 1,
            padding: '10px',
            background: `${draft.color}24`,
            border: `1px solid ${draft.color}`,
            borderRadius: 3,
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.15em',
            color: draft.color,
          }}
        >
          SAVE
        </button>
        <button
          onClick={onDone}
          style={{
            flex: 1,
            padding: '10px',
            background: 'transparent',
            border: '1px solid var(--border-mid)',
            borderRadius: 3,
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.15em',
            color: 'var(--text-muted)',
          }}
        >
          CANCEL
        </button>
        <button
          onClick={onDelete}
          style={{
            padding: '10px 14px',
            background: 'transparent',
            border: '1px solid var(--g3)',
            borderRadius: 3,
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.15em',
            color: 'var(--g3)',
          }}
        >
          DEL
        </button>
      </div>
    </div>
  );
}
