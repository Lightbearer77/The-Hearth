import { useMemo } from 'react';
import {
  greekMonthDays,
  gregToGreek,
  fmtGreg,
  dayOfWeek,
  GOALS,
} from '../constants.js';
import { ASATRU_HOLIDAYS } from '../holidays.js';
import { eventsForDate } from '../storage.js';

// Greek month grid:
// - Regular month = 28 days, displayed as 4 rows of 7
// - First column is the actual day-of-week the month starts on
// - Days flow naturally so the grid is calendar-correct
// - Planning Day = 1 cell (or 2 in leap years)
export default function MonthView({ monthId, year, themeColor, events, onDayClick, today }) {
  const days = useMemo(() => greekMonthDays(monthId, year), [monthId, year]);

  // For Planning Day, single-cell display
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
            onClick={() => onDayClick(d)}
          />
        ))}
      </div>
    );
  }

  // Build cell rows, aligning to the day of week the month starts on
  const startDow = dayOfWeek(days[0]); // 0=Sun..6=Sat
  // We'll use Mon-Sun layout (Mon=0 in our display)
  // Convert: 0(Sun)→6, 1(Mon)→0, 2(Tue)→1, ..., 6(Sat)→5
  const dowToCol = (dow) => (dow + 6) % 7;
  const leadingBlanks = dowToCol(startDow);

  const cells = [
    ...Array(leadingBlanks).fill(null),
    ...days,
  ];
  // Pad trailing to fill complete rows
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

function DayCell({ isoDate, events, isToday, themeColor, onClick }) {
  const greek = gregToGreek(isoDate);
  const holidays = ASATRU_HOLIDAYS.filter(
    h => h.greekMonth === greek?.monthId && h.greekDay === greek?.day
  );
  const hasHoliday = holidays.length > 0;
  const gregMonth = new Date(isoDate + 'T12:00:00').getDate();

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
      {/* Top row: Greek date prominent, Gregorian small */}
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
          {gregMonth}
        </span>
      </div>

      {/* Holiday symbol */}
      {hasHoliday && (
        <div style={{
          fontSize: 11,
          color: themeColor,
          textAlign: 'center',
          marginTop: 2,
          opacity: 0.85,
        }}>
          {holidays[0].symbol}
        </div>
      )}

      {/* Event dots */}
      {events.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          marginTop: 'auto',
          justifyContent: 'center',
          paddingBottom: 2,
        }}>
          {events.slice(0, 4).map(e => (
            <span key={e.id} style={{
              width: 5, height: 5,
              borderRadius: '50%',
              background: GOALS[e.goal]?.color || 'var(--text-muted)',
            }} />
          ))}
          {events.length > 4 && (
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 8,
              color: 'var(--text-muted)',
            }}>+{events.length - 4}</span>
          )}
        </div>
      )}
    </button>
  );
}

function PlanningCell({ isoDate, events, isToday, themeColor, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
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
