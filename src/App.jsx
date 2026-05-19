import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  gregToGreek,
  greekMonthRange,
  nextGreekMonth,
  prevGreekMonth,
  SEASONAL_THEMES,
  GREEK_MONTHS,
  todayISO,
} from './constants.js';
import { loadState, saveState, newEvent, eventsForDate } from './storage.js';
import MonthView from './components/MonthView.jsx';
import AgendaView from './components/AgendaView.jsx';
import EventModal from './components/EventModal.jsx';
import DayDetail from './components/DayDetail.jsx';
import SeasonalBanner from './components/SeasonalBanner.jsx';

export default function App() {
  const [state, setState] = useState(() => loadState());
  const [view, setView] = useState(() => {
    const today = gregToGreek(todayISO()) || { monthId: 'M01', year: new Date().getFullYear() };
    return { monthId: today.monthId, year: today.year };
  });
  const [viewMode, setViewMode] = useState('month'); // 'month' | 'agenda'
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => { saveState(state); }, [state]);

  // ─── Navigation ───
  const goPrev = () => setView(v => prevGreekMonth(v.monthId, v.year));
  const goNext = () => setView(v => nextGreekMonth(v.monthId, v.year));
  const goToday = () => {
    const t = gregToGreek(todayISO());
    if (t) setView({ monthId: t.monthId, year: t.year });
  };

  // ─── Event CRUD ───
  const saveEvent = useCallback((evt) => {
    setState(s => {
      const existing = s.events.findIndex(e => e.id === evt.id);
      const events = existing >= 0
        ? s.events.map((e, i) => i === existing ? evt : e)
        : [...s.events, evt];
      return { ...s, events };
    });
    setEditingEvent(null);
  }, []);

  const deleteEvent = useCallback((id) => {
    setState(s => ({ ...s, events: s.events.filter(e => e.id !== id) }));
    setEditingEvent(null);
  }, []);

  const startNewEvent = (isoDate) => {
    setEditingEvent(newEvent({ date: isoDate }));
  };

  // ─── Derived month metadata ───
  const monthMeta = useMemo(() => {
    if (view.monthId === 'PLANNING') {
      return {
        name: 'Planning Day',
        letter: '✦',
        theme: SEASONAL_THEMES.PLANNING,
        range: greekMonthRange('PLANNING', view.year),
      };
    }
    const m = GREEK_MONTHS.find(gm => gm.id === view.monthId);
    return {
      name: m.name,
      letter: m.letter,
      theme: SEASONAL_THEMES[m.id],
      range: greekMonthRange(view.monthId, view.year),
    };
  }, [view]);

  const selectedDateEvents = selectedDate
    ? eventsForDate(state.events, selectedDate)
    : [];

  return (
    <div style={{ position: 'relative', zIndex: 2, paddingBottom: 80 }}>
      <SeasonalBanner
        meta={monthMeta}
        year={view.year}
        viewMode={viewMode}
        onSetViewMode={setViewMode}
        onPrev={goPrev}
        onNext={goNext}
        onToday={goToday}
      />

      {viewMode === 'month' ? (
        <MonthView
          monthId={view.monthId}
          year={view.year}
          themeColor={monthMeta.theme.color}
          events={state.events}
          onDayClick={setSelectedDate}
          today={todayISO()}
        />
      ) : (
        <AgendaView
          monthId={view.monthId}
          year={view.year}
          themeColor={monthMeta.theme.color}
          events={state.events}
          onDayClick={setSelectedDate}
          onEventClick={setEditingEvent}
          today={todayISO()}
        />
      )}

      {selectedDate && (
        <DayDetail
          isoDate={selectedDate}
          events={selectedDateEvents}
          onClose={() => setSelectedDate(null)}
          onAdd={() => startNewEvent(selectedDate)}
          onEdit={(evt) => setEditingEvent(evt)}
        />
      )}

      {editingEvent && (
        <EventModal
          event={editingEvent}
          onSave={saveEvent}
          onDelete={deleteEvent}
          onClose={() => setEditingEvent(null)}
        />
      )}

      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      padding: '8px 16px',
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--text-faint)',
      letterSpacing: '0.15em',
      textAlign: 'center',
      pointerEvents: 'none',
      zIndex: 0,
    }}>
      THE&nbsp;HEARTH&nbsp;·&nbsp;v0.2
    </div>
  );
}
