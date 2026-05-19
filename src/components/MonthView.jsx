import { useMemo } from 'react';
import {
  greekMonthDays, gregToGreek, fmtGreg,
  dayOfWeek, prevGreekMonth, nextGreekMonth,
  greekToGreg, GREEK_MONTHS,
} from '../constants.js';
import { ASATRU_HOLIDAYS, remindersForDate } from '../holidays.js';
import { eventsForDate, categoryById } from '../storage.js';

export default function MonthView({ monthId, year, themeColor, events, categories, onDayClick, today }) {
  const days = useMemo(() => greekMonthDays(monthId, year), [monthId, year]);

  if (monthId === 'PLANNING') {
    return (
      <div style={{ padding: '32px 16px' }}>
        {days.map(d => (
          <PlanningCell
            key={d}
            isoDate={d}
            events={eventsForDate(events, d)}
            categories={categories}
            isToday={d === today}
            themeColor={themeColor}
            year={year}
            onClick={() => onDayClick(d)}
          />
        ))}
      </div>
    );
  }

  // Build the main grid
  const startDow = dayOfWeek(days[0]);
  const dowToCol = (dow) => (dow + 6) % 7;
  const leadingCount = dowToCol(startDow);
  const trailingCount = (7 - ((days.length + leadingCount) % 7)) % 7;

  // Ghost days from previous Greek month
  const prevMonth = prevGreekMonth(monthId, year);
  const prevDays = greekMonthDays(prevMonth.monthId, prevMonth.year);
  const leadingGhosts = prevDays.slice(-leadingCount);

  // Ghost days from next Greek month
  const nextMonth = nextGreekMonth(monthId, year);
  const nextDays = greekMonthDays(nextMonth.monthId, nextMonth.year);
  const trailingGhosts = nextDays.slice(0, trailingCount);

  const cells = [
    ...leadingGhosts.map(iso => ({ iso, ghost: true })),
    ...days.map(iso => ({ iso, ghost: false })),
    ...trailingGhosts.map(iso => ({ iso, ghost: true })),
  ];

  return (
    <div style={{ padding: '12px 8px 24px' }}>
      <DayHeader />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 2,
      }}>
        {cells.map(({ iso, ghost }, i) => (
          <DayCell
            key={`${iso}-${ghost ? 'g' : 'r'}-${i}`}
            isoDate={iso}
            ghost={ghost}
            events={ghost ? [] : eventsForDate(events, iso)}
            categories={categories}
            isToday={!ghost && iso === today}
            themeColor={themeColor}
            year={year}
            onClick={() => !ghost && onDayClick(iso)}
          />
        ))}
      </div>
    </div>
  );
}

function DayHeader() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 2,
      marginBottom: 6,
      padding: '0 2px',
    }}>
      {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
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

function classifyEvent(event, isoDate) {
  if (!event.endDate || event.endDate === event.date) return 'single';
  if (isoDate === event.date) return 'start';
  if (isoDate === event.endDate) return 'end';
  return 'middle';
}

function DayCell({ isoDate, ghost, events, categories, isToday, themeColor, year, onClick }) {
  const greek = gregToGreek(isoDate);
  const holidays = ghost ? [] : ASATRU_HOLIDAYS.filter(
    h => h.greekMonth === greek?.monthId && h.greekDay === greek?.day
  );
  const reminders = ghost ? [] : remindersForDate(isoDate, year);
  const hasHoliday = holidays.length > 0;
  const hasReminder = reminders.length > 0 && !hasHoliday;

  const primaryHoliday = hasHoliday
    ? (holidays.find(h => h.type !== 'remembrance') || holidays[0])
    : null;
  const isRemembrance = primaryHoliday?.type === 'remembrance';

  const multiDay   = events.filter(e => e.endDate && e.endDate > e.date);
  const singleDay  = events.filter(e => !e.endDate || e.endDate <= e.date);

  const gregDay = new Date(isoDate + 'T12:00:00').getDate();

  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative',
        aspectRatio: '1/1.15',
        background: ghost
          ? 'transparent'
          : isToday
            ? `${themeColor}20`
            : 'var(--bg-surface)',
        border: ghost
          ? '1px solid transparent'
          : isToday
            ? `1px solid ${themeColor}`
            : '1px solid var(--border-subtle)',
        borderRadius: 3,
        padding: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        textAlign: 'left',
        overflow: 'hidden',
        cursor: ghost ? 'default' : 'pointer',
      }}
    >
      {/* Reminder dot */}
      {hasReminder && !ghost && (
        <span style={{
          position: 'absolute', top: 3, right: 3,
          width: 4, height: 4,
          borderRadius: '50%',
          background: 'var(--text-muted)',
          opacity: 0.5,
        }} />
      )}

      {/* Day number — Greek primary, Gregorian secondary */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 2,
      }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: ghost ? 14 : 17,
          fontWeight: ghost ? 400 : 500,
          color: ghost
            ? 'var(--text-faint)'
            : isToday
              ? themeColor
              : 'var(--text-primary)',
          lineHeight: 1,
          opacity: ghost ? 0.5 : 1,
        }}>
          {ghost
            ? gregDay   // ghost cells show Gregorian day for context
            : greek?.day}
        </span>
        {!ghost && (
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 8,
            color: 'var(--text-faint)',
            lineHeight: 1,
          }}>
            {gregDay}
          </span>
        )}
      </div>

      {/* Holiday symbol */}
      {primaryHoliday && !ghost && (
        <div style={{
          fontSize: isRemembrance ? 12 : 11,
          color: isRemembrance ? 'var(--text-secondary)' : themeColor,
          textAlign: 'center',
          marginTop: 2,
          opacity: isRemembrance ? 0.7 : 0.9,
          fontFamily: isRemembrance ? 'var(--font-mono)' : 'inherit',
        }}>
          {primaryHoliday.symbol}
          {holidays.length > 1 && (
            <span style={{ fontSize: 7, marginLeft: 2, color: 'var(--text-faint)', verticalAlign: 'top' }}>
              +{holidays.length - 1}
            </span>
          )}
        </div>
      )}

      {/* Multi-day event bars */}
      {multiDay.length > 0 && (
        <div style={{ marginTop: 'auto', marginBottom: singleDay.length > 0 ? 2 : 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {multiDay.slice(0, 2).map(e => {
            const pos = classifyEvent(e, isoDate);
            const color = categoryById(categories, e.categoryId)?.color || 'var(--text-muted)';
            return (
              <span key={e.id} style={{
                height: 3,
                background: `${color}cc`,
                marginLeft: pos === 'start' || pos === 'single' ? 2 : -2,
                marginRight: pos === 'end'   || pos === 'single' ? 2 : -2,
                borderRadius: pos === 'single' ? 2
                  : pos === 'start' ? '2px 0 0 2px'
                  : pos === 'end'   ? '0 2px 2px 0' : 0,
              }} />
            );
          })}
          {multiDay.length > 2 && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 7, color: 'var(--text-muted)', textAlign: 'center' }}>
              +{multiDay.length - 2}
            </span>
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
              background: categoryById(categories, e.categoryId)?.color || 'var(--text-muted)',
            }} />
          ))}
          {singleDay.length > 4 && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--text-muted)' }}>
              +{singleDay.length - 4}
            </span>
          )}
        </div>
      )}
    </button>
  );
}

function PlanningCell({ isoDate, events, categories, isToday, themeColor, year, onClick }) {
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
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: themeColor }}>✦</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--text-primary)' }}>Planning Day</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
        {fmtGreg(isoDate)}
      </div>
      {events.length > 0 && (
        <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 12, color: 'var(--text-secondary)' }}>
          {events.length} event{events.length === 1 ? '' : 's'}
        </div>
      )}
    </button>
  );
}
