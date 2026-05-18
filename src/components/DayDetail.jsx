import { gregToGreek, fmtGregLong, GOALS, SEASONAL_THEMES } from '../constants.js';
import { ASATRU_HOLIDAYS } from '../holidays.js';

export default function DayDetail({ isoDate, events, onClose, onAdd, onEdit }) {
  const greek = gregToGreek(isoDate);
  const holidays = greek ? ASATRU_HOLIDAYS.filter(
    h => h.greekMonth === greek.monthId && h.greekDay === greek.day
  ) : [];
  const themeColor = greek ? SEASONAL_THEMES[greek.monthId]?.color || 'var(--accent)' : 'var(--accent)';

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 90,
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Sheet */}
      <div className="fade-in" style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        background: 'var(--bg-surface)',
        borderTop: `2px solid ${themeColor}`,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        zIndex: 100,
        maxHeight: '75vh',
        overflowY: 'auto',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.4)',
      }}>
        {/* Drag handle */}
        <div style={{
          padding: '10px 0 6px',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <div style={{
            width: 36, height: 4,
            background: 'var(--border-strong)',
            borderRadius: 2,
          }} />
        </div>

        {/* Header */}
        <div style={{ padding: '8px 20px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 30,
                fontWeight: 500,
                color: 'var(--text-primary)',
                lineHeight: 1.1,
              }}>
                <span style={{ color: themeColor, marginRight: 8 }}>
                  {greek?.letter}{greek?.day}
                </span>
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                color: 'var(--text-secondary)',
                marginTop: 4,
              }}>
                {greek?.isPlanningDay ? 'Planning Day' : `${greek?.monthName} ${greek?.day}`}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--text-faint)',
                marginTop: 2,
                letterSpacing: '0.1em',
              }}>
                {fmtGregLong(isoDate)}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                color: 'var(--text-muted)',
                fontSize: 22,
                padding: 4,
                lineHeight: 1,
              }}
            >×</button>
          </div>
        </div>

        {/* Holidays */}
        {holidays.length > 0 && (
          <div style={{ padding: '16px 20px 8px' }}>
            {holidays.map(h => (
              <div key={h.id} style={{
                padding: '12px 14px',
                background: `${themeColor}12`,
                border: `1px solid ${themeColor}40`,
                borderRadius: 4,
                marginBottom: 10,
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 6,
                }}>
                  <span style={{ fontSize: 16 }}>{h.symbol}</span>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 18,
                    fontWeight: 500,
                    color: themeColor,
                  }}>{h.title}</span>
                </div>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.55,
                }}>{h.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Events list */}
        <div style={{ padding: '8px 20px 20px' }}>
          {events.length === 0 ? (
            <div style={{
              padding: '24px 0',
              textAlign: 'center',
              color: 'var(--text-faint)',
              fontFamily: 'var(--font-body)',
              fontStyle: 'italic',
              fontSize: 13,
            }}>
              {holidays.length > 0 ? 'No personal events.' : 'No events.'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="divider-ornament">EVENTS</div>
              {events.map(evt => (
                <EventRow key={evt.id} event={evt} onClick={() => onEdit(evt)} />
              ))}
            </div>
          )}

          {/* Add button */}
          <button
            onClick={onAdd}
            style={{
              width: '100%',
              marginTop: 16,
              padding: '14px',
              background: 'transparent',
              border: `1px dashed ${themeColor}80`,
              borderRadius: 4,
              color: themeColor,
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.2em',
            }}
          >
            + ADD EVENT
          </button>
        </div>
      </div>
    </>
  );
}

function EventRow({ event, onClick }) {
  const goalColor = GOALS[event.goal]?.color || 'var(--text-muted)';
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: '10px 12px',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-subtle)',
        borderLeft: `3px solid ${goalColor}`,
        borderRadius: 3,
        textAlign: 'left',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 500,
          fontSize: 14,
          color: 'var(--text-primary)',
          marginBottom: 2,
        }}>{event.title || 'Untitled'}</div>

        {(event.startTime || event.location) && (
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--text-muted)',
            letterSpacing: '0.05em',
          }}>
            {event.allDay
              ? 'All day'
              : (event.startTime + (event.endTime ? ` – ${event.endTime}` : ''))}
            {event.location && ` · ${event.location}`}
          </div>
        )}
      </div>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        color: goalColor,
        letterSpacing: '0.1em',
      }}>{event.goal}</span>
    </button>
  );
}
