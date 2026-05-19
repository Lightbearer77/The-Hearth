import { useMemo } from 'react';
import { greekMonthDays, gregToGreek, fmtGreg } from '../constants.js';
import { ASATRU_HOLIDAYS, remindersForDate } from '../holidays.js';
import { eventsForDate, categoryById } from '../storage.js';

export default function AgendaView({ monthId, year, themeColor, events, categories, onDayClick, onEventClick, today }) {
  const days = useMemo(() => greekMonthDays(monthId, year), [monthId, year]);

  const agenda = useMemo(() => {
    const result = [];
    for (const iso of days) {
      const greek = gregToGreek(iso);
      const holidays = ASATRU_HOLIDAYS.filter(
        h => h.greekMonth === greek?.monthId && h.greekDay === greek?.day
      );
      const reminders = remindersForDate(iso, year);
      const dayEvents = eventsForDate(events, iso);

      if (holidays.length === 0 && reminders.length === 0 && dayEvents.length === 0) continue;

      const sortedHolidays = [...holidays].sort((a, b) =>
        (a.type === 'remembrance' ? 1 : 0) - (b.type === 'remembrance' ? 1 : 0)
      );
      const sortedEvents = [...dayEvents].sort((a, b) => {
        if (a.allDay && !b.allDay) return -1;
        if (!a.allDay && b.allDay) return 1;
        return (a.startTime || '').localeCompare(b.startTime || '');
      });

      result.push({
        isoDate: iso, greek,
        holidays: sortedHolidays,
        reminders, events: sortedEvents,
        isToday: iso === today,
      });
    }
    return result;
  }, [days, year, events, today]);

  if (agenda.length === 0) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: 8 }}>
          Empty month.
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-faint)', lineHeight: 1.6 }}>
          No holidays, reminders, or events this month. Tap MONTH to add one.
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '12px 12px 24px' }}>
      {agenda.map(entry => (
        <DayBlock
          key={entry.isoDate}
          entry={entry}
          themeColor={themeColor}
          categories={categories}
          onDayClick={onDayClick}
          onEventClick={onEventClick}
        />
      ))}
    </div>
  );
}

function DayBlock({ entry, themeColor, categories, onDayClick, onEventClick }) {
  const { isoDate, greek, holidays, reminders, events, isToday } = entry;

  return (
    <div style={{
      marginBottom: 14,
      borderLeft: isToday ? `2px solid ${themeColor}` : '2px solid var(--border-subtle)',
      paddingLeft: 12,
    }}>
      <button
        onClick={() => onDayClick(isoDate)}
        style={{
          display: 'flex', alignItems: 'baseline', gap: 10,
          padding: '4px 0 8px', width: '100%', textAlign: 'left',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22, fontWeight: 500,
          color: isToday ? themeColor : 'var(--text-primary)',
          lineHeight: 1,
        }}>
          {greek?.letter}{greek?.day}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 10,
          color: 'var(--text-muted)', letterSpacing: '0.1em',
        }}>
          {fmtGreg(isoDate).toUpperCase()}
        </span>
        {isToday && (
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 9,
            color: themeColor, letterSpacing: '0.2em', marginLeft: 'auto',
          }}>TODAY</span>
        )}
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {holidays.map(h => (
          <HolidayItem key={h.id} holiday={h} themeColor={themeColor} onClick={() => onDayClick(isoDate)} />
        ))}
        {reminders.map((r, i) => (
          <ReminderItem key={`${r.holiday.id}-${i}`} reminder={r} onClick={() => onDayClick(isoDate)} />
        ))}
        {events.map(evt => (
          <EventItem key={evt.id} event={evt} categories={categories} onClick={() => onEventClick(evt)} />
        ))}
      </div>
    </div>
  );
}

function HolidayItem({ holiday, themeColor, onClick }) {
  const isRem = holiday.type === 'remembrance';
  const color = isRem ? 'rgba(180,150,110,0.7)' : themeColor;
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 12px', width: '100%', textAlign: 'left',
      background: isRem ? 'rgba(120,100,80,0.06)' : `${themeColor}10`,
      border: `1px solid ${color}30`,
      borderLeft: `3px solid ${color}`,
      borderRadius: 3,
    }}>
      <span style={{
        fontFamily: isRem ? 'var(--font-mono)' : 'inherit',
        fontSize: 14, color, flexShrink: 0,
      }}>{holiday.symbol}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 500,
          fontStyle: isRem ? 'italic' : 'normal',
          color: 'var(--text-primary)', lineHeight: 1.2,
        }}>{holiday.title}</div>
      </div>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 8,
        color: 'var(--text-faint)', letterSpacing: '0.15em',
      }}>
        {isRem ? 'REMEMBER' : holiday.type.toUpperCase()}
      </span>
    </button>
  );
}

function ReminderItem({ reminder, onClick }) {
  const { holiday, daysAway } = reminder;
  const isRem = holiday.type === 'remembrance';
  const color = isRem ? 'rgba(180,150,110,0.6)' : 'var(--text-muted)';
  const label = daysAway === 1 ? 'tomorrow' : `in ${daysAway} days`;
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '6px 12px', width: '100%', textAlign: 'left',
      background: 'transparent',
      border: '1px dashed var(--border-mid)',
      borderRadius: 3, opacity: 0.85,
    }}>
      <span style={{
        fontFamily: isRem ? 'var(--font-mono)' : 'inherit',
        fontSize: 12, color, flexShrink: 0,
      }}>{holiday.symbol}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 12,
          color: 'var(--text-secondary)', lineHeight: 1.3,
        }}>{holiday.title}</div>
      </div>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 9,
        color: 'var(--text-muted)', letterSpacing: '0.1em',
      }}>{label.toUpperCase()}</span>
    </button>
  );
}

function EventItem({ event, categories, onClick }) {
  const cat = categoryById(categories, event.categoryId);
  const color = cat?.color || 'var(--text-muted)';
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 12px', width: '100%', textAlign: 'left',
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border-subtle)',
      borderLeft: `3px solid ${color}`,
      borderRadius: 3,
    }}>
      {!event.allDay && event.startTime && (
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 10,
          color: 'var(--text-muted)', letterSpacing: '0.05em',
          flexShrink: 0, minWidth: 38,
        }}>{event.startTime}</span>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 13,
          color: 'var(--text-primary)', lineHeight: 1.3,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{event.title || 'Untitled'}</div>
        {event.location && (
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 9,
            color: 'var(--text-muted)', letterSpacing: '0.05em', marginTop: 1,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{event.location}</div>
        )}
      </div>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 9,
        color, letterSpacing: '0.1em', flexShrink: 0,
      }}>{cat?.name?.split(' ')[0].toUpperCase() || event.categoryId}</span>
    </button>
  );
}
