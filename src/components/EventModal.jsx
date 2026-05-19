import { useState } from 'react';
import { GOALS, fmtGreekLong, fmtGregLong, gregToGreek } from '../constants.js';

export default function EventModal({ event, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(event);
  const [showEndDate, setShowEndDate] = useState(!!event.endDate);
  const isNew = !event.title && event.createdAt && (Date.now() - event.createdAt < 5000);

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleSave = () => {
    if (!form.title.trim()) {
      alert('Title required.');
      return;
    }
    if (!form.date) {
      alert('Date required.');
      return;
    }
    // Strip endDate if hidden or invalid
    const finalForm = { ...form };
    if (!showEndDate || !finalForm.endDate || finalForm.endDate < finalForm.date) {
      finalForm.endDate = '';
    }
    onSave(finalForm);
  };

  const handleDelete = () => {
    if (confirm('Delete this event?')) onDelete(form.id);
  };

  // Greek labels for the date fields
  const startGreek = form.date ? gregToGreek(form.date) : null;
  const endGreek = form.endDate ? gregToGreek(form.endDate) : null;

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'var(--bg-overlay)',
      zIndex: 200,
      display: 'flex',
      flexDirection: 'column',
      animation: 'fadeIn 0.2s ease',
    }}>
      {/* Header */}
      <header style={{
        padding: '14px 16px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--bg-surface)',
      }}>
        <button onClick={onClose} style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--text-muted)',
          letterSpacing: '0.15em',
          padding: '4px 8px',
        }}>← CANCEL</button>

        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 16,
          fontStyle: 'italic',
          color: 'var(--text-secondary)',
        }}>
          {isNew ? 'New Event' : 'Edit Event'}
        </span>

        <button onClick={handleSave} style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--accent)',
          letterSpacing: '0.15em',
          padding: '4px 8px',
          fontWeight: 600,
        }}>SAVE</button>
      </header>

      {/* Body */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px 16px 40px',
      }}>
        {/* Title */}
        <Field label="Title">
          <input
            value={form.title}
            onChange={e => update('title', e.target.value)}
            placeholder="What is happening?"
            autoFocus={isNew}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 20,
              padding: '12px 14px',
              background: 'var(--bg-surface)',
            }}
          />
        </Field>

        {/* Start date (editable) */}
        <Field label={showEndDate ? "Start Date" : "Date"}>
          <input
            type="date"
            value={form.date}
            onChange={e => update('date', e.target.value)}
            style={{
              background: 'var(--bg-surface)',
              padding: '11px 12px',
            }}
          />
          {startGreek && (
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 13,
              fontStyle: 'italic',
              color: 'var(--text-muted)',
              marginTop: 4,
              paddingLeft: 2,
            }}>
              {startGreek.isPlanningDay
                ? 'Planning Day'
                : `${startGreek.monthName} ${startGreek.day}`}
            </div>
          )}
        </Field>

        {/* End date toggle + field */}
        {!showEndDate ? (
          <button
            onClick={() => setShowEndDate(true)}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.2em',
              color: 'var(--text-muted)',
              padding: '6px 0 16px',
            }}
          >
            + ADD END DATE
          </button>
        ) : (
          <Field label="End Date">
            <input
              type="date"
              value={form.endDate || ''}
              onChange={e => update('endDate', e.target.value)}
              min={form.date}
              style={{
                background: 'var(--bg-surface)',
                padding: '11px 12px',
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 4,
              paddingLeft: 2,
            }}>
              {endGreek ? (
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 13,
                  fontStyle: 'italic',
                  color: 'var(--text-muted)',
                }}>
                  {endGreek.isPlanningDay
                    ? 'Planning Day'
                    : `${endGreek.monthName} ${endGreek.day}`}
                </div>
              ) : <span />}
              <button
                onClick={() => { setShowEndDate(false); update('endDate', ''); }}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  letterSpacing: '0.15em',
                  color: 'var(--text-faint)',
                  padding: '2px 4px',
                }}
              >
                REMOVE
              </button>
            </div>
          </Field>
        )}

        {/* All-day toggle + times */}
        <Field label="Time">
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 10,
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}>
            <input
              type="checkbox"
              checked={form.allDay}
              onChange={e => update('allDay', e.target.checked)}
              style={{ width: 'auto', accentColor: 'var(--accent)' }}
            />
            All day
          </label>

          {!form.allDay && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <Label small>Start</Label>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={e => update('startTime', e.target.value)}
                />
              </div>
              <div>
                <Label small>End</Label>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={e => update('endTime', e.target.value)}
                />
              </div>
            </div>
          )}
        </Field>

        <Field label="Location">
          <input
            value={form.location}
            onChange={e => update('location', e.target.value)}
            placeholder="Where?"
          />
        </Field>

        <Field label="Description">
          <textarea
            value={form.description}
            onChange={e => update('description', e.target.value)}
            placeholder="Notes, intentions, ritual details..."
            rows={4}
          />
        </Field>

        <Field label="Tag">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {Object.keys(GOALS).map(g => (
              <button
                key={g}
                onClick={() => update('goal', g)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 3,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.15em',
                  background: form.goal === g ? `${GOALS[g].color}24` : 'var(--bg-surface)',
                  border: `1px solid ${form.goal === g ? GOALS[g].color : 'var(--border-subtle)'}`,
                  color: form.goal === g ? GOALS[g].color : 'var(--text-muted)',
                }}
              >
                {GOALS[g].icon} {g === 'RITUAL' || g === 'HOLIDAY' ? GOALS[g].name.toUpperCase() : g}
              </button>
            ))}
          </div>
        </Field>

        {!isNew && (
          <button
            onClick={handleDelete}
            style={{
              width: '100%',
              marginTop: 24,
              padding: '12px',
              background: 'transparent',
              border: '1px solid var(--g3)',
              borderRadius: 3,
              color: 'var(--g3)',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.2em',
            }}
          >
            DELETE EVENT
          </button>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Label({ children, small }) {
  return (
    <div style={{
      fontFamily: 'var(--font-mono)',
      fontSize: small ? 9 : 10,
      letterSpacing: '0.2em',
      color: 'var(--text-muted)',
      marginBottom: 6,
      textTransform: 'uppercase',
    }}>{children}</div>
  );
}
