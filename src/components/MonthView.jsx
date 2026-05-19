import { useMemo } from 'react';
import {
  greekMonthDays,
  gregToGreek,
  fmtGreg,
  dayOfWeek,
  GOALS,
} from '../constants.js';
import { ASATRU_HOLIDAYS, remindersForDate } from '../holidays.js';
import { eventsForDate } from '../storage.js';

// Greek month grid:
// - Regular month = 28 days, aligned to actual day-of-week (Mon-first)
// - Planning Day = 1 cell (or 2 in leap years)
export default function MonthView({ monthId, year, themeColor, events, onDayClick, today }) {
  const days = useMemo(() => greekMonthDays(monthId, year), [monthId, year]);

  if (monthId === 'PLANNING') {
    return (
      <div style={{ padding: '32px 16px' }}>
        {days.map(d => (
          <PlanningCell
            key={d}
            isoDate={d}
            events={eventsForDate(events, d)}
            isToday={d === today}
            themeColor={themeColor}
            year={year}
            onClick={() => onDayClick(d)}
          />
        ))}
      </div>
    );
  }

  const startDow = dayOfWeek(days[0]);
  const dowToCol = (dow) => (dow + 6) % 7;
  const leadingBlanks = dowToCol(startDow);

  const cells = [
    ...Array(leadingBlanks).fill(null),
    ...days,
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div style={{ padding: '12px 8px 24px' }}>
      <DayHeader />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 2,
      }}>
        {cells.map((iso, i) => (
          iso === null
            ? <div key={`blank-${i}`} style={{ aspectRatio: '1/1.15' }} />
            : <DayCell
                key={iso}
                isoDate={iso}
                events={eventsForDate(events, iso)}
                isToday={iso === today}
                themeColor={themeColor}
                year={year}
                onClick={() => onDayClick(iso)}
              />
        ))}
      </div>
    </div>
  );
}

function DayHeader() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 2,
      marginBottom: 6,
      padding: '0 2px',
    }}>
      {days.map(d => (
        <div key={d} style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          letterSpacing: '0.2em',
          color: 'var(--text-faint)',
          textAlign: 'center',
          padding: '4px 0',
        }}>
          {d.toUpperCase()}
        </div>
      ))}
    </div>
  );
}

// Classify each event for this day as: 'single' | 'start' | 'middle' | 'end'
// so the grid can render multi-day events as continuous-looking bars.
function classifyEvent(event, isoDate) {
  if (!event.endDate || event.endDate === event.date) return 'single';
  if (isoDate === event.date) return 'start';
  if (isoDate === event.endDate) return 'end';
  return 'middle';
}

function DayCell({ isoDate, events, isToday, themeColor, year, onClick }) {
  const greek = gregToGreek(isoDate);
  const holidays = ASATRU_HOLIDAYS.filter(
    h => h.greekMonth === greek?.monthId && h.greekDay === greek?.day
  );
  const reminders = remindersForDate(isoDate, year);
  const hasHoliday = holidays.length > 0;
  const hasReminder = reminders.length > 0 && !hasHoliday;
  const gregDay = new Date(isoDate + 'T12:00:00').getDate();

  const primaryHoliday = hasHoliday
    ? (holidays.find(h => h.type !== 'remembrance') || holidays[0])
    : null;
  const isRemembrance = primaryHoliday?.type === 'remembrance';

  // Split events into multi-day vs single-day for distinct rendering
  const multiDay = events.filter(e => e.endDate && e.endDate > e.date);
  const singleDay = events.filter(e => !e.endDate || e.endDate <= e.date);

  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative',
        aspectRatio: '1/1.15',
        background: isToday ? `${themeColor}24` : 'var(--bg-surface)',
        border: isToday ? `1px solid ${themeColor}` : '1px solid var(--border-subtle)',
        borderRadius: 3,
        padding: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        textAlign: 'left',
        transition: 'background 0.15s ease',
        overflow: 'hidden',
      }}
    >
      {hasReminder && (
        <span style={{
          position: 'absolute',
          top: 3, right: 3,
          width: 4, height: 4,
          borderRadius: '50%',
          background: 'var(--text-muted)',
          opacity: 0.6,
        }} />
      )}

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 2,
      }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 17,
          fontWeight: 500,
          color: isToday ? themeColor : 'var(--text-primary)',
          lineHeight: 1,
        }}>
          {greek?.day}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--text-faint)',
          lineHeight: 1,
        }}>
          {gregDay}
        </span>
      </div>

      {primaryHoliday && (
        <div style={{
          fontSize: isRemembrance ? 13 : 11,
          color: isRemembrance ? 'var(--text-secondary)' : themeColor,
          textAlign: 'center',
          marginTop: 2,
          opacity: isRemembrance ? 0.75 : 0.9,
          fontFamily: isRemembrance ? 'var(--font-mono)' : 'inherit',
          letterSpacing: isRemembrance ? '0.05em' : 0,
        }}>
          {primaryHoliday.symbol}
          {holidays.length > 1 && (
            <span style={{
              fontSize: 7,
              marginLeft: 2,
              color: 'var(--text-faint)',
              verticalAlign: 'top',
            }}>+{holidays.length - 1}</span>
          )}
        </div>
      )}

      {/* Multi-day event bars (rendered above the dots so they read as ranges) */}
      {multiDay.length > 0 && (
        <div style={{
          marginTop: 'auto',
          marginBottom: singleDay.length > 0 ? 2 : 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}>
          {multiDay.slice(0, 2).map(e => {
            const pos = classifyEvent(e, isoDate);
            const color = GOALS[e.goal]?.color || 'var(--text-muted)';
            return (
              <span
                key={e.id}
                style={{
                  height: 3,
                  background: `${color}cc`,
                  marginLeft: pos === 'start' || pos === 'single' ? 2 : -2,
                  marginRight: pos === 'end' || pos === 'single' ? 2 : -2,
                  borderRadius: pos === 'single' ? 2 : 0,
                  borderTopLeftRadius: pos === 'start' ? 2 : 0,
                  borderBottomLeftRadius: pos === 'start' ? 2 : 0,
                  borderTopRightRadius: pos === 'end' ? 2 : 0,
                  borderBottomRightRadius: pos === 'end' ? 2 : 0,
                }}
              />
            );
          })}
          {multiDay.length > 2 && (
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 7,
              color: 'var(--text-muted)',
              textAlign: 'center',
              lineHeight: 1,
            }}>+{multiDay.length - 2}</span>
          )}
        </div>
      )}

      {/* Single-day event dots */}
      {singleDay.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          marginTop: multiDay.length > 0 ? 0 : 'auto',
          justifyContent: 'center',
          paddingBottom: 2,
        }}>
          {singleDay.slice(0, 4).map(e => (
            <span key={e.id} style={{
              width: 5, height: 5,
              borderRadius: '50%',
              background: GOALS[e.goal]?.color || 'var(--text-muted)',
            }} />
          ))}
          {singleDay.length > 4 && (
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 8,
              color: 'var(--text-muted)',
            }}>+{singleDay.length - 4}</span>
          )}
        </div>
      )}
    </button>
  );
}

function PlanningCell({ isoDate, events, isToday, themeColor, year, onClick }) {
  const reminders = remindersForDate(isoDate, year);
  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative',
        width: '100%',
        background: `linear-gradient(135deg, ${themeColor}15, transparent)`,
        border: `1px solid ${themeColor}`,
        borderRadius: 4,
        padding: '28px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
      }}
    >
      {reminders.length > 0 && (
        <span style={{
          position: 'absolute',
          top: 8, right: 10,
          width: 5, height: 5,
          borderRadius: '50%',
          background: 'var(--text-muted)',
          opacity: 0.6,
        }} />
      )}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 36,
        color: themeColor,
      }}>✦</div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 20,
        color: 'var(--text-primary)',
      }}>
        Planning Day
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--text-muted)',
        letterSpacing: '0.1em',
      }}>
        {fmtGreg(isoDate)}
      </div>
      {events.length > 0 && (
        <div style={{
          fontFamily: 'var(--font-body)',
          fontStyle: 'italic',
          fontSize: 12,
          color: 'var(--text-secondary)',
          marginTop: 6,
        }}>
          {events.length} event{events.length === 1 ? '' : 's'}
        </div>
      )}
    </button>
  );
}
